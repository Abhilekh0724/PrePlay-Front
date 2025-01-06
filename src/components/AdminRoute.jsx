import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';

const AdminRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = () => {
      const user = JSON.parse(localStorage.getItem('user'));
      console.log('Checking admin status:', user);
      setIsAdmin(user?.isAdmin === true);
      setIsChecking(false);
    };

    checkAdmin();
  }, []);

  if (isChecking) {
    return <LoadingScreen />;
  }

  if (!isAdmin) {
    console.log('Not admin, redirecting...');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute; 