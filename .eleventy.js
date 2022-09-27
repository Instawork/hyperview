module.exports = function (eleventyConfig) {
  eleventyConfig.setBrowserSyncConfig({
    middleware: function (req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'x-hyperview-dimensions,x-hyperview-version,pragma,expires',
      );
      res.setHeader('Cache-control', 'private, max-age=300')
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
  // Filter that sorts collections of files in alphabetical order
  eleventyConfig.addNunjucksFilter('sort', function (collection) {
    if (collection) {
      return collection.sort(function (a, b) {
        return a.template.inputPath > b.template.inputPath;
      });
    }
  });
  return {
    dir: {
      input: "examples",
      output: "_examples_site",
    },
  };
};
