const express = require('express');
const app = express();
const port = process.argv[2];

app.get('/', (req, res) => res.send('Hello World!'));

const cacheControlDirectives = [
  'max-age',
  'stale-while-revalidate',
  'stale-if-error',
];

var cacheHeaders = function(req, res, next) {
  const cacheControl = cacheControlDirectives.reduce((s, directive) => {
    const param = req.query[directive];
    return s + (param ? ` ${directive}=${param}` : '');
  }, '');
  res.set('Cache-Control', cacheControl);
  next();
};

app.use(cacheHeaders);

const options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['xml'],
  index: false,
  redirect: false,
};
app.use(express.static('examples', options));

app.listen(port, () => console.log(`XML Server listening on port ${port}!`));
