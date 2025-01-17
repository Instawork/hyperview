const urlParse = require('url-parse');
const nunjucks = require('nunjucks');

function getContent(req, template) {
  const { query } = urlParse(req.originalUrl, true);

  // Configure Nunjucks env
  const env = nunjucks.configure(['backend/_includes', ''], {
    autoescape: false,
  });

  // Render sub template
  const content = env.render(template, {
    // Add JSON stringified data if available
    formData: query ? JSON.stringify(query, null, 2) : null,
  });
  return content;
}

module.exports = {
  getContent,
};
