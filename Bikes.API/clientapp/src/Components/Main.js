import React, { useState, useEffect } from "react";
import { Button, Container, Menu } from "semantic-ui-react";
import { NavLink, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import logo from './logo.jpg';
import '../Styles/Header.css';


export default function Main() {
    const [bikes, setBikes] = useState([]); 
    const [showTerms, setShowTerms] = useState(false); 
   
    useEffect(() => {
        fetchBikes();
    }, []);

    const fetchBikes = async () => {
        try {
            const response = await axios.get("https://localhost:7032/api/bikes"); 
            setBikes(response.data);
        } catch (error) {
            console.error("Błąd podczas pobierania rowerów:", error);
        }
    };



    const scrollToNewModels = () => {
        const element = document.getElementById("new-models");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };


    return (
        <Menu inverted fixed="top">
            <Container className="main-container">
                <Menu.Item as={NavLink} to="/" header>
                    <div className="logo-container">
                        <img src={logo} alt="logo" className="header-logo" />
                        <div className="square-overlay">
                            <div className="buttons-container">
                                <Menu.Item as={NavLink} to="/bikes">
                                    <Button content="Wszystkie Rowery" size="large" className="custom-button" />
                                </Menu.Item>
                                <Menu.Item as={NavLink} to="/add-car">
                                    <Button content="Rezerwacje" size="large" className="custom-button2" />
                                </Menu.Item>
                                <Menu.Item as={NavLink} to="/contact">
                                    <Button content="Kontakt" size="large" className="custom-button3" />
                                </Menu.Item>
                                <Menu.Item as={NavLink} to="/login">
                                    <Button content="Logowanie" size="large" className="custom-button5" />
                                </Menu.Item>
                                <Menu.Item as={NavLink} to="/add-car">
                                    <Button content="Cennik" size="large" className="custom-button6" />
                                </Menu.Item>
                                <Menu.Item as={NavLink} to="/regulamin">
                                    <Button content="Regulamin" size="large" className="custom-button7" />
                                </Menu.Item>
                            </div>
                        </div>
                        <div className="square-overlay2"></div>
                        <h2>Rozpocznij Piękną przygodę z naszymi rowerami</h2>
                        <h3>Przejrzyj dostępne modele i zarezerwuj już teraz!</h3>
                        <Button
                            content="Zobacz nowe modele"
                            className="custom-scroll-button"
                            onClick={scrollToNewModels}
                        />
                        <div id="new-models" className="custom-button9">
                            <h12>Dostępne modele</h12>
                        </div>
                            <div className="bike-list-container2">

                                <div className="bike-list__header2">
                                    
                                </div>
                                {bikes.length > 0 ? (
                                    <div className="bike-grid2">
                                        {bikes.map((bike) => (
                                            <div key={bike.bikeId} className="bike-card2">
                                                <span className="bike-item2">{bike.name}</span>
                                                <div>
                                                    <Link to={`/details/${bike.bikeId}`} className="btn btn-secondary bike-item-button2">
                                                        <FontAwesomeIcon icon={faEye} /> Szczegóły
                                                    </Link>


                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>Brak rowerów do wyświetlenia.</p>
                                )}
                            
                        </div>
                    </div>
                </Menu.Item>
            </Container>
        </Menu>
    );
}
