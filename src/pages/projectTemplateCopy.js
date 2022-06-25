import { graphql } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import React, { Component, useEffect, useState } from 'react';

import projectData from '../projects/projectData';

function ProjectTemplateCopy( props ) {

    //const [project, setProject] = useState(projectData[0]);

    const { data } = props;

    const { frontmatter, id, html } = data.info.nodes[0];

    const { credits, date, links, subtitle, tags, title, types, video } = frontmatter;

    const images = data.images.edges;

    console.log(images);
    
    //const imgPath = require.context(project.imagesPath, true, /\.jpg\.svg\.gif\.png$/);

    //console.log(imgPath);

    return (
        <div>
            <h1 className="project-title">{title}</h1>
            <h2 className="project-subtitle">{subtitle}</h2>
            <h4 className="project-type">{types}</h4>
            <h4 className="project-date">{date}</h4>
            <h4 className="project-credits">{credits}</h4>
            <div className="project-description" dangerouslySetInnerHTML={{__html: html}}/>

            {links.map(link => (
                <a href={link} target="_blank">{link}</a>
            ))}

            {tags.map(tag => (
                <p>{tag}</p>
            ))}

            {images.map(image => (
                <GatsbyImage image={image.node.childImageSharp.gatsbyImageData} alt={image.node.id} key={image.node.id}/>
            ))}

        </div>
    );
}

export default ProjectTemplateCopy;

export const query = graphql`query ProjectDetails {
  images: allFile(
    filter: {extension: {regex: "/(jpg)|(png)|(jpeg)/"}, relativeDirectory: {eq: "assets/encuentros"}}
  ) {
    edges {
      node {
        id
        base
        childImageSharp {
          gatsbyImageData(layout: FULL_WIDTH)
        }
      }
    }
  }
  info: allMarkdownRemark {
    nodes {
      id
      html
      frontmatter {
        title
        credits
        date
        imagesPath
        links
        slug
        subtitle
        tags
        types
        video
      }
    }
  }
}
`