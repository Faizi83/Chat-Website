import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios'; // Import axios for API calls
import Register from '../Components/Register';
import Login from '../Components/Login';
import Chat from '../Components/Chat';
import Profile from '../Components/Profile';
import Settings from '../Components/Settings';
import ProtectedRoute from '../Components/ProtectedRoute'; // Import the ProtectedRoute component

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Validate token with an API call
                    const response = await axios.get('https://localhost:7180/api/working/validateToken', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setIsAuthenticated(response.status === 200);
                } catch (error) {
                    console.error('Token validation failed:', error);
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
            setLoading(false); // Set loading to false after check
        };

        checkAuthStatus();
    }, []);

    if (loading) {
        // Optionally, show a loading spinner or message while checking auth status
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
