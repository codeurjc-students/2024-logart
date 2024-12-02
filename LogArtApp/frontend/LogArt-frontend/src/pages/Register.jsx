import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(username, email, password, firstName, lastName);
    if (result.success) {
      setMessage(result.message);
      setError('');
      navigate('/login');
    } else {
      setError(result.message);
      setMessage('');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Registrarse</h2>
      {error && <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">{error}</div>}
      {message && <div className="bg-green-200 text-green-800 p-2 mb-4 rounded">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Nombre de Usuario</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className="w-full border p-2 rounded" 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Correo Electrónico</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full border p-2 rounded" 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Nombre</label>
          <input 
            type="text" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            className="w-full border p-2 rounded" 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Apellido</label>
          <input 
            type="text" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            className="w-full border p-2 rounded" 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Contraseña</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full border p-2 rounded" 
            required 
          />
        </div>
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Registrarse</button>
      </form>
      <p className="mt-4 text-center">
        ¿Ya tienes una cuenta? <Link to="/login" className="text-blue-500">Iniciar Sesión</Link>
      </p>
    </div>
  );
};

export default Register;
