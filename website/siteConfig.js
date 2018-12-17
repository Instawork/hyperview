/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const siteConfig = {
  title: 'Hyperview', // Title for your website.
  tagline: 'Native mobile apps, as easy as creating a web site',
  url: 'https://hyperview.org', // Your website URL
  baseUrl: '/', // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'Hyperview',
  organizationName: 'Instawork',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  gaTrackingId: 'UA-60169343-7',

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    {doc: 'guide_introduction', label: 'Guides'},
    {doc: 'example_index', label: 'Examples'},
    {doc: 'reference_index', label: 'Reference'},
  ],

  /* path to images for header/footer */
  headerIcon: 'img/hv.svg',
  footerIcon: 'img/hv.svg',
  favicon: 'img/hv.png',

  /* Colors for website */
  colors: {
    primaryColor: '#4778FF',
    secondaryColor: '#255CCC',
  },

  /* Custom fonts for website */
  fonts: {
    mainFont: [
      'Hkgrotesk',
      'sans-serif'
    ],
  },

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Instawork`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'purebasic',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/docusaurus.png',
  twitterImage: 'img/docusaurus.png',

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  repoUrl: 'https://github.com/instawork/hyperview',

  algolia: {
    apiKey: '5f75d41bc2bdd71ea89a54f8870f0ed2',
    indexName: 'hyperview',
    algoliaOptions: {},
  },
};

module.exports = siteConfig;
