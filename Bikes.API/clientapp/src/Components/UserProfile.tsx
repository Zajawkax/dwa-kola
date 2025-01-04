﻿import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import '../Styles/Profile.css';

interface UserProfileData {
    username: string;
    email: string;
    phoneNumber: string;
}

const UserProfile: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfileData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [showChangePasswordForm, setShowChangePasswordForm] = useState<boolean>(false);
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [changePasswordMessage, setChangePasswordMessage] = useState<string | null>(null);
    const [changePasswordSuccess, setChangePasswordSuccess] = useState<boolean | null>(null);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('displayName');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setChangePasswordMessage(null);
        setChangePasswordSuccess(null);

        const token = localStorage.getItem('authToken');
        if (!token) {
            setChangePasswordMessage('Authorization token not found.');
            setChangePasswordSuccess(false);
            return;
        }

        try {
            await axios.post(
                'https://localhost:7032/api/auth/change-password-login',
                {
                    currentPassword,
                    newPassword,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setChangePasswordMessage('Password changed successfully.');
            setChangePasswordSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            setChangePasswordMessage(
                error.response?.data?.message || 'Error changing password.'
            );
            setChangePasswordSuccess(false);
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('authToken');
            console.log('Token:', token);

            if (!token) {
                setError('Authorization token not found.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get<UserProfileData>('https://localhost:7032/api/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfile(response.data);
            } catch (err) {
                const error = err as AxiosError;
                if (error.response?.status === 401) {
                    setError('Token is invalid or expired. Please log in again.');
                } else {
                    setError('Error fetching profile data.');
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    return (
        <div className="profile-container">
            <h1>Profil użytkownika</h1>
            {loading ? (
                <p>Ładowanie danych użytkownika...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : profile ? (
                <div>
                    <p>Użytkownik: {profile.username}</p>
                    <p>Email: {profile.email}</p>
                    <p>Numer telefonu: {profile.phoneNumber || 'Brak danych'}</p>
                </div>
            ) : (
                <p>Nie znaleziono danych użytkownika.</p>
            )}

            <button onClick={handleLogout}>Wyloguj</button>
            <button onClick={() => setShowChangePasswordForm(!showChangePasswordForm)}>
                {showChangePasswordForm ? 'Anuluj' : 'Zmień hasło'}
            </button>

            {showChangePasswordForm && (
                <form onSubmit={handlePasswordChange} className="change-password-form">
                    <div>
                        <label htmlFor="currentPassword">Obecne hasło:</label>
                        <input
                            type="password"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="newPassword">Nowe hasło:</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Zmień hasło</button>
                    {changePasswordMessage && (
                        <p
                            style={{
                                color: changePasswordSuccess ? 'green' : 'red',
                            }}
                        >
                            {changePasswordMessage}
                        </p>
                    )}
                </form>
            )}
        </div>
    );
};

export default UserProfile;