const nunjucks = require('nunjucks');

module.exports = function handler(req, res) {
  // Extract form data from the request
  const formData = {};

  if (req.method === 'POST' && req.body) {
    // For POST requests, data comes in req.body
    Object.assign(formData, req.body);
  } else {
    // For GET requests, data comes in query params
    const url = new URL(req.url, `http://${req.headers.host}`);
    Object.assign(formData, Object.fromEntries(url.searchParams));
  }

  const receivedDate =
    new Date().toLocaleTimeString() +
    '.' +
    new Date().getMilliseconds().toString().padStart(3, '0');

  // Add a delay to simulate network latency
  setTimeout(() => {
    // Configure Nunjucks env
    const env = nunjucks.configure(['backend/behaviors/advanced/sync_drop']);

    // Render template with form data
    const content = env.render('_submit.xml.njk', {
      userInput: formData.message || 'No message provided',
      timestamp: receivedDate,
    });

    res.writeHead(200, { 'Content-Type': 'application/xml' });
    res.write(content);
    res.end();
  }, Math.floor(Math.random() * (500 - 200 + 1)) + 200);
};
