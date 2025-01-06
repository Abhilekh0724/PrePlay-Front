import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./homepage/Homepage";
import Loginpage from "./pages/login/Loginpage";
import Registerpage from "./pages/register/Registerpage";
import Navbar from "./components/Navbar";
import SearchPage from "./pages/search/searchpage";
import CategoryDetail from "./pages/category/CategoryDetail";
import AdminPage from "./pages/admin/AdminPage";
import Profile from "./pages/profile/profile";
import LoadingScreen from './components/LoadingScreen';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AdminBooked from "./pages/admin/AdminBooked";
import AdminRoute from './components/AdminRoute';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Minimum loading time for loading screen
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Add a protected route wrapper
  const ProtectedRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/register" element={<Registerpage />} />
        <Route path="/pre-book" element={
          <ProtectedRoute>
            <CategoryDetail />
          </ProtectedRoute>
        } />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/category/:id" element={<CategoryDetail />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          </ProtectedRoute>
        } />
        <Route path="/admin-booked" element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminBooked />
            </AdminRoute>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/homepage" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
