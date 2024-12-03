import React, { useState } from 'react';
import NavBar from '../NavBar';
import '../Styles/Login.css';

const Logowanie = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isTouched, setIsTouched] = useState(false); 
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
    const isEmailValid = Email.test(email);  // Zmieniamy na właściwą walidację e-maila

    return (
        <div className="login-page">
            <div>
                <form action="/action_page.php">
                    <div className="square"></div>
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
                    <input
                        type="text"
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
                        value="Zarejestruj"
                        disabled={!isPasswordValid || !isEmailValid}
                    />
                </form>
            </div>
        </div>
    );
};

export default Logowanie;
