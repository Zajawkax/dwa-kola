import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useParams, Link } from 'react-router-dom';
import '../Styles/BikeDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft} from '@fortawesome/free-solid-svg-icons';

function BikeDetails() {
    const [bike, setBike] = useState(null);
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
   

    const fetchBike = async () => {
        try {
            const response = await axios.get(`https://localhost:7032/api/bikes/${id}`);
            setBike(response.data);
        } catch (error) {
            console.error('Błąd podczas pobierania szczegółów roweru:', error);
        } finally {
            setIsLoading(false);

        }
    };

    
    useEffect(() => {
        fetchBike();
    }, [id]); 


  
   
    if (!bike) {
        return <p>Ładowanie danych...</p>;
    }

    return (
        <div className="bike-details">
            <h15>{bike.name}</h15>
            <h13>Szczegolowe Informacje</h13>
            <p>Rozmiar: {bike.size}</p>
            <p>Typ roweru: {bike.bikeType}</p>
            <p>Czy elektryczny: {bike.isElectric ? 'Tak' : 'Nie'}</p>
            <p>Stawka godzinowa: {bike.hourlyRate} zł</p>
            <p>Stawka dzienna: {bike.dailyRate} zł</p>
            <p>Dostępność: {bike.availabilityStatus ? 'Dostępny' : 'Niedostępny'}</p>
            <Link to="/" className="btn btn-secondary">
                <FontAwesomeIcon icon={faArrowLeft} /> Powrót do listy rowerów
            </Link>
            <Link to="/" className="btn btn-secondary2">
               Zarezerwuj  <FontAwesomeIcon icon={faArrowRight} />
            </Link>
        </div>
    );
}

export default BikeDetails;
