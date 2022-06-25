import React, { useState, useEffect } from 'react';

import '../styles/style.css';

import {Canvas} from '@react-three/fiber';

import { Box, OrbitControls } from '@react-three/drei'

function CanvasSelf({children}) {
    return (
        <div className="canvasCont">
            <div className="canvas">
                <Canvas>
                    <OrbitControls />
                    <Box></Box>
                </Canvas>
            </div>
            {children}
        </div>
        
     );
}

export default CanvasSelf;