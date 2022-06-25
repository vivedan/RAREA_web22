import React, { useState, useEffect } from 'react';

import '../styles/style.css';

function NavigationButtons(props) {

    const listStyles = {
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "center",
        filter: "invert(1)",
    }

    return (
        <div className="buttonCont">
                <div className="listButton" style={{backgroundImage: "url(/logo_list.png)", transform: props.listActive ? "rotate(90deg)" : "", ...listStyles}} onClick={() => props.setListActive(!props.listActive)}></div>
                <div className="listButton" style={{backgroundImage: props.showLabels ? "url(/logo_lettercross.png)" : "url(/logo_letter.png)", ...listStyles}} onClick={() => props.setShowLabels(!props.showLabels)}></div>
                <div className="listButton" style={{backgroundImage: props.is3D ? "url(/logo_2d.png)" : "url(/logo_3d.png)", ...listStyles}} onClick={() => props.set3D(!props.is3D)}></div>
        </div>
    );
}

export default NavigationButtons;