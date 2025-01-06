// components/AdminBooked.js
import React, { useState, useEffect } from 'react';
import { getAllBookingsApi } from '../../api/Api';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Navigate } from 'react-router-dom';
import Logo from '../../components/Logo';

const AdminBooked = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(true);

  const checkAdmin = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('Current user:', user);
    return user?.isAdmin === true;
  };

  useEffect(() => {
    const fetchData = async () => {
      const isAdminUser = checkAdmin();
      console.log('Is admin?', isAdminUser);

      if (!isAdminUser) {
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        const response = await getAllBookingsApi();
        if (response.data.success) {
          setBookings(response.data.bookings);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleConfirm = async (bookingId) => {
    try {
      // Add your API call to confirm booking
      console.log('Confirming booking:', bookingId);
    } catch (error) {
      console.error("Error confirming booking:", error);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      // Add your API call to cancel booking
      console.log('Canceling booking:', bookingId);
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{
      marginLeft: '260px',
      marginTop: '70px',
      padding: '40px',
      backgroundColor: '#0a0a0a',
      minHeight: 'calc(100vh - 70px)',
      color: '#fff'
    }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Logo width="150px" />
        <h2 style={{ marginBottom: '30px' }}>Admin Booked Games</h2>
      </div>
      
      <div className="table-responsive">
        <table className="table table-dark table-hover">
          <thead>
            <tr>
              <th>Game</th>
              <th>User</th>
              <th>Booking Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking._id}>
                <td>{booking.category?.name}</td>
                <td>{booking.user?.name}</td>
                <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                <td>
                  <span style={{
                    color: booking.status === 'confirmed' ? '#00ff00' : '#ff0000'
                  }}>
                    {booking.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-success me-2"
                    onClick={() => handleConfirm(booking._id)}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleCancel(booking._id)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBooked;
