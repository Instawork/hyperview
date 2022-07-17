module.exports = function (eleventyConfig) {
  eleventyConfig.setBrowserSyncConfig({
    middleware: function (req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'x-hyperview-dimensions,x-hyperview-version,pragma,expires,cache-control',
      );
      if (req.method === 'OPTIONS') {
        res.writeHead(200, {});
        res.end();
      } else {
        next();
      }
    },
  });
  // Pass through any XML files that haven't been ported yet.
  // Once everything is ported, we can remove this.
  eleventyConfig.addPassthroughCopy("examples/**/*.xml");
  // Pass through images used by different screens.
  eleventyConfig.addPassthroughCopy("examples/**/*.jpg");
  eleventyConfig.addPassthroughCopy("examples/**/*.jpeg");
  eleventyConfig.addPassthroughCopy("examples/**/*.png");
  return {
    dir: {
      input: "examples",
      output: "_examples_site",
    },
  };
};
