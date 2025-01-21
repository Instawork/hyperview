const { withFormData } = require('../../../../_data/render.js');

module.exports = function handler(req, res) {
  const content = withFormData(req);
  res.writeHead(200, { 'Content-Type': 'application/xml' });
  res.write(content);
  res.end();
};
