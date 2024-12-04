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
            <div className="button-container">
                {/* Przełączanie między formularzami */}
                <button className="login-register-button" onClick={() => setIsLogin(true)}>Zaloguj się</button>
                <button className="login-register-button" onClick={() => setIsLogin(false)}>Zarejestruj się</button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="square"></div>

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

                <input
                    type="email"
                    id="email"
                    name="email"
                    className="email"
                    placeholder="adres email"
                    value={email}
                    onChange={handleEmailChange}
                />

                <input
                    type={showPassword ? 'text' : 'password'}
                    id="haslo"
                    className="haslo"
                    name="haslo"
                    placeholder="Hasło"
                    value={password}
                    onChange={handlePasswordChange}
                />
                <label className="pokaz">
                    <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={togglePassword}
                    />
                    Pokaż hasło
                </label>

                {isTouched && (
                    <>
                        <p className="zapisz2" style={{ color: isPasswordValid ? 'green' : 'red' }}>
                            {isPasswordValid
                                ? 'Hasło jest poprawne!'
                                : 'Hasło musi zawierać cyfrę, znak specjalny i mieć od 6 do 16 znaków.'}
                        </p>
                        <p className="zapisz2" style={{ color: isEmailValid ? 'green' : 'red' }}>
                            {isEmailValid ? 'Email jest poprawny!' : 'Email jest niepoprawny.'}
                        </p>
                    </>
                )}

                <input
                    type="submit"
                    className="zapisz"
                    value={isLogin ? 'Zaloguj się' : 'Zarejestruj'}
                    disabled={!isPasswordValid || !isEmailValid}
                />

                {/* Wyświetlanie komunikatów o sukcesie lub błędzie */}
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            </form>
        </div>
    );
}
export default Logowanie;
