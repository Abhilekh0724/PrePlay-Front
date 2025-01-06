import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUserApi } from "../../api/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../../components/Logo";

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
