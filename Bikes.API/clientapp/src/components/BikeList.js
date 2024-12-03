import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { Link } from 'react-router-dom';
import './BikeList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function BikesList() {
    const [bikes, setBikes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchBikes();
    }, []);

    const fetchBikes = () => {
        axios
            .get('/api/bikes')
            .then((response) => {
                setBikes(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Błąd podczas pobierania rowerów:', error);
                setIsLoading(false);
            });
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
        <div className="bike-list">
            <div className="bike-list__header">
                <h2>Lista Rowerów</h2>
                <Link to="/create" className="btn btn-primary">
                    <FontAwesomeIcon icon={faPlus} /> Dodaj nowy rower
                </Link>
            </div>
            {bikes.length > 0 ? (
                <ul>
                    {bikes.map((bike) => (
                        <li key={bike.bikeId}>
                            <span>{bike.name}</span>
                            <div>
                                <Link to={`/details/${bike.bikeId}`} className="btn btn-secondary">
                                    <FontAwesomeIcon icon={faEye} /> Szczegóły
                                </Link>
                                <Link to={`/edit/${bike.bikeId}`} className="btn btn-secondary">
                                    <FontAwesomeIcon icon={faEdit} /> Edytuj
                                </Link>
                                <button onClick={() => deleteBike(bike.bikeId)} className="btn btn-danger">
                                    <FontAwesomeIcon icon={faTrash} /> Usuń
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Brak rowerów do wyświetlenia.</p>
            )}
        </div>
    );
}

export default BikesList;
