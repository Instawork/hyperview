const nunjucks = require('nunjucks');

module.exports = function handler(req, res) {
  // Configure Nunjucks env
  const env = nunjucks.configure(
    'backend/advanced/community/behaviors/prefetch',
  );

  // Render sub template
  const content = env.render(`index.xml.njk`, {
    uid: new Date().toISOString(),
  });
  res.writeHead(200, { 'Content-Type': 'application/xml' });
  res.write(content);
};
