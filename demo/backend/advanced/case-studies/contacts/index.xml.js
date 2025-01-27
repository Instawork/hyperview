const urlParse = require('url-parse');
const contactList = require('../../../_data/contacts.js');
const nunjucks = require('nunjucks');
const {
  highlightFilter,
  paginateFilter,
  pageCountFilter,
} = require('../../../../.eleventy/filters.js');

module.exports = function handler(req, res, next) {
  const { query } = urlParse(req.originalUrl, true);

  // no search or next page? pass through to 11ty to render the entire document
  if (query.search === undefined && !query.page) {
    next();
    return;
  }

  const { search, page = 1, template = '_contacts' } = query;

  // Configure Nunjucks env, and add a custom filters
  const env = nunjucks.configure(['backend/advanced/case-studies/contacts']);
  env.addFilter('highlight', highlightFilter);
  env.addFilter('paginate', paginateFilter);
  env.addFilter('pageCount', pageCountFilter);

  const contacts = search
    ? contactList.filter(contact => contact.name.match(new RegExp(search, 'i')))
    : contactList;

  // Render sub template with filtered / paginated contact list
  const content = env.render(`${template}.xml.njk`, { contacts, page, search });
  res.writeHead(200, { 'Content-Type': 'application/xml' });
  res.write(content);

  // Randomize the response time to simulate network conditions
  const delay = Math.floor(Math.random() * 500);
  setTimeout(() => res.end(), delay);
};
