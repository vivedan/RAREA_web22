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
    siteUrl: `https://www.yourdomain.tld`,
  },
  plugins: [
    'gatsby-plugin-transition-link',
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    'gatsby-transformer-remark',
    'gatsby-plugin-lodash',
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
