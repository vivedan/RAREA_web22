import React, { useState, useEffect } from 'react';

import {Html} from '@react-three/drei';

function ProjectLabel({hovered, clicked, selected, title, subtitle, showLabels}) {
    if(hovered){
        return (
            <Html 
                center 
                style={{pointerEvents: 'none'}}>
                    <div className="projectLabelCont noselect">
                        <p className="projectLabelTitle">{title}</p>
                        <p className="projectLabelSubtitle">{subtitle}</p>
                    </div>
            </Html>
        );
    }else if(selected){
        return (
            <Html 
                center 
                style={{pointerEvents: 'none'}}>
                    <div className="projectLabelCont noselect">
                        <p className="projectLabelTitle">{title}</p>
                        <p className="projectLabelSubtitle">{subtitle}</p>
                    </div>
            </Html>
        );
    }else if(showLabels){
        return (
            <Html 
                center 
                style={{pointerEvents: 'none'}}>
                    <div className="projectLabelCont noselect">
                        <p className="projectLabelTitle">{title}</p>
                        <p className="projectLabelSubtitle">{subtitle}</p>
                    </div>
            </Html>
        );

    }else{
        return (//null
            <Html center>
                <div className="arrowLabel"></div>
            </Html>
        )
    }
    
}

export default ProjectLabel;