import React, { useEffect, useState } from 'react';
import axios, { all } from 'axios';
import '../Styles/MyReservations.css';
import { jsPDF } from 'jspdf';  // npm install jspdf
import autoTable from 'jspdf-autotable';  // npm install jspdf-autotable

interface Reservation {
    reservationId: number;
    bikeId: number;
    userId: number;
    startDate: string;
    endDate: string;
    status: ReservationStatus; // np. 0=Pending, 1=Confirmed, 2=Cancelled, 3=Completed
    totalCost: number;
    bike?: {
        bikeId: number;
        name: string;
    };
}

enum ReservationStatus {
    Pending = "Pending",
    Confirmed = "Confirmed",
    Cancelled = "Cancelled",
    Completed = "Completed",
}

enum TabType {
    All = 'Wszystkie',
    Pending = 'Oczekujące',
    Confirmed = 'Potwierdzone',
    Cancelled = 'Anulowane',
    Completed = 'Zakończone',
}

interface UserProfileData {
    username: string;
    email: string;
    phoneNumber: string;
}

const MyReservations: React.FC = () => {

    const [userReservations, setUserReservations] = useState<Reservation[]>([]);
    const [allReservations, setAllReservations] = useState<Reservation[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('authToken');
    const [profile, setProfile] = useState<UserProfileData | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>(TabType.All);

    const filterReservations = (reservations: Reservation[], tab: TabType) => {
        switch (tab) {
            case TabType.Pending:
                return reservations.filter(res => res.status === 'Pending');
            case TabType.Confirmed:
                return reservations.filter(res => res.status === 'Confirmed');
            case TabType.Cancelled:
                return reservations.filter(res => res.status === 'Cancelled');
            case TabType.Completed:
                return reservations.filter(res => res.status === 'Completed');
            default:
                return reservations;
        }
    };

    const reservations = role === 'Admin' ? filterReservations(allReservations, activeTab) : userReservations;

    const fetchUserReservations = async () => {
        try {
            setLoading(true);
            if (!token) {
                setError('Musisz być zalogowany, aby zobaczyć swoje rezerwacje.');
                return;
            }
            const response = await axios.get<Reservation[]>(
                'https://localhost:7032/api/Reservation/my',
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setUserReservations(response.data);
            console.log(userReservations);
        } catch (err) {
            console.error('Błąd pobierania rezerwacji użytkownika:', err);
            setError('Nie udało się pobrać listy rezerwacji użytkownika.');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllReservations = async () => {
        try {
            setLoading(true);
            if (!token) {
                setError('Musisz być zalogowany, aby zobaczyć wszystkie rezerwacje.');
                return;
            }
            const response = await axios.get<Reservation[]>(
                'https://localhost:7032/api/Reservation/all',
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setAllReservations(response.data);
        } catch (err) {
            console.error('Błąd pobierania wszystkich rezerwacji:', err);
            setError('Nie udało się pobrać listy wszystkich rezerwacji.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (role === 'Admin') {
            fetchAllReservations();
        } else {
            fetchUserReservations();
        }
    }, [role]);

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

            if (role === 'Admin') {
                const updatedList = allReservations.filter((res) => res.reservationId !== reservationId);
                setAllReservations(updatedList);
            } else {
                const updatedList = userReservations.map((res) => {
                    if (res.reservationId === reservationId) {
                        return {
                            ...res,
                            status: ReservationStatus.Completed, // Mark as Completed
                            endDate: new Date().toISOString(),
                        };
                    }
                    return res;
                });
                setUserReservations(updatedList);
            }

            setError(null);
        } catch (err: any) {
            console.error('Błąd zwracania roweru:', err);
            setError('Nie udało się zwrócić roweru.');

            try {
                const refreshed = await axios.get<Reservation[]>(
                    role === 'Admin' ? 'https://localhost:7032/api/Reservation/all' : 'https://localhost:7032/api/Reservation/my',
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                console.log('Dane API:', refreshed.data);
                if (role === 'Admin') {
                    setAllReservations(refreshed.data);
                } else {
                    setUserReservations(refreshed.data);
                }
            } catch (refreshErr: any) {
                console.error('Błąd odświeżania listy rezerwacji:', refreshErr);
                setError('Nie udało się odświeżyć listy rezerwacji.');
            }
        }
    };

    const handleConfirmReservation = async (reservationId: number) => {
        try {
            if (!token) {
                setError('Musisz być zalogowany!');
                return;
            }

            await axios.post(
                `https://localhost:7032/api/Reservation/confirm/${reservationId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const updatedList = allReservations.map((res) => {
                if (res.reservationId === reservationId) {
                    return { ...res, status: ReservationStatus.Confirmed };
                }
                return res;
            });
            setAllReservations(updatedList);
            setError(null);
        } catch (err) {
            console.error('Błąd potwierdzania rezerwacji:', err);
            setError('Nie udało się potwierdzić rezerwacji.');
        }
    };

    const handleCancelReservation = async (reservationId: number) => {
        try {
            if (!token) {
                setError('Musisz być zalogowany!');
                return;
            }

            await axios.post(
                `https://localhost:7032/api/Reservation/cancel/${reservationId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const updatedList = allReservations.map((res) => {
                if (res.reservationId === reservationId) {
                    return { ...res, status: ReservationStatus.Cancelled };
                }
                return res;
            });
            setAllReservations(updatedList);
            setError(null);
        } catch (err) {
            console.error('Błąd anulowania rezerwacji:', err);
            setError('Nie udało się anulować rezerwacji.');
        }
    };

    const generatePdfReport = (reservations: Reservation[]) => {
        const doc = new jsPDF();

        // Dodaj tytuł
        doc.setFontSize(16);
        doc.text('Raport Rezerwacji', 14, 20);

        // Przygotuj dane do tabeli
        const tableData = reservations.map(res => [
            res.reservationId,
            res.bike?.name || `ID: ${res.bikeId}`,
            res.userId,
            new Date(res.startDate).toLocaleString(),
            new Date(res.endDate).toLocaleString(),
            res.status,
            `${res.totalCost} zł`
        ]);

        // Dodaj tabelę
        autoTable(doc, {
            head: [['ID', 'Rower', 'Użytkownik', 'Data Startu', 'Data Zakończenia', 'Status', 'Koszt']],
            body: tableData,
            startY: 30
        });

        // Pobierz plik
        doc.save(`Raport_Rezerwacje_${new Date().toISOString()}.pdf`);
    };

    // Obsługa stanów
    if (loading) {
        return <p>Ładowanie rezerwacji...</p>;
    }

    if (error) {
        return (
            <div className="centered-message-container">
                <p className="centered-message" style={{ color: 'black' }}>
                    {error}
                </p>
                {error.includes('Musisz być zalogowany') && (
                    <p className="centered-message-link">
                        <a href="/login">Zaloguj się tutaj</a>
                    </p>
                )}
            </div>
        );
    }

    if (allReservations.length === 0 && role === 'Admin') {
        return (
            <div>
                <h2 className="reservations-header">Rezerwacje</h2>
                <div className="reservations-container">
                    <p>Brak rezerwacji.</p>
                </div>
            </div>
        );
    }

    if (userReservations.length === 0 && role === 'User') {
        return (
            <div>
                <h2 className="reservations-header">Moje Rezerwacje</h2>
                <div className="reservations-container">
                    <p>Brak rezerwacji.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {role === 'Admin' && (
                <div>

                    <div className="reservations-container">
                        <div className="tabs-container">
                            <h1 className="reservations-header">Wszystkie Rezerwacje</h1>
                            {Object.values(TabType).map(tab => (
                                <button
                                    key={tab}
                                    className={activeTab === tab ? 'active' : ''}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                            <button onClick={() => generatePdfReport(allReservations)}>Generuj raport</button>
                        </div>

                        <ul>
                            {reservations.map((res) => (

                                <li key={res.reservationId} className="reservation-item">
                                    <strong>Rezerwacja #{res.reservationId}</strong>
                                    <br />
                                    <span>Rower: {res.bike?.name ?? `ID: ${res.bikeId}`}</span>
                                    <br />
                                    <span>Użytkownik: {res.userId}</span>
                                    <br />
                                    <span>
                                        Od: {new Date(res.startDate).toLocaleString()} do: {new Date(res.endDate).toLocaleString()}
                                    </span>
                                    <br />
                                    <span>Status: {res.status} | Koszt: {res.totalCost} zł</span>
                                    <br />
                                    <div className="button-container4">
                                        <button
                                            onClick={() => handleConfirmReservation(res.reservationId)}
                                            className="return-button"
                                        >
                                            Potwierdź rezerwację
                                        </button>
                                        <button
                                            onClick={() => handleCancelReservation(res.reservationId)}
                                            className="return-button2"
                                        >
                                            Anuluj rezerwację
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {role === 'User' && (
                <>
                    <h2 className="reservations-header">Moje Rezerwacje</h2>
                    <div className="reservations-container">
                        <ul>
                            {userReservations.map((res) => {
                                const isCompleted = res.status === 'Completed';
                                return (
                                    <li key={res.reservationId} className="reservation-item">
                                        <strong>Rezerwacja #{res.reservationId}</strong>
                                        <br />
                                        <span>Rower: {res.bike?.name ?? `ID: ${res.bikeId}`}</span>
                                        <br />
                                        <span>
                                            Od: {new Date(res.startDate).toLocaleString()} do: {new Date(res.endDate).toLocaleString()}
                                        </span>
                                        <br />
                                        <span>Status: {res.status} | Koszt: {res.totalCost} zł</span>
                                        <br />
                                        {!isCompleted ? (
                                            <button
                                                onClick={() => handleReturnBike(res.reservationId)}
                                                className="return-button"
                                            >
                                                Zwróć rower
                                            </button>
                                        ) : (
                                            <span className="returned-status">Zwrócony</span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default MyReservations;

