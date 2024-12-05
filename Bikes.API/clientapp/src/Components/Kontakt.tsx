import React, { useState } from 'react';
import '../Styles/contact.css';

const Contact = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (message.trim() === '') {
            setError('Nie możesz wysłać pustej wiadomości.');
            setMessage('');
            return;
        }

      
        alert('Twoja wiadomość została wysłana: ' + message);
        setMessage('');
        setError('');
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        if (e.target.value.trim() !== '') {
            setError(''); 
        }
    };

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
            <p>Email: dwakolkacontact@gmail.com</p>
        </div>
    );
};

export default Contact;
