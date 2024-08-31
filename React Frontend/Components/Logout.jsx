// src/components/Logout.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from local storage
        navigate('/login'); // Redirect to the login page
    };

    return (
        <a href="#" onClick={handleLogout} className="flex items-center">
            <i className="ri-logout-box-line"></i> Logout
        </a>
    );
};

export default Logout;
