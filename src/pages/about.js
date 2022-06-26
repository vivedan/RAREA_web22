import { graphql, navigate } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import React, { Component, useEffect, useState } from 'react';

import * as projectStyles from '../styles/projects.module.css';

import SEO from '../components/Seo';
import 'animate.css';
import {CSSTransition} from 'react-transition-group';


function AboutTemplate( props ) {


    const about1 = "We all live inside ourselves. It should be our safest place to be. We shape that space. We decide who enters and who stays. Patricia invited Daniel to come to hers (or he invited her to his, we don't remember) 5 years ago. The thing is, we came with our own space and expanded the other more than we could ever imagine. We started dreaming together and building new spaces within our space. We could stay here forever but we thought it was time we shared our own world. Textile is a primary architectural material. Should be at the same level as concrete or at the same level as virtual reality. We keep on trying to blur borders.";

    const about2 = "RAREA is a partnership formed by Patricia Mascarell Llombart and Daniel Vera Villalobos, two Valencian architects based in London. Even though they formally founded the studio quite recently, they have been collaborating in several projects for the past years. In their practice, they seek and explore new methods to present research and an alternative view of architecture. Their work is narrative driven and visual, attempting to open their research in order to provoke critical dialogue among their audiences. To achieve this, they use a wide range of formats and genres: ranging from film to installations and dystopia to utopia."

    const aboutPatricia = "Patricia Mascarell Llombart. Patricia's work and research deal with change in architectural spaces. She talks about, creates and analyses evolving systems and fluid patterns. Patricia is a graduated architect by Universidad Politécnica de Valencia and holds a degree of arts and design in the TXT department, at the Gerrit Rietveld Academie in Amsterdam. She's also a graduate of the Dutch research programme Arts&Research Honours Programme. Besides her career experience in design in Helsinki and London, she has supported many international artists with her curatorial work, including Marieke Schoonderbeek, Praneet Soi and Irene Kopelman. Her artwork has been featured in galleries in Amsterdam and on online gallery events. Currently, she combines her art practice with the labor as co-founder of RAREA and her work as Event Curator & Communication Officer for the Institute of Advanced Studies at UCL London.";

    const aboutDaniel = "Daniel Vera Villalobos. Daniel's work develops in the intersection between architecture and digital arts. His research focuses on the meaning of inhabiting digital spaces. He is an architect by UPV, Valencia, and a masters graduate in Digital Direction by the Royal College of Art, London. He also participated in the Stage Design programme in die Angewandte, University of Applied Arts, Vienna, and holds a masters course in VR with UE4 applied to architecture. He has experience working as an architect in Karlsruhe, Germany and has worked for many years for the Hundertwasserhaus Vienna as a Visual and 3D Artist. Still in collaboration with them, he lives in London combining his work as co-founder of RAREA Studio and also of MAIA digital, a team of RCA graduates working on new models of interaction in virtual environments. Besides that, he is acting as a visiting lecturer in the Creative Computing Institute at the UAL University of Arts London.";

    const about3 = "The combination of both their interests and skills result in projects that question true flexibility in architecture and the distributions of power within architectural processes, from the design to the act of living. In their work, they experiment with different forms of non-linearity to activate different layers of discussion among a wide range of audiences.";


    function handleClick(){
      //console.log('come back!')
      navigate('/', { state: { unselectedProject: true } });
    }


    return (
      <>
          <SEO title="About" /> 
          <div className={projectStyles.projectCont} >
            <div className={projectStyles.restCont} onClick={(e) => handleClick()}></div>
            <div className={`${projectStyles.projectWrapper} animate__animated animate__fadeInRightBig`}>
              <div className={projectStyles.close} onClick={(e) => handleClick()}></div>
              <div className={projectStyles.line}></div>
              <img className={projectStyles.imgPortrait} src="/RAREA_portrait1.jpg" />
              <h1 className={projectStyles.aboutTitle}>Rarea Studio</h1>
              <p className={projectStyles.about1}>{about1}</p>
              <p className={projectStyles.about2}>{about2}</p>
              <div className={projectStyles.aboutFlex}>
                <p className={projectStyles.about2}>{aboutPatricia}</p>
                <p className={projectStyles.about2}>{aboutDaniel}</p>
              </div>
              <p className={projectStyles.about2}>{about3}</p>
            </div>
          </div>
      </>
    );
}

export default AboutTemplate;
