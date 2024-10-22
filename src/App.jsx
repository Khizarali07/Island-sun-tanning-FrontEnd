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
import AllCustomersPage from "./assets/Pages/AllCustomers.jsx";
import EditCustomer from "./assets/Components/editCustomer.jsx";
import LoadingBar from "react-top-loading-bar";
import TanningHistory from "./assets/Pages/TanningHistory.jsx";
import Redemption from "./assets/Pages/Redemption.jsx";

function App() {
  const [token, setToken] = useState("");
  const [loadingbar, setloadingbar] = useState(0);

  const setProgress = (prog) => {
    setloadingbar(prog);
  };

  useEffect(() => {
    const jwt = window.sessionStorage.getItem("jwtToken") || "";
    setToken(jwt);
  }, []);

  return (
    <>
      <Toaster />

      <BrowserRouter>
        <Navbar jwtToken={token} />
        <LoadingBar height={5} color="#ffffff" progress={loadingbar} />
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
              <Route
                path="/admin"
                element={<AdminDashboard setProgress={setProgress} />}
              />
              <Route
                path="/beds"
                element={<BedDashboard setProgress={setProgress} />}
              />
              <Route
                path="/enroll"
                element={<Enrollment setProgress={setProgress} />}
              />
              <Route
                path="/redemption"
                element={<Redemption setProgress={setProgress} />}
              />
              <Route
                path="/tanning-history"
                element={<TanningHistory setProgress={setProgress} />}
              />
              <Route
                path="/all-customers"
                element={<AllCustomersPage setProgress={setProgress} />}
              />
              <Route
                path="/edit-customer/:id"
                element={<EditCustomer setProgress={setProgress} />}
              />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
