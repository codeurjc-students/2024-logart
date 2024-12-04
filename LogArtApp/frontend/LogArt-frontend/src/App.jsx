import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
             {/* Implementar error page */}
          </Routes>
        </main>
        {/* <Footer /> */}
      
    </Router>
    </ModalProvider>
  );
}

export default App