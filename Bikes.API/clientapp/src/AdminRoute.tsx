// AdminRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
    children: React.ReactNode;
}

const AdminRoute: React.FC<Props> = ({ children }) => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (role !== 'Admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

export default AdminRoute;
