// src/components/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import img from '../src/assets/img.png';
import '../src/index.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
          const response = await axios.post('https://localhost:7180/api/working/login', 
              new URLSearchParams({ email, password }), 
              { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
          );
  
          if (response.status === 200) {
              const data = response.data;
              localStorage.setItem('token', data.token); // Store token in local storage
              navigate('/chat'); // Redirect to /chat
          } else {
              setError('Invalid email or password');
          }
      } catch (error) {
          if (error.response && error.response.status === 401) {
              // Unauthorized access, invalid email or password
              setError('Invalid email or password');
          } else {
              // General error handling
              setError('An error occurred. Please try again.');
          }
      }
  };
  
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap">
                    <div className="w-full md:w-1/2 flex justify-center">
                        <img src={img} alt="Image" className="w-4/5 h-auto max-w-lg" />
                    </div>
                    <div className="w-full md:w-1/2 flex items-center">
                        <div className="w-full max-w-md mx-auto">
                            <div className="mb-8">
                                <h3 className="text-2xl font-semibold mb-4">Sign In</h3>
                                <p className="text-gray-600">
                                    <span style={{ color: '#a855f7', fontWeight: 'bold' }}>ChatWave</span>: Connect Instantly with Friends and Colleagues in Real-Time Chat.
                                </p>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="password" className="block text-gray-700">Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                {error && <div className="mb-4 text-red-500">{error}</div>}
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-sm">
                                        Not have an account?{" "}
                                        <Link to="/register" className="text-purple-500 hover:underline">
                                            Create one
                                        </Link>
                                    </span>
                                    <span className="text-sm">
                                        <a href="#" className="text-purple-500 hover:underline">Forgot Password?</a>
                                    </span>
                                </div>
                                <input
                                    type="submit"
                                    value="Log In"
                                    className="w-full text-white py-2 rounded-md cursor-pointer bg-purple-500"
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
