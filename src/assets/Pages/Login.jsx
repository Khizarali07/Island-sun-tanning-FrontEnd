import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/Login.css";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-hot-toast";

import PropTypes from "prop-types";

function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post(
      "http://island-sun-tanning-backend-production.up.railway.app/api/v1/login",
      {
        username,
        password,
      }
    );

    // Store the token in session as jwt token
    if (response.data.status) {
      window.sessionStorage.setItem("jwtToken", response.data.token);
      setToken(response.data.token);

      toast.success("Login successful", {
        duration: 2000,
        position: "top-center",
      });
      navigate("/admin");
    } else {
      setError("Invalid username or password");
      toast.error(response.data.message, {
        duration: 2000,
        position: "top-center",
      });
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <>
      <div className="admin-login-container">
        <h2 className="admin-login-title">Admin Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="input-group">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              required
              placeholder="Enter your username"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <div className="input-group">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input form-control"
                required
                placeholder="Enter your password"
              />
              <span
                className="input-group-text"
                onClick={togglePasswordVisibility}
                style={{
                  height: "3.18rem",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 10px",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <p className="forgot-password-text">
          Forgot your password?{" "}
          <span onClick={handleForgotPassword} className="reset-link">
            Reset now
          </span>
        </p>
      </div>
    </>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired, // `settoken` is a required function
};

export default Login;
