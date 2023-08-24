// Filter that sorts collections of files in alphabetical order
const sortCollectionFilter = collection => {
  if (collection) {
    return collection.sort((a, b) => {
      return a.template.inputPath > b.template.inputPath;
    });
  }
  return collection;
};
