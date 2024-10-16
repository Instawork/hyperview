const nunjucks = require('nunjucks');

// Filter that sorts collections of files in alphabetical order
const sortCollectionFilter = collection => {
  if (collection) {
    return collection.sort((a, b) => {
      return a.template.inputPath > b.template.inputPath;
    });
  }
  return collection;
};

// Filter that highlights search terms in a string
const highlightFilter = (text, term) => {
  if (!term) {
    return text;
  }
  const index = text.toLowerCase().indexOf(term.toLowerCase());
  if (index === -1) {
    return text;
  }
  const before = text.substring(0, index);
  const match = text.substring(index, index + term.length);
  const after = text.substring(index + term.length);
  return `${before}<text style="highlight">${match}</text>${after}`;
};

// Filter that slice a collection based on page number and items per page
const paginateFilter = (list, pageNumber, itemsPerPage = 20) =>
  list.slice((pageNumber - 1) * itemsPerPage, pageNumber * itemsPerPage);

// Filter that slice a collection based on page number and items per page
const pageCountFilter = (list, itemsPerPage = 20) =>
  Math.ceil(list.length / itemsPerPage);

const sectionTitleFilter = tag => {
  const segments = tag.split('/');
  return segments[segments.length - 1];
};

module.exports = {
  sortCollectionFilter,
  highlightFilter,
  paginateFilter,
  pageCountFilter,
  sectionTitleFilter,
};
