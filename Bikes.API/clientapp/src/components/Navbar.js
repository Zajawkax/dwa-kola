import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faBicycle } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
    const [menuActive, setMenuActive] = useState(false);

    const toggleMenu = () => {
        setMenuActive(!menuActive);
    };

    return (
        <nav className="navbar">
            <h1 className="navbar__brand">
                <FontAwesomeIcon icon={faBicycle} /> BikeApp
            </h1>
            <div className="navbar__toggle" onClick={toggleMenu}>
                <FontAwesomeIcon icon={menuActive ? faTimes : faBars} color="#fff" size="lg" />
            </div>
            <ul className={`navbar__links ${menuActive ? 'active' : ''}`}>
                <li>
                    <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setMenuActive(false)}>
                        Strona główna
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/create"
                        className={({ isActive }) => (isActive ? 'active' : '')}
                        onClick={() => setMenuActive(false)}
                    >
                        Dodaj rower
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
