import React, { useState } from 'react';
import NavBar from '../NavBar';
import '../Styles/Login.css';

const Logowanie = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isTouched, setIsTouched] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLogin, setIsLogin] = useState(true);  // Dodany stan do przechowywania wybranego formularza

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    const Email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const isPasswordValid = regularExpression.test(password);
    const isEmailValid = Email.test(email);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsTouched(true);

        if (isPasswordValid && isEmailValid) {
            const userData = {
                username: username,
                email: email,
                password: password,
                phoneNumber: phoneNumber,
            };

            try {
                const url = isLogin
                    ? 'https://localhost:7032/api/auth/login'  // Endpoint logowania
                    : 'https://localhost:7032/api/auth/register';  // Endpoint rejestracji
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });

                if (response.ok) {
                    if (isLogin) {
                        setSuccessMessage('Zalogowano pomyślnie.');
                    } else {
                        setSuccessMessage('Użytkownik zarejestrowany pomyślnie.');
                    }
                    setErrorMessage('');
                } else {
                    setErrorMessage('Wystąpił błąd.');
                    setSuccessMessage('');
                }
            } catch (error) {
                setErrorMessage('Błąd połączenia z serwerem.');
                setSuccessMessage('');
            }
        }
    };

    return (
        <div className="login-page">
            <h1>Logowanie</h1>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="square"></div>
                <div className="button-container">
                    <button
                        type="button"
                        className="login-register-button1"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsLogin(true);
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
                        }}
                    >
                        Zarejestruj się
                    </button>
                </div>

                {/* Pola dla rejestracji */}
                {!isLogin && (
                    <>
                        <input
                            type="text"
                            id="imie"
                            className="imie"
                            name="imie"
                            placeholder="imię"
                        />
                        <input
                            type="text"
                            id="nazwisko"
                            name="nazwisko"
                            className="nazwisko"
                            placeholder="nazwisko"
                        />
                    </>
                )}

                {/* Pole e-mail */}
                <input
                    type="email"
                    id="email"
                    name="email"
                    className="email"
                    placeholder="adres email"
                    value={email}
                    onChange={handleEmailChange}
                />

                {/* Pole hasło */}
                <input
                    type={showPassword ? 'text' : 'password'}
                    id="haslo"
                    className="haslo"
                    name="haslo"
                    placeholder="Hasło"
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={() => setIsTouched(true)}
                />
                <label className="pokaz">
                    <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={togglePassword}
                    />
                    Pokaż hasło
                </label>

                {/* Komunikat walidacji hasła */}
                {isTouched && (
                    <p
                        className="zapisz2"
                        style={{ color: isPasswordValid ? 'green' : 'red' }}
                    >
                        {isPasswordValid
                            ? 'Hasło jest poprawne!'
                            : 'Hasło musi zawierać cyfrę, znak specjalny i mieć od 6 do 16 znaków.'}
                    </p>
                )}

                {/* Przycisk submit */}
                <input
                    type="submit"
                    className="zapisz"
                    value={isLogin ? 'Zaloguj się' : 'Zarejestruj'}
                    disabled={!isPasswordValid || !isEmailValid}
                />

                {/* Komunikaty o błędach/sukcesach */}
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            </form>
        </div>
    );
};

export default Logowanie;