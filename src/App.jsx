import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import "./App.css";

import Navbar from "./assets/Components/Navbar.jsx";
import Customer from "./assets/Pages/Customer.jsx";
import Login from "./assets/Pages/Login.jsx";
import Enrollment from "./assets/Pages/Enrollment.jsx";
import AdminDashboard from "./assets/Pages/AdminDashboard.jsx";
import ForgotPassword from "./assets/Pages/ForgetPassword.jsx";
import ResetPassword from "./assets/Pages/ResetPassword.jsx";
import BedDashboard from "./assets/Pages/BedDashboard.jsx";

function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const jwt = window.sessionStorage.getItem("jwtToken") || "";
    setToken(jwt);
  }, []);

  return (
    <>
      <Toaster />

      <BrowserRouter>
        <Navbar jwtToken={token} />
        <Routes>
          <Route path="/" element={<Customer />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/admin-login" element={<Login setToken={setToken} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:Token" element={<ResetPassword />} />

          {token === "" ? (
            ""
          ) : (
            <>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/beds" element={<BedDashboard />} />
              <Route path="/enroll" element={<Enrollment />} />
              <Route path="/redemption" element={<Customer />} />
              <Route path="/tanning-history" element={<Customer />} />
              <Route path="/all-customers" element={<Customer />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
