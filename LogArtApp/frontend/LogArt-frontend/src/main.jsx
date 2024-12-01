import ReactDOM from 'react-dom/client'
import { AuthProvider } from './context/AuthContext.jsx'
import React from 'react'
import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App /> 
    </AuthProvider>
  </React.StrictMode>
);