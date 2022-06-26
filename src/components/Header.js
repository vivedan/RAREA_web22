import { Link } from 'gatsby';
import React from 'react';

import '../styles/style.css';

import 'animate.css';

function Header() {
    return (
        <div>
            <div className="headerCont animate__animated animate__fadeInDownBig">
                <Link className="headerLink" to="/about" activeClassName='currentPageLink'>About</Link>
                <img className="logo" src="/logoweb2White.png" alt="Rarea logo"/>
                <Link className="headerLink" to="/contact" activeClassName='currentPageLink'>Contact</Link>
            </div>
        </div>
    );
}

export default Header;