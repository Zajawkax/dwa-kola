import React, { useState, useEffect } from 'react';
import '../Styles/Contact.css';

const Contact: React.FC = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    
    useEffect(() => {
        // Sprawdzenie roli użytkownika z localStorage (lub dowolnego źródła)
        const role = localStorage.getItem('role');
        if (role === 'Admin') {
            setIsAdmin(true);
        }
    }, []);

    // Lista zaufanych domen
    const trustedDomains = [
        'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com',
        'wp.pl', 'o2.pl', 'onet.pl', 'interia.pl', 'gazeta.pl',
        'protonmail.com', 'zoho.com', 'mail.com', 'yandex.com', 'gmx.com'
    ];

    // Dozwolone rozszerzenia domen
    const allowedExtensions = ['.com', '.pl', '.org', '.net', '.edu', '.gov'];

    const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email.trim()) {
            displayError('Proszę podać swój adres e-mail.');
            return;
        }

        const emailParts = email.split('@');
        if (emailParts.length !== 2 || !emailParts[1]) {
            displayError('Nieprawidłowy adres e-mail.');
            return;
        }

        const domain = emailParts[1].toLowerCase();

        // Sprawdzenie, czy domena jest zaufana
        const isDomainTrusted = trustedDomains.includes(domain);

        if (!isDomainTrusted) {
            displayError(`Domena "${domain}" nie jest obsługiwana.`);
            return;
        }

        const isExtensionAllowed = allowedExtensions.some((ext) => domain.endsWith(ext));
        if (!isExtensionAllowed) {
            displayError(`Domena "${domain}" nie ma prawidłowego rozszerzenia.`);
            return;
        }

        setSuccessMessage('Przekierowuję Cię do strony pocztowej...');
        setError('');

        setTimeout(() => {
            // Otwórz stronę pocztową w nowym oknie
            window.open(`https://${domain}`, '_blank');

            // Zresetuj stan formularza
            setEmail('');
            setSuccessMessage('');
        }, 2000);
    };

    const displayError = (message: string) => {
        setError(message);
        setTimeout(() => setError(''), 4000);
    };

    if (isAdmin) {
        // Widok dla administratora
        return (
            <div className="admin-route">
                <p className="contact-header">Panel kontaktowy administratora</p>
                <p className = "text-contact">
                    Witaj, administratorze! Możesz skontaktować się z nami, przechodząc do swojej skrzynki pocztowej.
                </p>
                <button
                    onClick={() => window.open('https://mail.google.com', '_blank')}
                    className="admin-button"
                >
                    Przejdź do Gmail
                </button>
            </div>
        );
    }

    // Widok dla zwykłego użytkownika
    return (
        <div className="contact-container">
            <p className="contact-header">Skontaktuj się z nami</p>
            <p>
                Aby się z nami skontaktować, wyślij nam wiadomość na naszego maila lub telefon:
            </p>
            <p>
                <b>Telefon:</b> 123456789
            </p>
            <p>
                <b>Email:</b> dwakolkacontact@gmail.com
            </p>
            <form onSubmit={handleEmailSubmit}>
                <label htmlFor="email">Podaj swój adres e-mail:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Twój e-mail..."
                />
                <button type="submit">Przekieruj na stronę pocztową</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
    );
};

export default Contact;
