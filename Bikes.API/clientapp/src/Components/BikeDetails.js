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
    const [formError, setFormError] = useState(null); // Błąd związany z formularzem
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');
    const [reservationError, setReservationError] = useState(null); // Błąd rezerwacji

    const { id } = useParams();
    const navigate = useNavigate();

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
    }, [id]);

    const handleReserve = async (event) => {
        event.preventDefault();

        if (!startDateTime || !endDateTime) {
            setFormError('Wybierz datę i godzinę rozpoczęcia oraz zakończenia rezerwacji!');
            return;
        }

        const start = new Date(startDateTime);
        const end = new Date(endDateTime);

        if (end <= start) {
            setFormError('Data zakończenia musi być późniejsza niż data rozpoczęcia!');
            return;
        }

        setFormError(null); // Reset błędu formularza

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('Musisz być zalogowany, by zarezerwować rower!');
                navigate('/login');
                return;
            }

            const adjustToTimezone = (dateTime) => {
                const localDate = new Date(dateTime);
                return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();
            };

            const adjustedStartDate = adjustToTimezone(startDateTime);
            const adjustedEndDate = adjustToTimezone(endDateTime);

            // Sprawdzanie dostępności roweru tylko na zadany okres
            try {
                const checkResponse = await axios.post(
                    `https://localhost:7032/api/Reservation/check-availability/${bike.bikeId}`,
                    {
                        startDate: startDateTime,
                        endDate: endDateTime
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (!checkResponse.data.available) {
                    setReservationError('Rower jest już zarezerwowany na ten okres.');
                    return;
                }
                setReservationError(null); // Reset błędu rezerwacji
            } catch (err) {
                console.error('Błąd sprawdzania dostępności:', err.response ? err.response.data : err);
                setError('Nie udało się sprawdzić dostępności roweru.');
                return;
            }

            // Jeśli rower jest dostępny, kontynuuj rezerwację
            const response = await axios.post(
                `https://localhost:7032/api/Reservation/rent/${bike.bikeId}`,
                {
                    startDate: adjustedStartDate,
                    endDate: adjustedEndDate,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('Rezerwacja udana:', response.data);
            navigate('/user/reservations');
        } catch (err) {
            console.error('Błąd rezerwacji:', err);
            setError('Nie udało się zarezerwować roweru. Spróbuj ponownie.');
        }
    };

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

            <Link to="/bikes" className="btn btn-secondary">
                <FontAwesomeIcon icon={faArrowLeft} /> Powrót do listy rowerów
            </Link>

            {reservationError && <p style={{ color: 'red' }}>{reservationError}</p>} {/* Wyświetlanie komunikatu o dostępności */}

            {bike.availabilityStatus && (
                <div>
                    {formError && <p style={{ color: 'red' }}>{formError}</p>} {/* Wyświetlanie błędu formularza */}
                    <div className="date-inputs">
                        <label>
                            Data i godzina rozpoczęcia:
                            <input
                                type="datetime-local"
                                value={startDateTime}
                                onChange={(e) => setStartDateTime(e.target.value)}
                            />
                        </label>
                        <label>
                            Data i godzina zakończenia:
                            <input
                                type="datetime-local"
                                value={endDateTime}
                                onChange={(e) => setEndDateTime(e.target.value)}
                            />
                        </label>
                    </div>
                    <button onClick={handleReserve} className="btn btn-secondary">
                        Zarezerwuj <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
            )}

            {!bike.availabilityStatus && <p>Ten rower jest aktualnie niedostępny</p>}
        </div>
    );
}

export default BikeDetails;
