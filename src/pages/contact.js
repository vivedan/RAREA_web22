import { graphql, navigate } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import React, { Component, useEffect, useState } from 'react';

import * as projectStyles from '../styles/projects.module.css';

import SEO from '../components/Seo';
import 'animate.css';
import {CSSTransition} from 'react-transition-group';


function ContactTemplate( props ) {


    function handleClick(){
      //console.log('come back!')
      navigate('/', { state: { unselectedProject: true } });
    }


    return (
        <>
          <SEO title="Contact" /> 
          <div className={projectStyles.projectCont} >
            <div className={projectStyles.restCont} onClick={(e) => handleClick()}></div>
            <div className={`${projectStyles.projectWrapper} animate__animated animate__fadeInRightBig`}>
              <div className={projectStyles.close} onClick={(e) => handleClick()}></div>
              <div className={projectStyles.line}></div>
              <img className={projectStyles.imgPortrait} src="/RAREA_portrait1.jpg" />
              <div className={projectStyles.contactCont}>
                <div className={projectStyles.contactDataCont}>
                  <h1>Rarea Studio</h1>
                  <h2>Patricia Mascarell & Daniel Vera</h2>
                  <p>T. +44 (0) 7491784705</p>
                  <p>info@rareastudio.com</p>
                </div>
                <div className={projectStyles.followCont}>
                  <p>Follow us on</p>
                  <a href="https://www.instagram.com/rareastudio/" target="_blank">
                      <p>Instagram</p>
                  </a>
                  <a href="https://twitter.com/RareaStudio" target="_blank">
                      <p>Twitter</p>
                  </a>
                  <a href="https://www.facebook.com/rareastudio" target="_blank">
                      <p>Facebook</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
    );
}

export default ContactTemplate;
