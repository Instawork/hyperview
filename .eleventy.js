module.exports = function (eleventyConfig) {
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
