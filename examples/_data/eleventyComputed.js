module.exports = {
  permalink: function (data) {
    // Check if the file extension is .xml.njk
    if (data.page.inputPath.endsWith('.xml.njk')) {
      // Generate permalink by replacing .xml.njk with .xml
      console.log(
        'eleventy : ',
        data.page.inputPath,
        '  ',
        data.page.filePathStem,
      );
      return data.page.filePathStem;
    }
    // Default behavior for other files
    // console.log('eleventy : ', data.permalink);
    return data.permalink;
  },
};
