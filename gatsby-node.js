const path = require('path');

exports.createPages = async ({ graphql, actions }) => {

    const { data } = await graphql(`
        query Projects {
            allMarkdownRemark {
                nodes {
                    frontmatter {
                        imagesPath
                        slug
                        types
                    }
                }
            }
        }
    `)

    data.allMarkdownRemark.nodes.forEach(node => {
        actions.createPage({
            path: node.frontmatter.slug,
            component: path.resolve('./src/templates/project-template.js'),
            context: {
                slug: node.frontmatter.slug,
                imagesPath: node.frontmatter.imagesPath,
                type: node.frontmatter.types[0],
            }
        })
    })

    /* actions.createPage({
      path: "/about",
      component: path.resolve('./src/templates/about-template.js'),
    }) */
}

exports.onCreateWebpackConfig = ({ stage, actions }) => {
    //if (stage.startsWith("build-javascript")) {
      actions.setWebpackConfig({
        module: {
          rules: [
            {
              test: /react-spring/,
              sideEffects: true
            },
            {
              test: /\.glb$/,
              use: [
                `url-loader`,
              ],
            }
          ]
        }
      })
    //}
  }