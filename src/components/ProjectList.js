import React, { useState, useEffect } from 'react';

import { navigate } from 'gatsby';

import * as listStyles from '../styles/list.module.css';
import 'animate.css';

function ProjectList(props) {

    //console.log(props.mobile);

    const chunkSize = props.mobile ? 3 : 6;

    const [prs, setPrs] = useState([]);

    const [index, setIndex] = useState(0);

    let chunkArray = [];

    for (let i = 0; i < props.projects.length; i += chunkSize) {
        const chunk = props.projects.slice(i, i + chunkSize);
        // do whatever
        //appendChunk(chunk);
        chunkArray.push(chunk);
        //setPrs(prs => [...prs, chunk])
    }

    /* function appendChunk(chunk){
        prs.concat(chunk)
    } */

    /* useEffect(() => {
        //console.log(chunkArray);
        setPrs(chunkArray);
    }, [chunkArray]) */

    function slidePages(dir){
        let i = index + dir;
        console.log(i);
        //console.log(chunkArray.length)
        if (i < 0){
            setIndex((chunkArray.length - 1))
        }else if (i < chunkArray.length){
            setIndex(i)
        }else{
            setIndex(0);
        }

    }

    useEffect(() => {
        console.log(index)
    }, [index])


    function handleClick(slug){
        props.setListActive(false);
        navigate("/" + slug, { state: { unselectedProject: false } });
    }
    

    return ( 
        <div className={listStyles.projectList}>
            <div className={`${listStyles.projectListContainer} animate__animated animate__fadeInBottomLeft`}>
                {(chunkArray.length !== 0) && chunkArray[index].map(project => (
                    <div className={listStyles.projectLabelCont} key={Math.random()} onClick={() => handleClick(project.node.frontmatter.slug)}>
                        <h2>{project.node.frontmatter.title}</h2>
                        <h3>{project.node.frontmatter.subtitle}</h3>
                    </div>
                            
                ))}
                {(chunkArray.length > 1) && <div className={listStyles.arrowCont}>
                    <div className={`${listStyles.arrow} ${listStyles.left}`} onClick={() => slidePages(-1)}></div>
                    <div className={`${listStyles.arrow} ${listStyles.right}`} onClick={() => slidePages(1)}></div>
                </div>}
            </div>
        </div>
    );
}

export default ProjectList;