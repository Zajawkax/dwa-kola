// AdminPanel.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Reservation {
    reservationId: number;
    bikeId: number;
    userId: number;
    startDate: string;
    endDate: string;
    status: number;
    totalCost: number;
    user?: {
        id: number;
        userName: string;
        email: string;
    };
    bike?: {
        bikeId: number;
        name: string;
    };
}

const AdminPanel: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [error, setError] = useState<string | null>(null);

    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchAllReservations = async () => {
            try {
                if (!token) {
                    setError('Brak tokena – musisz się zalogować');
                    return;
                }

                const res = await axios.get<Reservation[]>(
                    'https://localhost:7032/api/Reservation/all',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setReservations(res.data);
            } catch (err: any) {
                console.error('Błąd pobierania wszystkich rezerwacji:', err);
                setError('Wystąpił błąd przy pobieraniu rezerwacji.');
            }
        };

        fetchAllReservations();
    }, [token]);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Panel Administratora</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {reservations.length === 0 ? (
                <p>Brak rezerwacji w bazie.</p>
            ) : (
                <ul>
                    {reservations.map((res) => (
                        <li key={res.reservationId}>
                            Rez #{res.reservationId}, Użytkownik: {res.user?.userName} (ID: {res.userId}),
                            Rower: {res.bike?.name} (ID: {res.bikeId}), Status: {res.status}
                            <br />
                            Od: {res.startDate} do: {res.endDate}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminPanel;
