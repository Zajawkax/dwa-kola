import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './CarDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function CarDetails() {
    const [car, setCar] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        axios
            .get(`/api/cars/${id}`)
            .then((response) => {
                setCar(response.data);
            })
            .catch((error) => {
                console.error('Błąd podczas pobierania szczegółów samochodu:', error);
            });
    }, [id]);

    if (!car) {
        return <p>Ładowanie danych...</p>;
    }

    return (
        <div className="car-details">
            <h2>
                {car.brand} {car.model}
            </h2>
            <p>Liczba drzwi: {car.doorsNumber}</p>
            <p>Pojemność bagażnika: {car.luggageCapacity} l</p>
            <p>Pojemność silnika: {car.engineCapacity} cm³</p>
            <p>Rodzaj paliwa: {car.fuelType}</p>
            <p>Data produkcji: {new Date(car.productionDate).toLocaleDateString()}</p>
            <p>Spalanie: {car.carFuelConsumption} l/100km</p>
            <p>Typ nadwozia: {car.bodyType}</p>
            <Link to="/" className="btn btn-secondary">
                <FontAwesomeIcon icon={faArrowLeft} /> Powrót do listy samochodów
            </Link>
        </div>
    );
}

export default CarDetails;
