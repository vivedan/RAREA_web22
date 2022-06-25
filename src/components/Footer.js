import React, { useState, useEffect } from 'react';

import '../styles/style.css';
import FooterButton from './FooterButton';
import NavigationButtons from './NavigationButton';

import 'animate.css';

function Footer(props) {
    //console.log(props.mobile);
    const [showFooter, setShowFooter] = useState(false);


    useEffect(() => {
        if(props.listActive){
            setShowFooter(true);
        }else{
            //console.log("called")
            setShowFooter(props.mobile ? false : true)
        }
    }, [props.listActive])


    useEffect(() => {
        setShowFooter(props.mobile ? false : true);
    }, [props.mobile])

    return (
        <div>
            <NavigationButtons 
                set3D={props.set3D} 
                is3D={props.is3D} 
                setListActive={props.setListActive} 
                listActive={props.listActive} 
                setShowLabels={props.setShowLabels} 
                showLabels={props.showLabels}/>
            {showFooter && <div className="footerCont animate__animated animate__fadeInUpBig">
                <FooterButton toggleProjects={props.toggleProjects} categoryArray={props.categoryArray} category={"allProjects"} name={"All"} />
                <FooterButton toggleProjects={props.toggleProjects} categoryArray={props.categoryArray} category={"virtualProjects"} name={"Virtual Architecture"} />
                <FooterButton toggleProjects={props.toggleProjects} categoryArray={props.categoryArray} category={"textileProjects"} name={"Textile Architecture"} />
                <FooterButton toggleProjects={props.toggleProjects} categoryArray={props.categoryArray} category={"otherProjects"} name={"Other"} />
                <FooterButton toggleProjects={props.toggleProjects} categoryArray={props.categoryArray} category={"researchProjects"} name={"Research"} />
            </div>}
            
            {/* <p className="footerLink" onClick={() => props.toggleProjects("allProjects")}>All</p>
            <p className="footerLink" onClick={() => props.toggleProjects("virtualProjects")}>Virtual Architecture</p>
            <p className="footerLink" onClick={() => props.toggleProjects("textileProjects")}>Textile Architecture</p>
            <p className="footerLink" onClick={() => props.toggleProjects("otherProjects")}>Other</p>
            <p className="footerLink" onClick={() => props.toggleProjects("researchProjects")}>Research</p> */}
        </div>
    );
}

export default Footer;