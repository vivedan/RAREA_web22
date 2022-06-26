import React, { useState, useEffect, useRef } from 'react';

import { useStaticQuery, graphql } from 'gatsby';

import * as THREE from 'three';

import { useBreakpoint } from 'gatsby-plugin-breakpoints';


import Header from './Header';
import Footer from './Footer';
import HomeCanvas from './HomeCanvas';
import ProjectList from './ProjectList';

import '../styles/style.css';
import MainOverlay from './MainOverlay';

import _ from 'lodash';


function Layout({children, location}) {
    
    //DATA QUERY
    const data = useStaticQuery(graphql`
        query ProjectIndex {
            virtualArch: allMarkdownRemark(filter: {frontmatter: {types: {eq: "Virtual Architecture"}}}) {
                edges {
                node {
                    id
                    frontmatter {
                                title
                                slug
                                subtitle
                                logo
                                position
                    }
                }
                }
            },
            textileArch: allMarkdownRemark(filter: {frontmatter: {types: {eq: "Textile Architecture"}}}) {
                edges {
                node {
                    id
                    frontmatter {
                                title
                                slug
                                subtitle
                                logo
                                position
                    }
                }
                }
            },
            other: allMarkdownRemark(filter: {frontmatter: {types: {eq: "Other"}}}) {
                edges {
                node {
                    id
                    frontmatter {
                                title
                                slug
                                subtitle
                                logo
                                position
                    }
                }
                }
            },
            research: allMarkdownRemark(filter: {frontmatter: {types: {eq: "Research"}}}) {
                edges {
                node {
                    id
                    frontmatter {
                                title
                                slug
                                subtitle
                                logo
                                position
                    }
                }
                }
            }
        }
    `)

    

    //QUERY CATEGORY DISTRIBUTION

    const {virtualArch, textileArch, other, research} = data;

    const virtualProjects = virtualArch.edges;

    const textileProjects = textileArch.edges;

    const otherProjects = other.edges;

    const researchProjects = research.edges;

    const joinProjects = virtualProjects.concat(textileProjects, otherProjects, researchProjects);


    const allProjects = _.uniqWith(joinProjects, _.isEqual); //Delete duplicates in array

    const [listActive, setListActive] = useState(false);

    const [showLabels, setShowLabels] = useState(false);

    const [is3D, set3D] = useState(false);

    const [projectSelection, setProjectSelection] = useState(["allProjects"]);

    //let merge = [];

    const [menuProjects, setMenuProjects] = useState(allProjects);

    function toggleProjects(type) {
        //let category = eval(type);
        //console.log(type);
        if(type==="allProjects"){
            setProjectSelection(["allProjects"]);
        }else{
            setProjectSelection(prs => {
                    if(prs.includes(type)){
                        //console.log("category found")
                        let index = prs.indexOf(type);
                        return prs.filter(item => item !== type)
                    }else{
                        //console.log("category not found");
                        if(projectSelection[0]==="allProjects"){
                            return prs.filter(item => item !== "allProjects").concat(type);
                        }
                        return prs.concat(type);
                    }
                
            })
        }
    }

    // CHECK IF FIRST RENDER
    const mountRef = useRef(false);

    const [isFirstTime, setIsFirstTime] = useState(true);

    useEffect(() => {
        
        if(!mountRef.current){
            //console.log(mountRef.current)
            mountRef.current = true;
        }else if(projectSelection[0]==="allProjects"){
            setMenuProjects(allProjects);
        }else if(projectSelection.length === 0){
            //return setMenuProjects([]);
            setProjectSelection(["allProjects"]);
        }
        else if(projectSelection.length === 4){
            setProjectSelection(["allProjects"]);
        }
        else{
            //console.log(projectSelection);
            let prs = projectSelection.map(cat => eval(cat));
            let joined = [...prs.flat(1)]
            setMenuProjects(_.uniqWith(joined, _.isEqual)); //Delete duplicate projects
            //setMenuProjects([...prs.flat(1)]);
        }
        
    }, [projectSelection])


    /* useEffect(() => {
        console.log(menuProjects);
    }, [menuProjects]) */

    const camPCHeight = 130;
    const camMobileHeight = 200;
    
    const [cameraPos, setCameraPos] = useState({x: 0, y: camPCHeight, z: 0});

    const [target, setTarget] = useState({x: 0, y: 0, z: 0});

    const [prSelected, setPrSelected] = useState(null);
    const [isHome, setHome] = useState(true);

    const [color, setColor] = useState("#ee7752, #e73c7e, #23a6d5, #23d5ab");

    const breakpoints = useBreakpoint(); // xs-320 / sm-720 / md-1024 / l-1536

    //READ LOCATION.STATE TO KNOW IF ITS HOME OR PROJECT -> THEN CHANGE TARGET
    useEffect(() => {
        //console.log(children.props.data)
        if(location.state){
            if(location.state.unselectedProject){
                //console.log('home');
                setHome(true);
                setTarget(new THREE.Vector3(0, 0, 0));
            }else{//NOT HOME
                //console.log('project');
                setHome(false);
                setIsFirstTime(false);
                if(children.props.data){ //NOT HOME, IS A PROJECT
                    let prPos = children.props.data.info.nodes[0].frontmatter.position;
                    let targetPos = new THREE.Vector3(prPos[0], prPos[1], prPos[2]);
                    if(breakpoints.sm){
                        if(breakpoints.portrait){
                            let newTar = targetPos.add(new THREE.Vector3(0, -8, 0));
                            setTarget(newTar);
                        }else{
                            let newTar = targetPos.add(new THREE.Vector3(0, 0, 20));
                            setTarget(newTar);
                        }
                        
                    }else{
                        let newTar = targetPos.add(new THREE.Vector3(0, 0, 10));
                        setTarget(newTar);
                    }
                }else{ //NOT HOME & NOT A PROJECT
                    
                    let targetPos = new THREE.Vector3(0, 0, 0);
                    if(breakpoints.sm){
                        if(breakpoints.portrait){
                            let newTar = targetPos.add(new THREE.Vector3(0, -8, 0));
                            setTarget(newTar);
                        }else{
                            let newTar = targetPos.add(new THREE.Vector3(3, 0, 0));
                            setTarget(newTar);
                        }
                        
                    }else{
                        let newTar = targetPos.add(new THREE.Vector3(3, 0, 0));
                        setTarget(newTar);
                    }
                }
                
                
            }
        }else{
            //console.log('project');
            setHome(true);
            setTarget(new THREE.Vector3(0, 0, 0));
        }

    }, [location.state])

    // WHEN TARGET IS CHANGED -> CHANGE CAMERA POSITION
    useEffect(() => {
        //MAYBE THIS IF IS INNECESSARY, ONLY LEAVE ELSE?
        if(isHome){
            if(breakpoints.sm){
                setCameraPos(new THREE.Vector3(0, camMobileHeight, 0))
            }else{
                setCameraPos(new THREE.Vector3(0, camPCHeight, 0))
            }
        }else{
            //CHECK IF PROJECT OR OTHER
            if(children.props.data){
                let prPos = children.props.data.info.nodes[0].frontmatter.position;
                let pos = new THREE.Vector3(prPos[0], prPos[1], prPos[2]);
                if(breakpoints.sm){
                    if(breakpoints.portrait){
                        let newPos = pos.add(new THREE.Vector3(-70, -20, 0));
                        setCameraPos(newPos);
                    }else{
                        let newPos = pos.add(new THREE.Vector3(-70, -10, 0));
                        setCameraPos(newPos);
                    }
                    
                }else{
                    let newPos = pos.add(new THREE.Vector3(-10, 0, 22));
                    setCameraPos(newPos);
                }
            }else{
                let prPos = [0, 10, 0];
                let pos = new THREE.Vector3(prPos[0], prPos[1], prPos[2]);
                if(breakpoints.sm){
                    if(breakpoints.portrait){
                        let newPos = pos.add(new THREE.Vector3(2, 0, 2));
                        setCameraPos(newPos);
                    }else{
                        let newPos = pos.add(new THREE.Vector3(3, 0, 3));
                        setCameraPos(newPos);
                    }
                    
                }else{
                    let newPos = pos.add(new THREE.Vector3(3, 0, 3));
                    setCameraPos(newPos);
                }
            }
            
            
        }
        
    }, [target])


    // WHEN CAMERA POSITION IS CHANGED -> CHANGE PROJECT SELECTED VARIABLE TO PASS TO CAMERA 
    useEffect(() => {
        if(isHome){//HOME
            setPrSelected(null);
            //console.log('home');
            
        }else if(children.props.data){//PROJECT
            let prSlug = children.props.data.info.nodes[0].frontmatter.slug;
            let bgColor = children.props.data.info.nodes[0].frontmatter.background.join();
            setColor(bgColor);
            setPrSelected(prSlug);
            //console.log("project: " + children.props.data.info.nodes[0].frontmatter.title);
        }else{//OTHER
            let bgColor = "darkgrey, orange, blue, black";
            setColor(bgColor);
        }
    }, [cameraPos])

    useEffect(() =>{
        if(is3D){
            if(breakpoints.sm){
                setCameraPos(new THREE.Vector3(-35, 30, 30))
            }else{
                setCameraPos(new THREE.Vector3(-35, 15, 30))
            }
        }else{
            if(breakpoints.sm){
                setCameraPos(new THREE.Vector3(0, camMobileHeight, 0))
            }else{
                setCameraPos(new THREE.Vector3(0, camPCHeight, 0))
            }
        }
    }, [is3D])

    
    //console.log(breakpoints);

    //<div className="mainCont" style={{overflow: isFirstTime ? "hidden" : "hidden scroll"}}>

    return (
        <div className="mainCont" style={{overflow: "hidden"}}>
            {isHome && <Header />}
            {isFirstTime && isHome && <MainOverlay setIsFirstTime={setIsFirstTime}/>}
            <HomeCanvas 
                projects={menuProjects}
                cameraPos={cameraPos}
                setCameraPos={setCameraPos}
                target={target}
                setTarget={setTarget}
                prSelected={prSelected}
                setPrSelected={setPrSelected}
                location={location.state}
                color={color}
                showLabels={showLabels}
                isHome={isHome}
            />
            {listActive && <ProjectList projects={menuProjects} setListActive={setListActive} mobile={breakpoints.sm}/> }
            {isHome && <Footer 
                toggleProjects={toggleProjects}
                set3D={set3D} 
                is3D={is3D} 
                setListActive={setListActive} 
                listActive={listActive} 
                setShowLabels={setShowLabels} 
                showLabels={showLabels}
                categoryArray={projectSelection}
                mobile={breakpoints.sm}
                />}
                
            {children}
        </div>
    );
}

export default Layout;