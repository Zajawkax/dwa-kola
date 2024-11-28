import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './BikeDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function BikeDetails() {
    const [bike, setBike] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        axios
            .get(`/api/bikes/${id}`)
            .then((response) => {
                setBike(response.data);
            })
            .catch((error) => {
                console.error('Błąd podczas pobierania szczegółów samochodu:', error);
            });
    }, [id]);

    if (!bike) {
        return <p>Ładowanie danych...</p>;
    }

    return (
        <div className="bike-details">
            <h2>
                {bike.brand} {bike.model}
            </h2>
            <p>Liczba drzwi: {bike.doorsNumber}</p>
            <p>Pojemność bagażnika: {bike.luggageCapacity} l</p>
            <p>Pojemność silnika: {bike.engineCapacity} cm³</p>
            <p>Rodzaj paliwa: {bike.fuelType}</p>
            <p>Data produkcji: {new Date(bike.productionDate).toLocaleDateString()}</p>
            <p>Spalanie: {bike.bikeFuelConsumption} l/100km</p>
            <p>Typ nadwozia: {bike.bodyType}</p>
            <Link to="/" className="btn btn-secondary">
                <FontAwesomeIcon icon={faArrowLeft} /> Powrót do listy samochodów
            </Link>
        </div>
    );
}

export default BikeDetails;
