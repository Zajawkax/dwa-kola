import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { Link } from 'react-router-dom';
import '../Styles/BikeList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEye, faEdit, faTrash, faBicycle } from '@fortawesome/free-solid-svg-icons';
import { Menu, Button } from 'semantic-ui-react';
import { NavLink } from "react-router-dom";
import '../Styles/CreateBike.css';
function BikesList() {
    const [bikes, setBikes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchBikes();
    }, []);

    const fetchBikes = async () => {
        try {
            const response = await axios.get('https://localhost:7032/api/bikes');
            setBikes(response.data);
        } catch (error) {
            console.error('Błąd podczas pobierania samochodów:', error);

        } finally {
            setIsLoading(false);
        }
    };

    const deleteBike = (id) => {
        if (window.confirm('Czy na pewno chcesz usunąć ten rower?')) {
            axios
                .delete(`/api/bikes/${id}`)
                .then(() => {
                    setBikes(bikes.filter((bike) => bike.bikeId !== id));
                })
                .catch((error) => {
                    console.error('Błąd podczas usuwania roweru:', error);
                });
        }
    };

    if (isLoading) {
        return <p>Ładowanie danych...</p>;
    }

    return (
        <div className="bike-list-container">

            <div className="bike-list__header">

                <Menu.Item as={NavLink} to="/bikes/create-bike">
                    <Button content="Dodaj Rower" size="large" className="custom-button17" />

                </Menu.Item>
                <Menu.Item as={NavLink} to="/bikes/filtersort">
                    <Button content="Filtrowanie/Sortowanie" size="large" className="custom-button18" />

                </Menu.Item>


            </div>
            {bikes.length > 0 ? (
                <div className="bike-grid">
                    {bikes.map((bike) => (
                        <div key={bike.bikeId} className="bike-card">
                            <span className="bike-item">{bike.name}</span>
                            <div>
                                <Link to={`/details/${bike.bikeId}`} className="bike-item-button">
                                    <FontAwesomeIcon icon={faEye} /> Szczegóły
                                </Link>
                                <Link to={`/edit/${bike.bikeId}`} className="edit-button">
                                    <FontAwesomeIcon icon={faEdit} /> Edytuj
                                </Link>
                                <button onClick={() => deleteBike(bike.bikeId)} className="btn btn-danger bike-item-button">
                                    <FontAwesomeIcon icon={faTrash} /> Usuń
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Brak rowerów do wyświetlenia.</p>
            )}
        </div>
    );
}

export default BikesList;


