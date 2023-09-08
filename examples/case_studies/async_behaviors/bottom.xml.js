const nunjucks = require('nunjucks');

module.exports = function handler(req, res) {
  // Configure Nunjucks env, and add a custom filters
  const env = nunjucks.configure('examples/case_studies/async_behaviors');

  // Render sub template with filtered / paginated contact list
  const content = env.render('bottom.xml');
  res.writeHead(200, { 'Content-Type': 'application/xml' });
  res.write(content);

  // Randomize the response time to simulate network conditions
  const delay = Math.floor(Math.random() * 3500);
  setTimeout(() => res.end(), delay);
};
