import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/MyReservations.css'; 

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
    const [activeTab, setActiveTab] = useState<TabType>('all');
    type TabType = 'all' | 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
    

    const fetchUserReservations = async () => {
        try {
            setLoading(true);
            if (!token) {
                setError('Musisz byÊ zalogowany, aby zobaczyÊ swoje rezerwacje.');
                return;
            }
            const response = await axios.get<Reservation[]>(
                'https://localhost:7032/api/Reservation/my',
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setUserReservations(response.data);
        } catch (err) {
            console.error('B≥πd pobierania rezerwacji uøytkownika:', err);
            setError('Nie uda≥o siÍ pobraÊ listy rezerwacji uøytkownika.');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllReservations = async () => {
        try {
            setLoading(true);
            if (!token) {
                setError('Musisz byÊ zalogowany, aby zobaczyÊ wszystkie rezerwacje.');
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
            console.error('B≥πd pobierania wszystkich rezerwacji:', err);
            setError('Nie uda≥o siÍ pobraÊ listy wszystkich rezerwacji.');
        } finally {
            setLoading(false);
        }
    };
   
    useEffect(() => {
        if (role === 'Admin') {
            fetchAllReservations();

        }
        else {
            fetchUserReservations();
        }
    }, [role]);

   
    

    
   
    const handleReturnBike = async (reservationId: number) => {
        try {
            if (!token) {
                setError('Musisz byƒá zalogowany!');
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
                            status: 3, // Mark as Completed
                            endDate: new Date().toISOString(),
                        };
                    }
                    return res;
                });
                setUserReservations(updatedList);
            }

            setError(null);
        } catch (err: any) {
            console.error('B≥πd zwracania roweru:', err);
            setError('Nie uda≥o siÍ zwrÛciÊ roweru.');

            
            try {
                const refreshed = await axios.get<Reservation[]>(
                    role === 'Admin' ? 'https://localhost:7032/api/Reservation/all' : 'https://localhost:7032/api/Reservation/my',
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (role === 'Admin') {
                    setAllReservations(refreshed.data);
                } else {
                    setUserReservations(refreshed.data);
                }
            } catch (refreshErr: any) {
                console.error('B≥πd odúwieøania listy rezerwacji:', refreshErr);
                setError('Nie uda≥o siÍ odúwieøyÊ listy rezerwacji.');
            }
        }
    };

    const handleConfirmReservation = async (reservationId: number) => {
        try {
            if (!token) {
                setError('Musisz byÊ zalogowany!');
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
                    return { ...res, status: 1 }; 
                }
                return res;
            });
            setAllReservations(updatedList);
            setError(null);
        } catch (err) {
            console.error('B≥πd potwierdzania rezerwacji:', err);
            setError('Nie uda≥o siÍ potwierdziÊ rezerwacji.');
        }
    };



    const handleCancelReservation = async (reservationId: number) => {
        try {
            if (!token) {
                setError('Musisz byÊ zalogowany!');
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
                    return { ...res, status: 2 };
                }
                return res;
            });
            setAllReservations(updatedList);
            
            setError(null);
        } catch (err) {
            console.error('B≥πd anulowania rezerwacji:', err);
            setError('Nie uda≥o siÍ anulowaÊ rezerwacji.');
        }
    };
    // Obs≈Çuga stan√≥w
    if (loading) {
        return <p>≈Åadowanie rezerwacji...</p>;
    }

    if (error) {
        return (
            <div className="centered-message-container">
                <p className="centered-message" style={{ color: 'black' }}>
                    {error}
                </p>
                {error.includes('Musisz byƒá zalogowany') && (
                    <p className="centered-message-link">
                        <a href="/login">Zaloguj siƒô tutaj</a>
                    </p>
                )}
            </div>
        );
    }
    
    if (allReservations.length === 0 && role==='Admin') {
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
                    <h2 className="reservations-header">Wszystkie Rezerwacje</h2>
                    <div className="reservations-container">
                        <div className="tabs-container">
                            {['all', 'Oczekujace', 'Potwierdzone', 'Anulowane', 'Zakonczone'].map((tab) => (
                                <button
                                    key={tab}
                                    className={`buttons ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab as TabType)}  
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <ul>
                            {allReservations.length === 0 ? (
                                <p>Brak rezerwacji w tej kategorii.</p>
                            ) : (
                                allReservations.map((res) => (
                                    <li key={res.reservationId} className="reservation-item">
                                        <strong>Rezerwacja #{res.reservationId}</strong>
                                        <br />
                                        <span>Rower: {res.bike?.name ?? `ID: ${res.bikeId}`}</span>
                                        <br />
                                        <span>Uzytkownik: {res.userId}</span>
                                        <br />
                                        <span>
                                            Od: {new Date(res.startDate).toLocaleString()} do: {new Date(res.endDate).toLocaleString()}
                                        </span>
                                        <br />
                                        <span>Status: {res.status} | Koszt: {res.totalCost} zl</span>

                                        <br />
                                        <div className="button-container4">
                                            <button
                                                onClick={() => handleConfirmReservation(res.reservationId)}
                                                className="return-button"
                                            >
                                                Potwierdz rezerwacje
                                            </button>
                                            <button
                                                onClick={() => handleCancelReservation(res.reservationId)}
                                                className="return-button2"
                                            >
                                                Anuluj rezerwacje
                                            </button>
                                            <button
                                                
                                                className="return-button3"
                                            >
                                                Wygeneruj PDF
                                            </button>
                                        </div>
                                    </li>
                                ))
                            )}
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
                                const isCompleted = res.status === 3;
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
                                        <span>Status: {res.status} | Koszt: {res.totalCost} z≥</span>

                                        <br />
                                        {!isCompleted ? (
                                            <button
                                                onClick={() => handleReturnBike(res.reservationId)}
                                                className="return-button"
                                            >
                                                ZwrÛÊ rower
                                            </button>
                                        ) : (
                                            <span className="returned-status">Zwrocony</span>
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
