import React, { useState } from 'react';
import { createPaymentApi, verifyEsewaPaymentApi } from '../../api/Api';

const PaymentPage = () => {
  const [bookingData, setBookingData] = useState({
    userId: '',
    categoryId: '',
    bookingDate: '',
    amount: '',
  });

  const [verificationData, setVerificationData] = useState({
    oid: '',
    amt: '',
    refId: '',
  });

  const [paymentResponse, setPaymentResponse] = useState(null);
  const [verificationResponse, setVerificationResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleVerificationChange = (e) => {
    const { name, value } = e.target;
    setVerificationData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await createPaymentApi(bookingData);
      if (response.data.success) {
        esewaCall(response.data.formData);
        setPaymentResponse(response.data);
      } else {
        setErrorMessage(response.data.message || 'Error placing booking');
        setPaymentResponse(null);
      }
    } catch (error) {
      console.error('Error placing booking:', error);
      setErrorMessage('Error placing booking');
      setPaymentResponse(null);
    }
  };

  const handleVerifyPayment = async (e) => {
    e.preventDefault();
    try {
      const response = await verifyEsewaPaymentApi(verificationData);
      setVerificationResponse(response.data);
    } catch (error) {
      console.error('Error verifying payment:', error);
      setVerificationResponse({ success: false, message: 'Error verifying payment' });
    }
  };

  const esewaCall = (formData) => {
    console.log(formData);
    const path = "https://uat.esewa.com.np/epay/main";
    const form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", path);

    Object.keys(formData).forEach(key => {
      const hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", formData[key]);
      form.appendChild(hiddenField);
    });

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div>
      <h1>Payment Page</h1>

      <section>
        <h2>Place Order</h2>
        <form onSubmit={handlePlaceOrder}>
          <label>
            User ID:
            <input
              type="text"
              name="userId"
              value={bookingData.userId}
              onChange={handleBookingChange}
              required
            />
          </label>
          <label>
            Category ID:
            <input
              type="text"
              name="categoryId"
              value={bookingData.categoryId}
              onChange={handleBookingChange}
              required
            />
          </label>
          <label>
            Booking Date:
            <input
              type="date"
              name="bookingDate"
              value={bookingData.bookingDate}
              onChange={handleBookingChange}
              required
            />
          </label>
          <label>
            Amount:
            <input
              type="number"
              name="amount"
              value={bookingData.amount}
              onChange={handleBookingChange}
              required
            />
          </label>
          <button type="submit">Place Order</button>
        </form>

        {paymentResponse && (
          <div>
            <h3>Payment Response</h3>
            <pre>{JSON.stringify(paymentResponse, null, 2)}</pre>
          </div>
        )}

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </section>

      <section>
        <h2>Verify Payment</h2>
        <form onSubmit={handleVerifyPayment}>
          <label>
            Order ID:
            <input
              type="text"
              name="oid"
              value={verificationData.oid}
              onChange={handleVerificationChange}
              required
            />
          </label>
          <label>
            Amount:
            <input
              type="number"
              name="amt"
              value={verificationData.amt}
              onChange={handleVerificationChange}
              required
            />
          </label>
          <label>
            Reference ID:
            <input
              type="text"
              name="refId"
              value={verificationData.refId}
              onChange={handleVerificationChange}
              required
            />
          </label>
          <button type="submit">Verify Payment</button>
        </form>

        {verificationResponse && (
          <div>
            <h3>Verification Response</h3>
            <pre>{JSON.stringify(verificationResponse, null, 2)}</pre>
          </div>
        )}
      </section>
    </div>
  );
};

export default PaymentPage;
