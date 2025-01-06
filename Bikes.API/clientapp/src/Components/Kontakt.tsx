
//import React, { useState } from 'react';
//import '../Styles/contact.css';

//const Contact = () => {
//    const token = localStorage.getItem('authToken'); // Sprawdzamy, czy użytkownik jest zalogowany
//    const [message, setMessage] = useState('');
//    const [error, setError] = useState('');

//    const handleSubmit = (e: React.FormEvent) => {
//        e.preventDefault();

//        if (message.trim() === '') {
//            setError('Nie możesz wysłać pustej wiadomości.');
//            setMessage('');
//            return;
//        }

//        alert('Twoja wiadomość została wysłana: ' + message);
//        setMessage('');
//        setError('');
//    };

//    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//        setMessage(e.target.value);
//        if (e.target.value.trim() !== '') {
//            setError('');
//        }
//    };

//    // Jeśli użytkownik nie jest zalogowany, wyświetlamy komunikat
//    if (!token) {
//        return (
//            <div className="contact-container">
//                <h1>Skontaktuj się z nami</h1>
//                {/* Numer kontaktowy i email */}
//                <p>Możesz skontaktować się z nami telefonicznie lub mailowo:</p>
//                <p>Telefon: <b>123456789</b></p>
//                <p>Email: <b>dwakolkacontact@gmail.com</b></p>

//                <p>Aby uzyskać więcej informacji zaloguj się.</p>
//                <p><a href="/login">Zaloguj się tutaj</a></p>
//            </div>
//        );
//    }

//    return (
//        <div className="contact-container">
//            <h1>Skontaktuj się z nami</h1>
//            <p>Wpisz wiadomość, a my skontaktujemy się z Tobą wkrótce!</p>

//            {error && <p className="error-message">{error}</p>}

//            <form onSubmit={handleSubmit}>
//                <textarea
//                    value={message}
//                    onChange={handleChange}
//                    placeholder="Wpisz wiadomość..."
//                />
//                <button type="submit">Wyślij</button>
//            </form>

//            {/* Numer kontaktowy i email */}
//            <p>Możesz także skontaktować się z nami telefonicznie lub mailowo:</p>
//            <p>Telefon: <b>123456789</b></p>
//            <p>Email: <b>dwakolkacontact@gmail.com</b></p>
//        </div>
//    );
//};

//export default Contact;

import React, { useState } from 'react';
import '../Styles/contact.css';

const Contact = () => {
    const token = localStorage.getItem('authToken');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (message.trim() === '') {
            setError('Nie możesz wysłać pustej wiadomości.');
            setMessage('');
            return;
        }

        // Wysyłanie wiadomości do API
        const response = await fetch('https://localhost:7032/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Wysyłamy token w nagłówku
            },
            body: JSON.stringify({ content: message }),
        });

        if (response.ok) {
            alert('Wiadomość została wysłana.');
        } else {
            alert('Wystąpił błąd przy wysyłaniu wiadomości.');
        }

        setMessage('');
        setError('');
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        if (e.target.value.trim() !== '') {
            setError('');
        }
    };

    if (!token) {
        return (
            <div className="contact-container">
                
                <p>Aby wysłać wiadomość, musisz być zalogowany.</p>
                <p><a href="/login">Zaloguj się tutaj</a></p>
            </div>
        );
    }

    return (
        <div className="contact-container">
            <h1>Skontaktuj się z nami</h1>
            <p>Wpisz wiadomość, a my skontaktujemy się z Tobą wkrótce!</p>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <textarea
                    value={message}
                    onChange={handleChange}
                    placeholder="Wpisz wiadomość..."
                />
                <button type="submit">Wyślij</button>
            </form>
            <p>Możesz także skontaktować się z nami telefonicznie lub mailowo:</p>
                        <p>Telefon: <b>123456789</b></p>
                        <p>Email: <b>dwakolkacontact@gmail.com</b></p>
        </div>
    );
};

export default Contact;

