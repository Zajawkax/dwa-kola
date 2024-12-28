// ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedProps> = ({ children }) => {
    const token = localStorage.getItem('authToken');

    // Jeśli token nie istnieje, przekieruj na stronę logowania
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Jeśli token istnieje, renderuj zawartość (children)
    return <>{children}</>;
};

export default ProtectedRoute;
