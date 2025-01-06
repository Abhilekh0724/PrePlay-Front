import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { loginUserApi } from '../../api/Api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';

const Loginpage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUserApi({ email, password });
      console.log('Login response:', response.data); // Debug log

      if (response.data.success) {
        const { token, userData } = response.data;
        
        // Make sure userData includes isAdmin
        console.log('User data:', userData); // Debug log

        // Store complete user data including isAdmin
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Dispatch event for Navbar update
        window.dispatchEvent(new Event('userLogin'));

        toast.success('Login successful');
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Stars Background */}
      <div className="stars-container">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.1}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
              opacity: Math.random(),
              transform: `scale(${0.5 + Math.random()}) rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>

      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '40px',
          borderRadius: '20px',
          border: '1px solid #00ff00',
          boxShadow: '0 0 20px rgba(0, 255, 0, 0.2)',
          width: '90%',
          maxWidth: '400px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img
            src="/lo.png"
            alt="Logo"
            style={{
              width: '200px',
              marginBottom: '20px',
            }}
            onError={(e) => {
              console.error('Error loading image:', e);
            }}
          />
          <h2
            style={{
              color: '#00ff00',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              fontSize: '24px',
              marginBottom: '20px',
              textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
            }}
          >
            Login
          </h2>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group" style={{ marginBottom: '20px' }}>
            <div
              style={{
                position: 'relative',
                width: '100%',
              }}
            >
              <FontAwesomeIcon
                icon={faUser}
                style={{
                  position: 'absolute',
                  left: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#00ff00',
                }}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 20px 12px 45px',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid #00ff00',
                  borderRadius: '25px',
                  color: '#fff',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                }}
              />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '30px' }}>
            <div
              style={{
                position: 'relative',
                width: '100%',
              }}
            >
              <FontAwesomeIcon
                icon={faLock}
                style={{
                  position: 'absolute',
                  left: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#00ff00',
                }}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 20px 12px 45px',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid #00ff00',
                  borderRadius: '25px',
                  color: '#fff',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#00ff00',
              color: '#000',
              border: 'none',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '20px',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#00cc00')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#00ff00')}
          >
            LogIn
          </button>

          <div style={{ textAlign: 'center', color: '#999' }}>
            New Player?{' '}
            <Link
              to="/register"
              style={{
                color: '#00ff00',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.target.style.color = '#00cc00')}
              onMouseLeave={(e) => (e.target.style.color = '#00ff00')}
            >
              Create Account
            </Link>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Loginpage;
