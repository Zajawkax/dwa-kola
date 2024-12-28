import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, NavLink } from 'react-router-dom';
import '../Styles/BikeList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEye, faEdit, faTrash, faBicycle } from '@fortawesome/free-solid-svg-icons';
import { Menu, Button } from 'semantic-ui-react';

interface Bike {
    bikeId: number;
    name: string;
    size: number; // np. 0=Small,1=Medium
    bikeType: number; // np. 0=Mountain,1=Road
}

const BikeList: React.FC = () => {
    const [bikes, setBikes] = useState < Bike[] > ([]);
    const [error, setError] = useState < string | null > (null);
    const [loading, setLoading] = useState < boolean > (true);

    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role'); // 'Admin' lub 'User'

    useEffect(() => {
        fetchBikes();
    }, []);

    const fetchBikes = async () => {
        setLoading(true);
        try {
            const response = await axios.get < Bike[] > ('https://localhost:7032/api/bikes');
            setBikes(response.data);
        } catch (err: any) {
            console.error('Błąd pobierania listy rowerów:', err);
            setError('Nie udało się pobrać listy rowerów.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBike = async (bikeId: number) => {
        try {
            if (!token) {
                setError('Musisz być zalogowany!');
                return;
            }

            if (window.confirm('Czy na pewno chcesz usunąć ten rower?')) {
                await axios.delete(`https://localhost:7032/api/Bikes/${bikeId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBikes((prev) => prev.filter((b) => b.bikeId !== bikeId));
            }
        } catch (err: any) {
            console.error('Błąd usuwania roweru:', err);
            setError('Nie udało się usunąć roweru.');
        }
    };

    const handleAddBike = () => {
        console.log('Dodaj rower (tylko Admin)');
    };

    const handleEditBike = (bikeId: number) => {
        console.log(`Edytuj rower o ID: ${bikeId} (tylko Admin)`);
    };

    if (loading) {
        return <p>Ładowanie danych...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className="bike-list-container">
            {/* Menu dla Admina */}
            {role === 'Admin' && (
                <div className="bike-list__header">
                    <Menu.Item as={NavLink} to="/bikes/create-bike">
                        <Button content="Dodaj Rower" size="large" className="custom-button17" onClick={handleAddBike} />
                    </Menu.Item>
                    <Menu.Item as={NavLink} to="/bikes/filtersort">
                        <Button content="Filtrowanie/Sortowanie" size="large" className="custom-button18" />
                    </Menu.Item>
                </div>
            )}

            {/* Lista rowerów */}
            {bikes.length > 0 ? (
                <div className="bike-grid">
                    {bikes.map((bike) => (
                        <div key={bike.bikeId} className="bike-card">
                            <span className="bike-item">
                                <FontAwesomeIcon icon={faBicycle} /> {bike.name}
                            </span>
                            <div>
                                <Link to={`/details/${bike.bikeId}`} className="bike-item-button">
                                    <FontAwesomeIcon icon={faEye} /> Szczegóły
                                </Link>

                                {/* Opcje Admina */}
                                {role === 'Admin' && (
                                    <>
                                        <Link to={`/edit/${bike.bikeId}`} className="edit-button">
                                            <FontAwesomeIcon icon={faEdit} /> Edytuj
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteBike(bike.bikeId)}
                                            className="btn btn-danger bike-item-button"
                                        >
                                            <FontAwesomeIcon icon={faTrash} /> Usuń
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Brak rowerów do wyświetlenia.</p>
            )}
        </div>
    );
};

export default BikeList;
