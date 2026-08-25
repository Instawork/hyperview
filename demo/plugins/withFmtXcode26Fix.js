const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

// fmt 11.0.2 (via RCT-Folly) sets FMT_USE_CONSTEVAL 1 on Apple Clang 14+.
// Xcode 26's Clang rejects FMT_STRING(...) in format-inl.h as not a constant
// expression. Disable consteval until RN ships fmt 12.1+.
const MARKER = 'Xcode 26 workaround';

const HOOK = `
    # ${MARKER}: fmt 11 FMT_STRING consteval fails on Apple Clang 21
    fmt_base = File.join(installer.sandbox.root, 'fmt', 'include', 'fmt', 'base.h')
    if File.exist?(fmt_base)
      content = File.read(fmt_base)
      unless content.include?('${MARKER}')
        patched = content.gsub(
          /^(#elif defined\\(__cpp_consteval\\)\\n#  define FMT_USE_CONSTEVAL) 1/,
          "// ${MARKER}: disable consteval\\n\\\\1 0"
        )
        if patched != content
          File.chmod(0644, fmt_base)
          File.write(fmt_base, patched)
        end
      end
    end
`;

const withFmtXcode26Fix = config =>
  withDangerousMod(config, [
    'ios',
    async config => {
      const podfilePath = path.join(
        config.modRequest.platformProjectRoot,
        'Podfile',
      );
      let podfile = await fs.promises.readFile(podfilePath, 'utf8');
      if (podfile.includes(MARKER)) {
        return config;
      }
      if (!podfile.includes('post_install do |installer|')) {
        throw new Error(
          'withFmtXcode26Fix: Podfile has no post_install block',
        );
      }
      podfile = podfile.replace(
        'post_install do |installer|\n',
        `post_install do |installer|\n${HOOK}`,
      );
      await fs.promises.writeFile(podfilePath, podfile);
      return config;
    },
  ]);

module.exports = withFmtXcode26Fix;
