const urlParse = require('url-parse');
const nunjucks = require('nunjucks');
const { getContent } = require('../../../../_data/form.js');

module.exports = function handler(req, res, next) {
  const content = getContent(
    req,
    'backend/ui/ui-elements/forms/switch/form.xml.njk',
  );
  res.writeHead(200, { 'Content-Type': 'application/xml' });
  res.write(content);
  res.end();
};
