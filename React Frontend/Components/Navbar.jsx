import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Logout from '../Components/Logout';
import './tailwindcss-colors.css';
import './style.css';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [profileImage, setProfileImage] = useState('');
    const location = useLocation();

    useEffect(() => {
        const fetchUserProfileImage = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get('https://localhost:7180/api/Working/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setProfileImage(response.data.image); // Assuming 'image' contains the path to the user's image

            } catch (error) {
                console.error('Error fetching user profile image:', error);
            }
        };

        fetchUserProfileImage();
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <aside className="chat-sidebar">
            <a href="#" className="chat-sidebar-logo">
                <i className="ri-chat-1-fill"></i>
            </a>
            <ul className="chat-sidebar-menu">
                <li className={location.pathname === '/chat' ? 'active' : ''}>
                    <Link to="/chat" data-title="Chats">
                        <i className="ri-chat-3-line"></i>
                    </Link>
                </li>
                <li className={location.pathname === '/profile' ? 'active' : ''}>
                    <Link to="/profile" data-title="Profile">
                        <i className="ri-contacts-line"></i>
                    </Link>
                </li>
                <li className={location.pathname === '/settings' ? 'active' : ''}>
                    <Link to="/settings" data-title="Settings">
                        <i className="ri-settings-line"></i>
                    </Link>
                </li>
                <li className={`chat-sidebar-profile ${isDropdownOpen ? 'active' : ''}`}>
                    <button
                        type="button"
                        className="chat-sidebar-profile-toggle"
                        onClick={toggleDropdown}
                    >
                        <img
                            src={profileImage ? `https://localhost:7180${profileImage}` : 'https://localhost:7180/images/userimage.png'}
                            alt="Profile"
                            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                        />

                    </button>

                    <ul className="chat-sidebar-profile-dropdown">
                        <li>
                            <Link to="/profile">
                                <i className="ri-user-line"></i> Profile
                            </Link>
                        </li>
                        <li><Logout /></li>
                    </ul>
                </li>
            </ul>
        </aside>
    );
};

export default Navbar;
