import {BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from 'react'
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ObjectDetails from "./pages/ObjectDetail";
import ObjectsByDiscipline from "./pages/ObjectsByDiscipline";
import Header from "./components/Header";
import Hero from "./pages/Hero";
import { ModalProvider } from "./context/ModalContext";
import ErrorPage from "./components/ErrorPage";


const App = () => {
  return (
    <ModalProvider>
    <Router>
      
        <Header />
        <main className="overflow-hidden">
          <Routes>
            <Route path="/" element={<Hero />} />
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
             <Route path="/404-error" element={<ErrorPage />} />
             <Route path="*" element={<Navigate to="/404-error" replace /> } />
          </Routes>
        </main>
        {/* <Footer /> */}
      
    </Router>
    </ModalProvider>
  );
}

export default App