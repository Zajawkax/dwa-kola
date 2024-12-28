import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../Styles/BikeDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function BikeDetails() {
    const [bike, setBike] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { id } = useParams();      // id roweru z adresu /details/:id
    const navigate = useNavigate();  // do przekierowań

    // 1. Pobieranie danych roweru
    const fetchBike = async () => {
        try {
            const response = await axios.get(`https://localhost:7032/api/bikes/${id}`);
            setBike(response.data);
        } catch (err) {
            console.error('Błąd podczas pobierania szczegółów roweru:', err);
            setError('Nie udało się pobrać danych roweru');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBike();
    }, [id]); // wywołaj fetchBike przy zmianie id

    // 2. Obsługa przycisku "Zarezerwuj"
    const handleReserve = async (event) => {
        // Zapobiegamy przeładowaniu strony, jeżeli to <Link to="#"> lub <a>
        event.preventDefault();

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('Musisz być zalogowany, by zarezerwować rower!');
                // ewentualnie przekieruj do logowania:
                navigate('/login');
                return;
            }
            if (!bike || !bike.bikeId) {
                setError('Nieprawidłowy ID roweru');
                return;
            }

            // Przykładowo ustaw datę startu "teraz" i koniec "jutro"
            const now = new Date().toISOString();
            const tomorrowDate = new Date();
            tomorrowDate.setDate(tomorrowDate.getDate() + 1);
            const tomorrow = tomorrowDate.toISOString();

            // Wysyłamy żądanie rezerwacji
            const response = await axios.post(
                `https://localhost:7032/api/Reservation/rent/${bike.bikeId}`,
                {
                    startDate: now,
                    endDate: tomorrow
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log('Rezerwacja udana:', response.data);

            // Po udanej rezerwacji przekieruj np. do listy rezerwacji użytkownika
            navigate('/user/reservations');
        } catch (err) {
            console.error('Błąd rezerwacji:', err);
            setError('Nie udało się zarezerwować roweru. Spróbuj ponownie.');
        }
    };

    // 3. Renderowanie w zależności od stanu
    if (isLoading) {
        return <p>Ładowanie danych...</p>;
    }
    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }
    if (!bike) {
        return <p>Nie znaleziono roweru</p>;
    }

    return (
        <div className="bike-details">
            <h1>{bike.name}</h1>
            <h3>Szczegółowe Informacje</h3>
            <p>Rozmiar: {bike.size}</p>
            <p>Typ roweru: {bike.bikeType}</p>
            <p>Czy elektryczny: {bike.isElectric ? 'Tak' : 'Nie'}</p>
            <p>Stawka godzinowa: {bike.hourlyRate} zł</p>
            <p>Stawka dzienna: {bike.dailyRate} zł</p>
            <p>Dostępność: {bike.availabilityStatus ? 'Dostępny' : 'Niedostępny'}</p>

            {/* Link powrotu do listy */}
            <Link to="/" className="btn btn-secondary">
                <FontAwesomeIcon icon={faArrowLeft} /> Powrót do listy rowerów
            </Link>

            {/* Jeśli rower jest dostępny – przycisk "Zarezerwuj" */}
            {bike.availabilityStatus ? (
                <Link to="#" onClick={handleReserve} className="btn btn-secondary2">
                    Zarezerwuj <FontAwesomeIcon icon={faArrowRight} />
                </Link>
            ) : (
                <p>Ten rower jest aktualnie niedostępny</p>
            )}
        </div>
    );
}

export default BikeDetails;
