import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../CSS/AuthForms.css"; // Import the shared CSS
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const { Token } = useParams(); // Get token from URL
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://island-sun-tanning-back-end-4xb6.vercel.app/api/v1/admin/reset-password",
        {
          password,
          Token,
        }
      );
      setMessage(response.data.message);
      toast.success(response.data.message, {
        duration: 2000,
        position: "top-center",
      });
      setError("");
    } catch (error) {
      if (error) {
        setError("Error resetting password");
        setMessage("");
      }
    }
  };

  const handleNavigateToLogin = () => {
    navigate("/admin-login");
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Reset Password</h2>
      {message && <p className="message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group">
          <label htmlFor="password">New Password:</label>
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
        <button type="submit" className="submit-button">
          Reset Password
        </button>
      </form>
      <p className="forgot-password-text">
        Remembered your password?{" "}
        <span onClick={handleNavigateToLogin} className="reset-link">
          Login now
        </span>
      </p>
    </div>
  );
};

export default ResetPassword;
