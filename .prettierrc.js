module.exports = {
  trailingComma: 'all',
  singleQuote: true,
  overrides: [
    {
      files: '*.md',
      options: {
        singleQuote: false,
      },
    },
  ],
};
