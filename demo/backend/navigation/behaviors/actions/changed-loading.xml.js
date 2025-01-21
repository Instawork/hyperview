const { render } = require('../../../_data/render.js');

module.exports = function handler(req, res) {
  const content = render(req);
  res.writeHead(200, { 'Content-Type': 'application/xml' });
  res.write(content);

  // Add virtual delay
  setTimeout(() => {
    res.end();
  }, 2000);
};
