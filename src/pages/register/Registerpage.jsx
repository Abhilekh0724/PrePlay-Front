import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUserApi } from "../../api/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../../components/Logo";

const StarsBackground = React.memo(() => {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
      {/* Glowing Stars */}
      {[...Array(250)].map((_, i) => (
        <div
          key={`glow-${i}`}
          style={{
            position: "absolute",
            width: "3.5px",
            height: "3.5px",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "50%",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `glow 3s ${Math.random()}s infinite alternate ease-in-out`,
          }}
        />
      ))}

      {/* Shooting Stars */}
      {[...Array(10)].map((_, i) => (
        <div
          key={`shoot-${i}`}
          style={{
            position: "absolute",
            width: "1px",
            height: "80px",
            background: `linear-gradient(to bottom, 
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 1) 50%,
              rgba(255, 255, 255, 0) 100%)`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: 0.7,
            filter: "blur(0.5px)",
            transform: `rotate(${45 + Math.random() * 15}deg)`,
            animation: `shooting ${0.8 + Math.random() * 0.5}s ${Math.random() * 5}s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "-1px",
              width: "3px",
              height: "3px",
              backgroundColor: "rgba(255, 255, 255, 1)",
              borderRadius: "50%",
              boxShadow: "0 0 4px 2px rgba(255, 255, 255, 0.6)",
            }}
          />
        </div>
      ))}
      <style>
        {`
          @keyframes glow {
            0% {
              transform: scale(0.8);
              opacity: 1;
            }
            100% {
              transform: scale(1.2);
              opacity: 0.1;
            }
          }
          @keyframes shooting {
            0% {
              transform: translateX(0) translateY(0) rotate(45deg) scale(1);
              opacity: 0;
            }
            5% {
              opacity: 0.3;
            }
            40% {
              transform: translateX(-150px) translateY(150px) rotate(45deg) scale(1);
              opacity: 0.7;
            }
            60% {
              transform: translateX(-200px) translateY(200px) rotate(45deg) scale(0.8);
              opacity: 0.4;
            }
            100% {
              transform: translateX(-250px) translateY(250px) rotate(45deg) scale(0.5);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
});

const Registerpage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    try {
      const response = await registerUserApi({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword, // Ensure this is included
      });

      if (response.data.success) {
        toast.success("Registration successful! Redirecting to login...", {
          onClose: () => navigate("/login"),
        });
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glowing Stars and Shooting Stars */}
      <StarsBackground />

      {/* Register Form Container */}
      <div
        style={{
          backgroundColor: "rgba(26, 26, 26, 0.95)",
          padding: "40px",
          borderRadius: "15px",
          width: "100%",
          maxWidth: "400px",
          position: "relative",
          zIndex: 2,
          border: "1px solid rgba(0, 255, 0, 0.2)",
          boxShadow: "0 0 20px rgba(0, 255, 0, 0.1)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#00ff00",
          }}
        >
          <Logo width="200px" />
          <h2
            style={{
              marginTop: "15px",
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            Create Account
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* First Name Input */}
          <InputField
            icon={faUser}
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />

          {/* Last Name Input */}
          <InputField
            icon={faUser}
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />

          {/* Email Input */}
          <InputField
            icon={faEnvelope}
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          {/* Password Input */}
          <InputField
            icon={faLock}
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          {/* Confirm Password Input */}
          <InputField
            icon={faLock}
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#00ff00",
              color: "#000",
              border: "none",
              borderRadius: "25px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s ease",
              marginBottom: "20px",
            }}
          >
            REGISTER
          </button>

          <div style={{ textAlign: "center", color: "#999" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#00ff00",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
            >
              Login Now
            </Link>
          </div>
        </form>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

const InputField = ({ icon, ...props }) => (
  <div style={{ marginBottom: "20px" }}>
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
      }}
    >
      <FontAwesomeIcon
        icon={icon}
        style={{
          position: "absolute",
          left: "15px",
          color: "#00ff00",
        }}
      />
      <input
        {...props}
        style={{
          width: "100%",
          padding: "12px 20px 12px 45px",
          backgroundColor: "#0a0a0a",
          border: "1px solid #333",
          borderRadius: "25px",
          color: "#fff",
          fontSize: "16px",
          transition: "all 0.3s ease",
        }}
        required
      />
    </div>
  </div>
);

export default Registerpage;
