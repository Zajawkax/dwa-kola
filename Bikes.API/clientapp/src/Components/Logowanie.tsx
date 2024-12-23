import React, { useState } from 'react';
import '../Styles/Login.css';
import axios from 'axios';

const Logowanie = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    });
    const [registerInfo, setRegisterInfo] = useState({
        username: '',
        phoneNumber: '',
        email: '',
        password: ''
    });
    const [error, setErrorMessage] = useState<string | null>(null);
    const [success, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);  // Added state to store which form to show

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginInfo((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRegisterInfo((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        try {
            setLoading(true);
            const response = await axios.post('https://localhost:7032/api/Auth/login', loginInfo);

            if (response.status === 200) {
                const { token, username } = response.data;

                console.log('Zalogowano pomyślnie.', { token, username });
                setSuccessMessage("Zalogowano pomyślnie.")
                localStorage.setItem('authToken', token);
                localStorage.setItem('displayName', username); // Saving the username as displayName
            }
        } catch (error: any) {
            console.error('Error during login:', error);
            setErrorMessage(error.response?.data?.message || 'Próba logowania nie powiodła się. Sprawdź swoje dane.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        try {
            setLoading(true);
            const response = await axios.post('https://localhost:7032/api/Auth/register', registerInfo);

            if (response.status === 200) {
                const { token, username } = response.data;

                console.log('Rejestracja zakończona sukcesem:', { token, username });
                setSuccessMessage("Rejestracja zakończona sukcesem.")
                localStorage.setItem('authToken', token);
                localStorage.setItem('username', username);
            }
        } catch (error: any) {
            console.error('Error during registration:', error);
            setErrorMessage(error.response?.data?.message || 'Rejestracja nie powiodła się. Spróbuj ponownie.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <h1>{isLogin ? 'Logowanie' : 'Rejestracja'}</h1>
            <form onSubmit={isLogin ? handleLogin : handleRegister} className="login-form">
                <div className="square"></div>
                <div className="button-container">
                    <button
                        type="button"
                        className="login-register-button1"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsLogin(true);
                            setSuccessMessage(null)
                            setErrorMessage(null)
                        }}
                    >
                        Zaloguj się
                    </button>
                    <button
                        type="button"
                        className="login-register-button2"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsLogin(false);
                            setSuccessMessage(null)
                            setErrorMessage(null)
                        }}
                    >
                        Zarejestruj się
                    </button>
                </div>

                {/* Conditional form rendering */}
                {isLogin ? (
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="email"
                        placeholder="Email"
                        value={loginInfo.email}
                        onChange={handleLoginInputChange}
                    />
                ) : (
                    <>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="username"
                            placeholder="Nazwa użytkownika"
                            value={registerInfo.username}
                            onChange={handleRegisterInputChange}
                        />
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="email"
                            placeholder="Email"
                            value={registerInfo.email}
                            onChange={handleRegisterInputChange}
                        />
                        <input
                            type="text"
                            id="phoneNumber"
                            name="phoneNumber"
                            className="displayName"
                            placeholder="Numer telefonu"
                            value={registerInfo.phoneNumber}
                            onChange={handleRegisterInputChange}
                        />
                    </>
                )}

                <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="haslo"
                    name="password"
                    placeholder="Hasło"
                    value={isLogin ? loginInfo.password : registerInfo.password}
                    onChange={isLogin ? handleLoginInputChange : handleRegisterInputChange}
                />

                <label className="pokaz">
                    <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={togglePassword}
                    />
                    Pokaż hasło
                </label>

                <input
                    type="submit"
                    className="zapisz"
                    value={isLogin ? 'Zaloguj się' : 'Zarejestruj'}
                    disabled={loading}
                />

                {/* Error and success messages */}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </form>
        </div>
    );
};

export default Logowanie;
