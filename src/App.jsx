import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";

import Customer from "./assets/Pages/Customer.jsx";
import Navbar from "./assets/Components/Navbar.jsx";
import Login from "./assets/Pages/Login.jsx";
import { useEffect, useState } from "react";
import Enrollment from "./assets/Pages/Enrollment.jsx";
import Packages from "./assets/Pages/Packages.jsx";

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

          {token === "" ? (
            ""
          ) : (
            <>
              <Route path="/admin" element={<Packages />} />
              <Route path="/beds" element={<Customer />} />
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
