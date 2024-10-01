module.exports = {
  permalink(data) {
    // Check if the file extension is .xml.njk
    if (data.page.inputPath.endsWith('.xml.njk')) {
      // Generate permalink by replacing .xml.njk with .xml
      return data.page.filePathStem;
    }
    // Default behavior for other files
    return data.permalink;
  },
};
