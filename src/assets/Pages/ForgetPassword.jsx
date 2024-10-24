import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../CSS/AuthForms.css"; // Import the shared CSS
import axios from "axios";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const handleNavigateToLogin = () => {
    navigate("/admin-login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //   const response = await forgotPassword(email);
    const response = await axios.post(
      "http://island-sun-tanning-backend-production.up.railway.app/api/v1/admin/forgot-password",
      { email }
    );

    if (response.data.status === "success") {
      setMessage(response.data.message);
      toast.success(response.data.message, {
        duration: 2000,
        position: "top-center",
      });
      setError("");
    } else {
      setError("Error sending reset email, enter correct email");
      setMessage("");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Forgot Password</h2>
      {message && <p className="message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
            placeholder="Enter your email"
          />
        </div>
        <button type="submit" className="submit-button">
          Send Reset Link
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

export default ForgotPassword;
