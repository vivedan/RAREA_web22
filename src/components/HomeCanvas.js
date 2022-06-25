import React, { Suspense, useEffect } from 'react';

import '../styles/style.css';

import {Canvas} from '@react-three/fiber';
import { useSpring, animated } from 'react-spring';

import Model from './Model';
import ProjectIcon from './ProjectIcon';
import CustomCam from './CustomCam';

function HomeCanvas(props) {

    /* const newColors = ['red', 'blue', 'yellow', 'green'];

    const colors = ["#ee7752", "#e73c7e", "#23a6d5", "#23d5ab"]; */

    const originalBackground = "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab) 0% 0%/400% 400%";

    const newBackground = "linear-gradient(-45deg, "+ props.color + ") 0% 0%/400% 400%";

    const background = useSpring({
        background: !props.isHome 
        ? newBackground 
        : originalBackground});

    const canvasBackgroundStyle = {
        ...background,
	    animation: "gradient 15s ease infinite",
    }

    /* useEffect(() => {
        console.log("linear-gradient("+ props.color + ") 0% 0%/400% 400%");
    }, [props.color]) */

    return (
        <animated.div className="canvas" style={canvasBackgroundStyle}>
            <Canvas
                camera={{
                    position: [0, 100, 0],
                    rotation: [0, 0, 0],
                    fov: 25
                }}
                /* camera={{
                    position: [props.cameraPos.x, props.cameraPos.y, props.cameraPos.z],
                }} */
            >
                
                <CustomCam target={props.target} cameraPos={props.cameraPos} />
                
                <ambientLight intensity={0.1} />
                <directionalLight color="red" position={[0, 0, 5]} />
                <Suspense fallback={null}>
                    <Model src="/logo.glb" scale={3} rotation={[0, 0, 0]} color={"white"} transparent={false} opacity={1}/>
                    <Model src="/testBack.glb" scale={1} rotation={[0, 0, 0]} color={"grey"} transparent={false} opacity={1}/>
                    {props.projects && props.projects.map(project => (
                        <ProjectIcon 
                        key={project.node.id} 
                        project={project.node.frontmatter}
                        cameraPos={props.cameraPos}
                        setCameraPos={props.setCameraPos}
                        target={props.target}
                        setTarget={props.setTarget} 
                        prSelected={props.prSelected}
                        setPrSelected={props.setPrSelected}
                        location={props.location}
                        showLabels={props.showLabels}/>                        
                    ))}
                </Suspense>
            </Canvas> 
        </animated.div>
    );
}

export default HomeCanvas;