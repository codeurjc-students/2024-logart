import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from '../utilities/api';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext); 
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    profileImage: null,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        bio: user.bio || '',
        profileImage: user.profileImage || null,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage') {
      setFormData(prevState => ({ ...prevState, profileImage: files[0] }));
    } else {
      setFormData(prevState => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const data = new FormData();
    data.append('username', formData.username);
    data.append('firstName', formData.firstName);
    data.append('lastName', formData.lastName);
    data.append('email', formData.email);
    data.append('bio', formData.bio);
    if (formData.profileImage) {
      data.append('profileImage', formData.profileImage);
    }

    try {
      const response = await axios.put('/api/v1/users/profile', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
      setUser(response.data.user);
    } catch (err) {
      console.error('Error al actualizar el perfil:', err);
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Mi Perfil</h2>
      {error && <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">{error}</div>}
      {message && <div className="bg-green-200 text-green-800 p-2 mb-4 rounded">{message}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block mb-1">Nombre de Usuario</label>
          <input 
            type="text" 
            name="username"
            value={formData.username} 
            onChange={handleChange} 
            className="w-full border p-2 rounded" 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Nombre</label>
          <input 
            type="text" 
            name="firstName"
            value={formData.firstName} 
            onChange={handleChange} 
            className="w-full border p-2 rounded" 
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Apellido</label>
          <input 
            type="text" 
            name="lastName"
            value={formData.lastName} 
            onChange={handleChange} 
            className="w-full border p-2 rounded" 
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Correo Electrónico</label>
          <input 
            type="email" 
            name="email"
            value={formData.email} 
            onChange={handleChange} 
            className="w-full border p-2 rounded" 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Biografía</label>
          <textarea 
            name="bio"
            value={formData.bio} 
            onChange={handleChange} 
            className="w-full border p-2 rounded" 
            rows="4"
            maxLength="500"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Foto de Perfil</label>
          <input 
            type="file" 
            name="profileImage"
            accept="image/*"
            onChange={handleChange} 
            className="w-full"
          />
        </div>
        {user.profileImage && (
          <div className="mb-4">
            <img src={`http://localhost:443${user.profileImage}`} alt="Profile" className="w-32 h-32 object-cover rounded-full" />
          </div>
        )}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Actualizar Perfil</button>
      </form>
    </div>
  );
};

export default Profile;
