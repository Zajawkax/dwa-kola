import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Reservation {
    reservationId: number;
    bikeId: number;
    userId: number;
    startDate: string;
    endDate: string;
    status: number; // np. 0=Pending, 1=Confirmed, 2=Cancelled, 3=Completed
    totalCost: number;
    bike?: {
        bikeId: number;
        name: string;
    };
}

const MyReservations: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const token = localStorage.getItem('authToken');

    // Funkcja do pobierania rezerwacji
    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true);
            try {
                if (!token) {
                    setError('Musisz być zalogowany!');
                    return;
                }

                const response = await axios.get<Reservation[]>(
                    'https://localhost:7032/api/Reservation/my',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setReservations(response.data);
            } catch (err: any) {
                console.error('Błąd pobierania rezerwacji:', err);
                setError('Wystąpił błąd przy pobieraniu rezerwacji.');
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [token]);

    // Funkcja do zwracania roweru
    const handleReturnBike = async (reservationId: number) => {
        try {
            if (!token) {
                setError('Musisz być zalogowany!');
                return;
            }

            await axios.post(
                `https://localhost:7032/api/Reservation/return/${reservationId}`,
                { deleteReservation: true },    // <-- body JSON
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            // Aktualizacja stanu rezerwacji lokalnie
            const updatedList = reservations.map((res) => {
                if (res.reservationId === reservationId) {
                    return {
                        ...res,
                        status: 3, // 3 = Completed
                        endDate: new Date().toISOString(),
                    };
                }
                return res;
            });
            setReservations(updatedList);
            setError(null);
        } catch (err: any) {
            console.error('Błąd zwracania roweru:', err);
            setError('Nie udało się zwrócić roweru.');

            // Awaryjne pobranie pełnej listy z API
            try {
                const refreshed = await axios.get<Reservation[]>(
                    'https://localhost:7032/api/Reservation/my',
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setReservations(refreshed.data);
            } catch (refreshErr: any) {
                console.error('Błąd odświeżania listy rezerwacji:', refreshErr);
                setError('Nie udało się odświeżyć listy rezerwacji.');
            }
        }
    };

    // Obsługa stanów
    if (loading) {
        return <p>Ładowanie rezerwacji...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (reservations.length === 0) {
        return <p>Brak rezerwacji.</p>;
    }

    // Wyświetlanie rezerwacji
    return (
        <div style={{ padding: '20px' }}>
            <h2>Moje Rezerwacje</h2>
            <ul>
                {reservations.map((res) => {
                    const isCompleted = res.status === 3; // Załóżmy, że 3 = Completed
                    return (
                        <li key={res.reservationId} style={{ marginBottom: '15px' }}>
                            <strong>Rezerwacja #{res.reservationId}</strong>
                            <br />
                            <span>
                                Rower: {res.bike?.name ?? `(ID: ${res.bikeId})`}
                            </span>
                            <br />
                            <span>
                                Od: {new Date(res.startDate).toLocaleString()} do:{' '}
                                {new Date(res.endDate).toLocaleString()}
                            </span>
                            <br />
                            <span>Status: {res.status} | Koszt: {res.totalCost} zł</span>
                            <br />
                            {/* Przycisk zwrotu roweru */}
                            {!isCompleted ? (
                                <button
                                    onClick={() => handleReturnBike(res.reservationId)}
                                    style={{
                                        marginTop: '5px',
                                        padding: '5px 10px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Zwróć rower
                                </button>
                            ) : (
                                <span style={{ color: 'green' }}>Zwrócony</span>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default MyReservations;
