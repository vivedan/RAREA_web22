import React, { useState, useEffect } from 'react';

import { navigate } from "gatsby";

import Model from './Model';
import ProjectLabel from './ProjectLabel';

import {Sphere, useCursor} from '@react-three/drei';

import { useSpring, animated } from '@react-spring/three'

function ProjectIcon(props) {

    const {slug, title, subtitle, logo, position} = props.project;

    const [hovered, setHovered] = useState(false);
    const [selected, setSelected] = useState(false);

    useCursor(hovered);

    function handleClick(e){
        //Stop propagation an go to project page
        e.stopPropagation();
        navigate("/" + slug, { state: { unselectedProject: false } });
    }

    //Set Selected boolean to pass to Label
    useEffect(() =>{
        if(props.prSelected === slug){
            setSelected(true);
        }else{
            setSelected(false);
        }
    }, [props.prSelected])

    //REVISAR ROTACION -> AHORA MISMO VUELVE CUANDO NO ESTA HOVERING, PERO ES TAN LENTO QUE NO SE NOTA
    const {rotation} = useSpring({
        rotation: hovered || selected ? [0, 360, 0] : [0, 0, 0],
        loop: true,
        config: { duration: 500000 }
    });

    return (
        <group position={position} scale={1.5} onClick={(e) => handleClick(e)} >
            <Sphere onPointerEnter={(e) => setHovered(true)} onPointerLeave={(e) => setHovered(false)} scale={3} material-transparent material-opacity={0}/>
            
            <animated.group rotation={rotation}>
                <Model src={logo} scale={1.5} rotation={[0, 0, 0]} color={"white"} transparent={false} opacity={1}/>
            </animated.group>

            {/* <Model src={logo} scale={1.5} rotation={[0, 0, 0]} /> */}
            
            <ProjectLabel hovered={hovered} title={title} subtitle={subtitle} selected={selected} showLabels={props.showLabels} prSelected={props.prSelected}/>
        </group>
    );
}

export default ProjectIcon;