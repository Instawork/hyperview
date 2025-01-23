const urlParse = require('url-parse');
const nunjucks = require('nunjucks');

function render(req, data = {}) {
  const { pathname } = urlParse(req.originalUrl, true);

  // Configure Nunjucks env
  const env = nunjucks.configure(['backend/_includes', ''], {
    autoescape: false,
  });

  // Render sub template
  const path = pathname.replace(/^\/hyperview\/public/, 'backend');
  return env.render(`${path}.njk`, data);
}

function withFormData(req) {
  const { query } = urlParse(req.originalUrl, true);

  return render(req, {
    // Add JSON stringified data if available
    formData: query ? JSON.stringify(query, null, 2) : null,
  });
}

module.exports = {
  render,
  withFormData,
};
