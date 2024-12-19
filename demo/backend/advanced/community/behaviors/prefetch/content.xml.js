const nunjucks = require('nunjucks');

module.exports = function handler(req, res) {
  // Configure Nunjucks env
  const env = nunjucks.configure(
    'backend/advanced/community/behaviors/prefetch',
  );

  // Render sub template
  const content = env.render(`content.xml.njk`);
  res.writeHead(200, { 'Content-Type': 'application/xml' });
  res.write(content);

  // Wait 3 seconds before sending the response
  setTimeout(() => res.end(), 3000);
};
