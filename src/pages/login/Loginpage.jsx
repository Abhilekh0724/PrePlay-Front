import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { loginUserApi } from "../../api/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";

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

      {/* Enhanced Shooting Stars */}
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
          {/* Head of shooting star */}
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

const Loginpage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUserApi({ email, password });
      if (response.data.success) {
        const { token, userData } = response.data;

        // Check if the user is an admin
        if (userData.isAdmin) {
          toast.success("Welcome, Admin!");
        } else {
          toast.success("Login successful!");
        }

        // Store token and user data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        window.dispatchEvent(new Event("userLogin"));

        // Redirect based on user type
        if (userData.isAdmin) {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
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

      {/* Login Form Container */}
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: "40px",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "400px",
          position: "relative",
          zIndex: 1,
          border: "1px solid rgba(0, 255, 0, 0.2)",
          boxShadow: "0 0 20px rgba(0, 255, 0, 0.1)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <h2
            style={{
              marginTop: "15px",
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            Login
          </h2>
        </div>

        <form onSubmit={handleLogin}>
          <InputField
            icon={faUser}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            icon={faLock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            LogIn
          </button>

          <div style={{ textAlign: "center", color: "#999" }}>
            New Player?{" "}
            <Link
              to="/register"
              style={{
                color: "#00ff00",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
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

export default Loginpage;
