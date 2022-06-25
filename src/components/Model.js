import React, {useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import { useGLTF, useHelper, BoxHelper } from '@react-three/drei';

import { useSpring, animated, config } from '@react-spring/three';

function Model(props) {

    const model = useGLTF(props.src);

    const modelChildren = model.nodes.Scene.children;


    return (
        <group>
            <mesh
                castShadow
                receiveShadow
                geometry={modelChildren[0].geometry}
                scale={props.scale}
                position={props.position}
                rotation={props.rotation}
            >
                <meshBasicMaterial attach="material" color={props.color} transparent={props.transparent} opacity={props.opacity}></meshBasicMaterial>
            </mesh>

        </group>
    );
}

export default Model;