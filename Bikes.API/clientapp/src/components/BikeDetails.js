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
                console.error('Błąd podczas pobierania szczegółów roweru:', error);
            });
    }, [id]);

    if (!bike) {
        return <p>Ładowanie danych...</p>;
    }

    return (
        <div className="bike-details">
            <h2>{bike.name}</h2>
            <p>Rozmiar: {bike.size}</p>
            <p>Typ roweru: {bike.bikeType}</p>
            <p>Czy elektryczny: {bike.isElectric ? 'Tak' : 'Nie'}</p>
            <p>Stawka godzinowa: {bike.hourlyRate} zł</p>
            <p>Stawka dzienna: {bike.dailyRate} zł</p>
            <p>Dostępność: {bike.availabilityStatus ? 'Dostępny' : 'Niedostępny'}</p>
            <Link to="/" className="btn btn-secondary">
                <FontAwesomeIcon icon={faArrowLeft} /> Powrót do listy rowerów
            </Link>
        </div>
    );
}

export default BikeDetails;
