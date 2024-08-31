import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import img from '../src/assets/img.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    gender: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('email', formData.email);
    data.append('name', formData.name);
    data.append('password', formData.password);
    data.append('gender', formData.gender);

    try {
      const response = await axios.post('https://localhost:7180/api/working/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        console.log('Registration successful');
        navigate('/login');
      } else {
        console.error('Registration failed:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2 flex justify-center">
            <img src={img} alt="Image" className="w-4/5 h-auto max-w-lg" />
          </div>
          <div className="w-full md:w-1/2 flex items-center">
            <div className="w-full max-w-md mx-auto">
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">Sign Up</h3>
                <p className="text-gray-600">
                  <span style={{ color: '#a855f7', fontWeight: 'bold' }}>ChatWave</span>: Connect Instantly with Friends and Colleagues in Real-Time Chat.
                </p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                    id="email"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                    id="name"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                    id="password"
                  />
                </div>
                <div className="mb-4">
                  <span className="block text-gray-700">Gender</span>
                  <div className="flex items-center mt-2">
                    <label className="flex items-center mr-4">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === 'male'}
                        onChange={handleChange}
                        className="form-radio text-purple-500"
                      />
                      <span className="ml-2">Male</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === 'female'}
                        onChange={handleChange}
                        className="form-radio text-purple-500"
                      />
                      <span className="ml-2">Female</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm">
                    <Link to="/login" className="text-purple-500 hover:underline">Already have an account?</Link>
                  </span>
                </div>
                <input
                  type="submit"
                  value="Register"
                  className="w-full text-white py-2 rounded-md cursor-pointer bg-purple-500"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
