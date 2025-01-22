import React from 'react';
import { Button, Container, Menu } from 'semantic-ui-react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import logo from './logo.jpg';
import './Styles/Header.css';

const NavBar: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('displayName');

    const handleLogout = () => {
        // Wyczyszczenie localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('displayName');
        localStorage.removeItem('role');

        // Przekierowanie do /login
        navigate('/login');
    };

    const scrollToNewModels = () => {
        const element = document.getElementById('new-models');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (

        <Menu inverted fixed="top">
            <Container className="header-container">
                <div className="logo-container">
                    <img src={logo} alt="logo" className="header-logo" />

                    <div className="square-overlay">
                        <div className="buttons-container">
                            <Menu.Item as={NavLink} to="/bikes">
                                <Button
                                    content="Wszystkie Rowery"
                                    size="large"
                                    className="custom-button2"
                                />
                            </Menu.Item>
                            <Menu.Item as={NavLink} to="/user/reservations">
                                <Button
                                    content="Rezerwacje"
                                    size="large"
                                    className="custom-button2"
                                />
                            </Menu.Item>
                            <Menu.Item as={NavLink} to="/contact">
                                <Button
                                    content="Kontakt"
                                    size="large"
                                    className="custom-button2"
                                />
                            </Menu.Item>
                            {token ? (
                                <>
                                   
                                    <Menu.Item as={NavLink} to="/profile">
                                        <Button
                                            content="Profil"
                                            size="large"
                                            className="custom-button2"
                                        />
                                    </Menu.Item>
                                    <span className="napis1">
                                        Zalogowany jako: <b>{username}</b>
                                    </span >
                                </>

                            ) : (
                                <Menu.Item as={NavLink} to="/login">
                                    <Button
                                        content="Logowanie"
                                        size="large"
                                        className="custom-button2"
                                    />
                                </Menu.Item>
                            )}

                        
                            <Menu.Item as={NavLink} to="/pricing">
                                <Button
                                    content="Cennik"
                                    size="large"
                                    className="custom-button2"
                                />
                            </Menu.Item>
                            <Menu.Item as={NavLink} to="/regulamin">
                                <Button
                                    content="Regulamin"
                                    size="large"
                                    className="custom-button2"
                                />
                            </Menu.Item>

                        </div>

                        
                        
                           

                    </div>
                </div>
            </Container>
        </Menu>
    );
};

export default NavBar;
