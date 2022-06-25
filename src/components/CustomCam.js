import React, { useState, useEffect } from 'react';

import { OrbitControls } from '@react-three/drei';

import { useFrame } from '@react-three/fiber';

function CustomCam({target, cameraPos}) {

    const [active, setActive] = useState(false);

    const delay = 3;

    //READ WHEN CAMERA POSITION HAS CHANGED
    useEffect(() => {
        //set Active for delay seconds
        setActive(true);
        let timer = setTimeout(() => setActive(false), delay * 1000);

        //set Active to false after timer
        return() => {
            clearTimeout(timer);
        }

    }, [cameraPos])


    useFrame(state => {
        //only update camera position if a project has been selected
        if(active){
            state.camera.position.lerp(cameraPos, 0.05);
            state.camera.updateProjectionMatrix();
        }
    })

    return (
        <OrbitControls target={target}/>
    );
}

export default CustomCam;