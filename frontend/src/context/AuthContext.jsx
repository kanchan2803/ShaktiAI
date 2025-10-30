import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for user in localStorage on initial component mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Signup function
    const signup = async (userData) => {
        console.log("signup request in context:", userData);
        const { data } = await API.post('/auth/signup', userData);
        localStorage.setItem('userInfo', JSON.stringify(data));
        localStorage.setItem('user', JSON.stringify(data.user)); 
        setUser(data.user);
        console.log("signup succssful");
        return data; // Return data to be used in the component if needed
    };

    // Login function
    const login = async (credentials) => {
        const { data } = await API.post('/auth/login', credentials);
        localStorage.setItem('userInfo', JSON.stringify(data));
        localStorage.setItem('user', JSON.stringify(data.user)); 
        setUser(data.user);
        console.log("Login Succeful, USER:",data.user);
        return data;
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('user');
        setUser(null);
    };

    const isLoggedIn = !!user;

    return (
        <AuthContext.Provider value={{ user, loading, isLoggedIn, signup, login, logout }}>
            {/* Only render children when initial loading is complete */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom hook to easily use the context
export const useAuth = () => {
    return useContext(AuthContext);
}