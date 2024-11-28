import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
                console.error('Błąd podczas pobierania samochodów:', error);
                setIsLoading(false);
            });
    };

    const deleteBike = (id) => {
        if (window.confirm('Czy na pewno chcesz usunąć ten samochód?')) {
            axios
                .delete(`/api/bikes/${id}`)
                .then(() => {
                    setBikes(bikes.filter((bike) => bike.id !== id));
                })
                .catch((error) => {
                    console.error('Błąd podczas usuwania samochodu:', error);
                });
        }
    };

    if (isLoading) {
        return <p>Ładowanie danych...</p>;
    }

    return (
        <div className="bike-list">
            <div className="bike-list__header">
                <h2>Lista Samochodów</h2>
                <Link to="/create" className="btn btn-primary">
                    <FontAwesomeIcon icon={faPlus} /> Dodaj nowy samochód
                </Link>
            </div>
            {bikes.length > 0 ? (
                <ul>
                    {bikes.map((bike) => (
                        <li key={bike.id}>
                            <span>
                                {bike.brand} {bike.model}
                            </span>
                            <div>
                                <Link to={`/details/${bike.id}`} className="btn btn-secondary">
                                    <FontAwesomeIcon icon={faEye} /> Szczegóły
                                </Link>
                                <Link to={`/edit/${bike.id}`} className="btn btn-secondary">
                                    <FontAwesomeIcon icon={faEdit} /> Edytuj
                                </Link>
                                <button onClick={() => deleteBike(bike.id)} className="btn btn-danger">
                                    <FontAwesomeIcon icon={faTrash} /> Usuń
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Brak samochodów do wyświetlenia.</p>
            )}
        </div>
    );
}

export default BikesList;
