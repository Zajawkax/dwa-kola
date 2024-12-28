import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const username = localStorage.getItem('displayName');
    const role = localStorage.getItem('role');

    return (
        <div style={{ padding: '20px' }}>
            {/* Powitanie użytkownika */}
            <h2>Witaj, {username}!</h2>
            <p>Twoja rola to: {role}</p>

            {/* Link do rezerwacji użytkownika */}
            <Link to="/user/reservations">Moje Rezerwacje</Link>
            <br />

            {/* Sekcja dostępna tylko dla Administratora */}
            {role === 'Admin' && (
                <div style={{ marginTop: '15px' }}>
                    <h4>Panel Admina:</h4>
                    <Link to="/admin">Zarządzaj rowerami i rezerwacjami</Link>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
