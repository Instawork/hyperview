module.exports = function (eleventyConfig) {
  // Padd through any XML files that haven't been ported yet.
  eleventyConfig.addPassthroughCopy("examples/**/*.xml");
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
