import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react'
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ObjectDetails from "./pages/ObjectDetail";
import Navbar from "./components/Navbar";
import ObjectsByDiscipline from "./pages/ObjectsByDiscipline";


const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
             path="/profile"
             element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
             }
             />
             <Route
             path="/disciplines"
             element={
              <ProtectedRoute>
                <ObjectsByDiscipline />
              </ProtectedRoute>
             }
             />
             <Route path="/objects/:objectId" element={<ObjectDetails />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App