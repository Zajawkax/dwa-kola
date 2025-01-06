import React, { useEffect, useState } from 'react';

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchMessages = async () => {
            const response = await fetch('https://localhost:7032/api/messages/Admin', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
        };

        fetchMessages();
    }, [token]);

    return (
        <div className="admin-messages-container">
            <h1>Wiadomości od użytkowników</h1>
            {messages.length === 0 ? (
                <p>Brak nowych wiadomości.</p>
            ) : (
                <ul>
                    {messages.map((msg: any) => (
                        <li key={msg.messageId}>
                            <p><strong>{msg.userId}</strong>: {msg.content}</p>
                            <p><em>{new Date(msg.sentDate).toLocaleString()}</em></p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminMessages;
