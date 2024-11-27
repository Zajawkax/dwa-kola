import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './CarList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function CarsList() {
    const [cars, setCars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = () => {
        axios
            .get('/api/cars')
            .then((response) => {
                setCars(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Błąd podczas pobierania samochodów:', error);
                setIsLoading(false);
            });
    };

    const deleteCar = (id) => {
        if (window.confirm('Czy na pewno chcesz usunąć ten samochód?')) {
            axios
                .delete(`/api/cars/${id}`)
                .then(() => {
                    setCars(cars.filter((car) => car.id !== id));
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
        <div className="car-list">
            <div className="car-list__header">
                <h2>Lista Samochodów</h2>
                <Link to="/create" className="btn btn-primary">
                    <FontAwesomeIcon icon={faPlus} /> Dodaj nowy samochód
                </Link>
            </div>
            {cars.length > 0 ? (
                <ul>
                    {cars.map((car) => (
                        <li key={car.id}>
                            <span>
                                {car.brand} {car.model}
                            </span>
                            <div>
                                <Link to={`/details/${car.id}`} className="btn btn-secondary">
                                    <FontAwesomeIcon icon={faEye} /> Szczegóły
                                </Link>
                                <Link to={`/edit/${car.id}`} className="btn btn-secondary">
                                    <FontAwesomeIcon icon={faEdit} /> Edytuj
                                </Link>
                                <button onClick={() => deleteCar(car.id)} className="btn btn-danger">
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

export default CarsList;
