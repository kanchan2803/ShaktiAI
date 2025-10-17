import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import Loader from './layouts/Loader';

const ProtectedRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        // You can add a spinner or loading component here
        return <Loader />;
    }

    // If a user exists, render the nested routes. Otherwise, redirect to login.
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;