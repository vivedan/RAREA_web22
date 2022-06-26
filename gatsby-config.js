require("dotenv").config()

const myCustomQueries = {
  xs: '(max-width: 320px)',
  sm: '(max-width: 900px)',//720px
  md: '(max-width: 1024px)',
  l: '(max-width: 1536px)',
  portrait: '(orientation: portrait)',
};

module.exports = {
  siteMetadata: {
    title: "Rarea Studio",
    titleTemplate: "%s · Experimental Experience Architecture",
    description: "Rarea is a studio researching flexible art experiences through virtual and textile architectural design.",
    url: "https://rareastudio.com", // No trailing slash allowed!
    image: "/RAREA_portrait1.jpg", // Path to the image placed in the 'static' folder, in the project's root directory.
    twitterUsername: "@RareaStudio",
    facebookUsername: "rareastudio",
    siteLanguage: "en",
    ogLanguage: "en_GB",
    author: "Rarea Studio"
  },
  plugins: [
    'gatsby-plugin-transition-link',
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    'gatsby-transformer-remark',
    'gatsby-plugin-lodash',
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Rarea Studio`,
        short_name: `Rarea`,
        description: `Rarea is a studio researching flexible art experiences through virtual and textile architectural design`,
        lang: `en`,
        icon: `src/images/favicon.png`,
        start_url: `/`,
      },
    },
    {
      resolve: "gatsby-plugin-breakpoints",
      options: {
          queries: myCustomQueries,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `projects`,
        path: `${__dirname}/src/projects/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `entry`,
        path: `${__dirname}/src/images/entry`,
      },
    },
    {
      resolve: "gatsby-plugin-web-font-loader",
      options: {
        typekit: {
          id: process.env.TYPEKIT_ID,
        },
      },
    },
  ],
}
