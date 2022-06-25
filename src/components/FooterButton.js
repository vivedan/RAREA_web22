import React, { useState, useEffect } from 'react';

import '../styles/style.css';

function FooterButton(props) {

    const [clicked, setClicked] = useState(false);

    function handleClick(){
        props.toggleProjects(props.category);
        //setClicked(!clicked);
    }

    useEffect(() => {
        //console.log(props.categoryArray.includes(props.category))
        if(props.categoryArray.includes(props.category)){
            setClicked(true)
        }else{setClicked(false)}
    }, [props.categoryArray])


    return (
        <p className={`footerLink noselect ${clicked ? 'selectionFooter' : ''}`} onClick={handleClick}>{props.name}</p>
    );
}

export default FooterButton;