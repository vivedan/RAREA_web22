import React, { useState, useEffect, useRef } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';

import '../styles/style.css';

import { useSpring, animated, config } from 'react-spring';

import 'animate.css';

import {TextLoop} from 'react-text-loop-next';

function Slider(props){

    //const {data} = props;
    //const images = data.entryImages.edges;

    const data = useStaticQuery(
        graphql`
        query EntryData {
          entryImages: allFile(
              filter: {extension: {regex: "/(jpg)|(jpeg)|(png)/"}, sourceInstanceName: {eq: "entry"}}
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
          }`
    )

    const images = data.entryImages.edges;

    //console.log(images);

    const [image, setImage] = useState(images[0]);

    const [imageUpdate, setUpdate] = useState(false);

    const [index, setIndex] = useState(1);

    const [isMounted, setMounted] = useState(false);


    //CHECK MOUNT / UNMOUNT OF COMPONENTS TO CHECK THE LEAK ON TIMEOUT OF ANIMATION
    useEffect(() => {
        setMounted(true);

        return () => {setMounted(false)};
    }, [])

    useEffect(() => {
        if(isMounted){
            //console.log("is mounted")
            setImage(images[1])
        }
    }, [isMounted])

    function loopImage(){
        if(index < (images.length - 1 )){
            setIndex(index + 1);
            setImage(images[index + 1]);
        }else{
            setIndex(0);
            setImage(images[0]);
        }
    }

    //TIMEOUT TO UPDATE IMAGE WHEN SCALE ANIMATION IS FINISHED
    useEffect(() => {
        //console.log(isMounted)
        setUpdate(true);
        setTimeout(() => {
            if(isMounted){
                setUpdate(false);
                loopImage();
            }
            
        }, 5000) // TIMEOUT NEEDS MATCHING THE DURATION OF CSS ANIMATION imageScale
    }, [image])


    return(
        <div className="sliderCont masked">
            <GatsbyImage className={`entryImg ${imageUpdate ? "animateScale" : ""}`} image={image.node.childImageSharp.gatsbyImageData} alt={image.node.id} key={image.node.id}/>
        </div>
    )
}

function MainOverlay(props) {
    //animate__animated animate__fadeOut
    const [overlay, setOverlay] = useState(true);

    //TIMEOUT TO DEACTIVATE OVERLAY WHEN SCALE ANIMATION IS FINISHED
    useEffect(() => {
        if(!overlay){
            setTimeout(()=>{
                props.setIsFirstTime(false);
            }, 2000) // TIMEOUT NEEDS MATCHING THE DURATION OF CSS ANIMATION overlayAnim
            
        }
    }, [overlay])

    return (
        <div className={`overlayMainCont ${!overlay ? "animateOverlay" : ""}`} onClick={()=>setOverlay(false)} >

            <Slider />

            {overlay && <div>
                <div className="overlayTextCont">
                    <h1 className="overlayTitle">Rarea Studio</h1>
                    <h2 className="overlaySubtitle">
                        Designing{" "}
                        <TextLoop>
                            <span>invisible</span>
                            <span>evolving</span>
                            <span>textile</span>
                            <span>virtual</span>
                            <span>alternative</span>
                            <span>immersive</span>
                            <span>fluid</span>
                            <span>digital</span>
                        </TextLoop>{" "}
                        Architecture
                    </h2>
                </div>

                <div className="overlayTextContDouble" onClick={()=>setOverlay(false)}>
                    <h1 className="overlayTitle">Rarea Studio</h1>
                    <h2 className="overlaySubtitle">
                        Designing{" "}
                        <TextLoop>
                            <span>invisible</span>
                            <span>evolving</span>
                            <span>textile</span>
                            <span>virtual</span>
                            <span>alternative</span>
                            <span>immersive</span>
                            <span>fluid</span>
                            <span>digital</span>
                        </TextLoop>{" "}
                        Architecture
                    </h2>
                </div>
            </div>}

            {/* <div className="mainOverlay" onClick={() => props.setIsFirstTime(false)}>
                
                <div className="overlayTextCont">
                    <h1 className="overlayTitle">Rarea Studio</h1>
                    <h2 className="overlaySubtitle">
                        Designing{" "}
                        <TextLoop>
                            <span>invisible</span>
                            <span>evolving</span>
                            <span>textile</span>
                            <span>virtual</span>
                            <span>alternative</span>
                            <span>immersive</span>
                            <span>fluid</span>
                            <span>digital</span>
                        </TextLoop>{" "}
                        Architecture
                    </h2>
                </div>
                
            </div> */}
        </div>
    );
}

export default MainOverlay;


/* export const query = graphql`
  query EntryData {
    entryImages: allFile(
        filter: {extension: {regex: "/(jpg)|(jpeg)|(png)/"}, sourceInstanceName: {eq: "entry"}}
      ) {
        edges {
              node {
                childImageSharp {
                  fluid(maxWidth: 300, quality: 100) {
                  originalName
                    ...GatsbyImageSharpFluid
                  }
                }
              }
            }
        }
    }
` */