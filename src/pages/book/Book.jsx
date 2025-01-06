import React, { useEffect, useState } from 'react';
import { getBookingsByUserApi, cancelBookingApi, createPaymentApi } from '../../api/Api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getBookingsByUserApi();
        if (response.data.success) {
          setBookings(response.data.bookings);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error('Error fetching bookings');
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await cancelBookingApi(bookingId);
      if (response.data.success) {
        setBookings(bookings.filter((booking) => booking._id !== bookingId));
        toast.success('Booking canceled successfully');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Error canceling booking');
    }
  };

  const handlePayment = async (booking) => {
    const formData = {
      userId: booking.userId,
      categoryId: booking.categoryId._id,
      bookingDate: booking.bookingDate,
      amount: booking.amount, // Adjust this based on your payment requirements
    };

    try {
      const response = await createPaymentApi(formData);
      if (response.data.success) {
        const esewaPath = "https://uat.esewa.com.np/epay/main";
        const form = document.createElement("form");
        form.setAttribute("method", "POST");
        form.setAttribute("action", esewaPath);

        Object.keys(response.data.formData).forEach(key => {
          const hiddenField = document.createElement("input");
          hiddenField.setAttribute("type", "hidden");
          hiddenField.setAttribute("name", key);
          hiddenField.setAttribute("value", response.data.formData[key]);
          form.appendChild(hiddenField);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        toast.error(response.data.message || 'Payment initiation failed');
      }
    } catch (error) {
      toast.error('Error initiating payment');
    }
  };

  return (
    <div className="container mt-4">
      <div className="bookings">
        <h1>Your Bookings</h1>
        {bookings.length === 0 ? (
          <p>No bookings available.</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking._id} className="booking-item">
              <p>Booking Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
              <p>Category: {booking.categoryId.name}</p>
              <p>Booking Created At: {new Date(booking.createdAt).toLocaleDateString()}</p>
              <div className="booking-actions">
                <button onClick={() => handleCancelBooking(booking._id)} className="btn btn-danger">Cancel Booking</button>
                <button onClick={() => handlePayment(booking)} className="btn btn-primary">Pay Now</button>
              </div>
            </div>
          ))
        )}
      </div>
      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          background-color: #f8bbd0; /* Baby Pink Background */
          padding: 20px;
        }

        .bookings {
          max-width: 800px;
          width: 100%;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          padding: 20px;
          margin-top: 20px;
        }

        h1 {
          font-size: 2em;
          margin-bottom: 10px;
          color: #333;
        }

        p {
          font-size: 1.2em;
          margin: 10px 0;
          color: #555;
        }

        .booking-item {
          padding: 10px;
          background-color: #f9f9f9;
          border: 1px solid #eee;
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .booking-actions {
          margin-top: 10px;
        }

        .btn {
          padding: 10px 20px;
          margin-right: 10px;
          border: none;
          border-radius: 4px;
          color: #fff;
          cursor: pointer;
        }

        .btn-danger {
          background-color: #d9534f;
        }

        .btn-primary {
          background-color: #0275d8;
        }

        .btn:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
};

export default UserBookings;
