import { Button, Container, Menu } from "semantic-ui-react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from './logo.jpg';
import './Styles/Header.css';








export default function NavBar() {
    const scrollToNewModels = () => {
        const element = document.getElementById('new-models');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        };
    };

        return (
            <Menu inverted fixed="top">
                <Container className="header-container">
                    <Menu.Item as={NavLink} to='/' header>
                        <div className="logo-container">
                            <img src={logo} alt="logo" className="header-logo" />
                            {/*<img src="/carr.png" alt="bikes" className="header-logo2" />*/}
                            <div className="square-overlay" >

                                <div className="buttons-container">
                                    <Menu.Item as={NavLink} to='/bikes'>
                                        <Button
                                            content="Wszystkie Rowery"
                                            size="large"
                                            className="custom-button"

                                        />
                                    </Menu.Item>
                                    {<Menu.Item as={NavLink} to='/add-car'>
                                        <Button
                                            content="Rezerwacje"
                                            size="large"
                                            className="custom-button2"

                                        />
                                    </Menu.Item>}
                                    {<Menu.Item as={NavLink} to='/contact'>
                                        <Button
                                            content="Kontakt"
                                            size="large"
                                            className="custom-button3"

                                        />
                                    </Menu.Item>}
                                    {<Menu.Item as={NavLink} to='/login'>
                                        <Button
                                            content="Logowanie"
                                            size="large"
                                            className="custom-button5"

                                        />
                                    </Menu.Item>}
                                    {<Menu.Item as={NavLink} to='/add-car'>
                                        <Button
                                            content="Cennik"
                                            size="large"
                                            className="custom-button6"

                                        />
                                    </Menu.Item>}
                                    {<Menu.Item as={NavLink} to='/add-car'>
                                        <Button
                                            content="Regulamin"
                                            size="large"
                                            className="custom-button7"

                                        />
                                    </Menu.Item>}
                                    
                                </div>
                            </div>
                            
                            
                
                        </div>
                    </Menu.Item>
                </Container>
            </Menu>
        );
}


