const fs = require('fs');
const {
  sortCollectionFilter,
  highlightFilter,
  paginateFilter,
  pageCountFilter,
  sectionTitleFilter,
} = require('./.eleventy/filters.js');

module.exports = function (eleventyConfig) {
  eleventyConfig.setServerOptions({
    module: '@11ty/eleventy-server-browsersync',
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
        try {
          const handler = require(`./backend${req._parsedUrl.pathname}.js`);
          if (handler) {
            handler(req, res, next);
          } else {
            // No handler found for route, pass through to 11ty
            next();
          }
        } catch (err) {
          // Error loading the handler, pass through to 11ty
          next();
        }
      }
    },
    server: {
      baseDir: '.',
      directory: true,
    },
  });
  // Pass through any XML files that haven't been ported yet.
  // Once everything is ported, we can remove this.
  eleventyConfig.addPassthroughCopy('backend/**/*.xml');
  // Pass through images used by different screens.
  eleventyConfig.addPassthroughCopy('backend/**/*.jpg');
  eleventyConfig.addPassthroughCopy('backend/**/*.jpeg');
  eleventyConfig.addPassthroughCopy('backend/**/*.png');
  // Add filters
  eleventyConfig.addNunjucksFilter('sortCollection', sortCollectionFilter);
  eleventyConfig.addNunjucksFilter('highlight', highlightFilter);
  eleventyConfig.addNunjucksFilter('paginate', paginateFilter);
  eleventyConfig.addNunjucksFilter('pageCount', pageCountFilter);
  eleventyConfig.addNunjucksFilter('sectionTitle', sectionTitleFilter);
  eleventyConfig.addCollection('files', function (collectionApi) {
    const getDirs = path =>
      fs
        .readdirSync(path, { withFileTypes: true })
        .filter(f => f.isDirectory() && !f.name.startsWith('_'))
        .map(f => f.name);

    // Create collection based on directory structure
    const root = 'backend';

    // Root level
    const x = getDirs(root).reduce(
      (acc, d) => ({
        ...acc,
        // Bottom tab level
        [d]: getDirs(`${root}/${d}`).reduce(
          (subacc, subd) => ({
            ...subacc,
            // Top tab level
            [subd]: getDirs(`${root}/${d}/${subd}`),
          }),
          {},
        ),
      }),
      {},
    );
    // collectionApi
    //       .getFilteredByGlob(`backend/${d.name}/*/*/index*`)
    //       .map(i => i.url),
    console.log(x);
    // collectionApi.addTemplateFile(file, 'backend/' + file);
    // getFilteredByGlob
    // console.log(collectionApi.getFilteredByTag('UI/UI Elements/Text').map((i) => [
    //   i.outputPath, i.template
    // ]));
    return [];
  });
  // Output into demo folder for serving both github pages and local development
  return {
    dir: {
      input: 'backend',
      output: 'hyperview/public',
    },
  };
};
