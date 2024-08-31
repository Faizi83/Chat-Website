import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import { FaEdit } from 'react-icons/fa';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    image: 'https://localhost:7180/images/userimage.png', // Default image path
    password: '',
    gender: '' // Gender state
  });
  const [error, setError] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No token found. Please log in.');
        return;
      }

      try {
        const response = await axios.get('https://localhost:7180/api/Working/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUserData(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError('Unauthorized. Please log in again.');
        } else {
          setError('An error occurred while fetching user data.');
        }
      }
    };

    fetchUserData();
  }, []);

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('password', userData.password);
      formData.append('gender', userData.gender); // Gender included in form data
      
      if (fileInputRef.current.files[0]) {
        formData.append('image', fileInputRef.current.files[0]);
      }

      await axios.put('https://localhost:7180/api/Working/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setIsEditable(false);
      setShowModal(true);
    } catch (error) {
      setError('An error occurred while saving the data.');
    }
  };

  const handleCancelClick = () => {
    setIsEditable(false);
    setPreviewImage('');
  };

  const handleImageClick = () => {
    if (isEditable && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="chat-section">
      <div className="chat-container">
        <Navbar />
        <div
          className="profile-details"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '16px',
            marginTop: '12%',
          }}
        >
          <div style={{ position: 'relative' }}>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              name="image"
            />
            <img
              src={previewImage || `https://localhost:7180${userData.image}`}
              alt="User"
              style={{
                width: '130px',
                height: '115px',
                borderRadius: '50%',
                marginBottom: '16px',
                cursor: isEditable ? 'pointer' : 'default',
              }}
              onClick={handleImageClick}
            />
            <FaEdit
              onClick={handleEditClick}
              style={{
                position: 'absolute',
                left: '135px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.5rem',
                color: '#8B5CF6',
                cursor: 'pointer',
              }}
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ margin: '16px 0' }}>
              <label
                htmlFor="name"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Name:
              </label>
              <input
                id="name"
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                style={{
                  fontSize: '1rem',
                  padding: '8px',
                  border: isEditable ? '1px solid #ccc' : 'none',
                  borderRadius: '4px',
                  width: '200px',
                  textAlign: 'center',
                  backgroundColor: isEditable ? '#fff' : 'transparent',
                }}
                readOnly={!isEditable}
              />
            </div>
            <div style={{ margin: '16px 0' }}>
              <label
                htmlFor="password"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Password:
              </label>
              <input
                id="password"
                type="text"
                value={userData.password}
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                style={{
                  fontSize: '1rem',
                  padding: '8px',
                  border: isEditable ? '1px solid #ccc' : 'none',
                  borderRadius: '4px',
                  width: '200px',
                  textAlign: 'center',
                  backgroundColor: isEditable ? '#fff' : 'transparent',
                }}
                readOnly={!isEditable}
              />
            </div>
            <div style={{ margin: '16px 0' }}>
              <label
                htmlFor="gender"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Gender:
              </label>
              <select
                id="gender"
                value={userData.gender}
                onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
                style={{
                  fontSize: '1rem',
                  padding: '8px',
                  border: isEditable ? '1px solid #ccc' : 'none',
                  borderRadius: '4px',
                  width: '200px',
                  textAlign: 'center',
                  backgroundColor: isEditable ? '#fff' : 'transparent',
                }}
                disabled={!isEditable}
              >
              
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            {isEditable && (
              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button
                  onClick={handleSaveClick}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#8B5CF6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Save
                </button>
                <button
                  onClick={handleCancelClick}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f5f5f5',
                    color: '#333',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
              <p className="text-lg font-semibold">Profile saved successfully!</p>
              <button
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowModal(false)}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
