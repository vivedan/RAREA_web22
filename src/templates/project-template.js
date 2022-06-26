import { graphql, navigate } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import React, { Component, useEffect, useState, useRef } from 'react';

import * as projectStyles from '../styles/projects.module.css';

import 'animate.css';
import {CSSTransition} from 'react-transition-group';


function ProjectTemplate( props ) {

    //const [project, setProject] = useState(projectData[0]);

    const { data } = props;

    const { frontmatter, id, html } = data.info.nodes[0];

    const { credits, date, links, description, subtitle, tags, title, types, video, hero } = frontmatter;

    const images = data.images.edges;

    //console.log(description);

    const relatedProjectsData = data.relatedProjects.edges;

    const [relatedProjects, setRelatedProjects] = useState([]);

    //console.log(relatedProjects)

    const myCont = useRef();

    useEffect(() => {
      //window.scrollTo(0, 0);
      if (data) {
        const prs = getRandomRelatedProjects();
        setRelatedProjects(prs);
      }
    }, [data])

    /* useEffect(() => window.scrollTo(0, 0), []) */

    function getRandomRelatedProjects(){
      const shuffled = [...relatedProjectsData].sort(() => 0.5 - Math.random());
      const amount = 2;

      return shuffled.slice(0, amount);
    }

    function handleClick(){
      //console.log('come back!')
      navigate('/', { state: { unselectedProject: true } });
    }

    function handleClickProject(slug){
      //console.log('come back!')
      navigate('/' + slug, { state: { unselectedProject: false} });
    }



    return (
        <div ref={myCont} className={projectStyles.projectCont} >
          <div className={projectStyles.restCont} onClick={(e) => handleClick()}></div>
          <div className={`${projectStyles.projectWrapper} animate__animated animate__fadeInRightBig`}>
            <div className={projectStyles.close} onClick={(e) => handleClick()}></div>
            <div className={projectStyles.line}></div>
            {/* <h1 className="project-title">{title}</h1>
            <h2 className="project-subtitle">{subtitle}</h2> */}
            <img className={projectStyles.hero} src={hero.publicURL} />
            <div className={projectStyles.projectTextCont}>
              <div className={projectStyles.headerCont}>
                <div className={projectStyles.creditCont}>
                  <div className={projectStyles.typeCont}>
                    {types.map(type => (
                      <h4 className={projectStyles.projectType} key={Math.random()}>{type}</h4>
                    ))}
                  </div>
                  <h4 className={projectStyles.projectCredits}>{credits}</h4>
                  <h4 className={projectStyles.projectDate}>{date}</h4>
                  {links.map(link => (
                    <a href={link} target="_blank" key={Math.random()}>{link}</a>
                  ))}
                  <div className={projectStyles.tagCont}>
                    {tags.map(tag => (
                        <p className={projectStyles.tags} key={Math.random()}>{'#' + tag}</p>
                    ))}
                  </div>
                </div>
                <div className={projectStyles.descriptionCont}>
                  <p className={projectStyles.projectDescription}>{description}</p>
                </div>
              </div>
              
              
              {/* <div className={projectStyles.projectDescription} dangerouslySetInnerHTML={{__html: html}}/> */}

              
            </div>
            <div className={projectStyles.imageCont}>
              {images.map(image => (
                  <GatsbyImage className={projectStyles.img} image={image.node.childImageSharp.gatsbyImageData} alt={image.node.id} key={image.node.id}/>
              ))}
            </div>
            <div className={projectStyles.projectDescriptionBottom} dangerouslySetInnerHTML={{__html: html}}/>
            <div className={projectStyles.relatedCont}>
              <h3>Other similar projects:</h3>
              {relatedProjects && relatedProjects.map(relatedProject => (
                <div className={projectStyles.projectLabelCont} key={Math.random()} onClick={() => handleClickProject(relatedProject.node.frontmatter.slug)}>
                    <h2 className={projectStyles.projectTitle}>{relatedProject.node.frontmatter.title}</h2>
                    <h3 className={projectStyles.projectSubtitle}>{relatedProject.node.frontmatter.subtitle}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
    );
}

export default ProjectTemplate;

export const query = graphql`
  query ProjectData($slug: String, $imagesPath: String, $type: String) {
    images: allFile(
      filter: {extension: {regex: "/(jpg)|(png)|(jpeg)/"}, relativeDirectory: {eq: $imagesPath}}
    ) {
      edges {
        node {
          id
          base
          childImageSharp {
            gatsbyImageData
          }
        }
      }
    }
    info: allMarkdownRemark (
      filter: {
        frontmatter: {slug: {eq: $slug}}
      }
    ) {
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
          position
          background
          description
          hero{
            relativePath
            publicURL
          }
        }
      }
    }
    relatedProjects: allMarkdownRemark(filter: {frontmatter: {types: {eq: $type}, slug: {ne: $slug}}}) {
      edges {
      node {
          id
          frontmatter {
                      title
                      slug
                      subtitle
          }
      }
      }
  },
  }
`