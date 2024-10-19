import { useEffect, useState } from "react";
import Logo from "../Media/logo.png";
import Logout from "../Media/logout-rounded.png";

import { NavLink } from "react-router-dom";

import PropTypes from "prop-types";
import toast from "react-hot-toast";

function Navbar({ jwtToken }) {
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(jwtToken);
  }, [jwtToken]);

  return (
    <>
      <nav
        className="navbar navbar-expand-lg heightfix"
        style={{ borderBottom: " 1px solid #ccc" }}
      >
        <div className="container-fluid">
          {/* Logo aligned to the left */}
          <NavLink className="navbar-brand ms-4" to="/">
            <img
              src={Logo}
              alt="Logo"
              style={{ width: "44px", height: "50px" }}
            />
          </NavLink>

          {/* Navbar toggler for mobile view */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {/* Centered navigation links */}
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  className="nav-link heightfix d-flex align-items-center justify-content-center"
                  aria-current="page"
                  to="/customer"
                >
                  Customer
                </NavLink>
              </li>
              {token === "" ? (
                <li className="nav-item">
                  <NavLink
                    className="nav-link heightfix d-flex align-items-center justify-content-center"
                    to="/admin-login"
                  >
                    Admin
                  </NavLink>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link heightfix d-flex align-items-center justify-content-center"
                      to="/admin"
                    >
                      Packages
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link heightfix d-flex align-items-center justify-content-center"
                      to="/beds"
                    >
                      Beds
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link heightfix d-flex align-items-center justify-content-center"
                      to="/enroll"
                    >
                      Enrollment
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link heightfix d-flex align-items-center justify-content-center"
                      to="/redemption"
                    >
                      Redemption
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link heightfix d-flex align-items-center justify-content-center"
                      to="/tanning-history"
                    >
                      History
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link heightfix d-flex align-items-center justify-content-center"
                      to="/all-customers"
                    >
                      All Customers
                    </NavLink>
                  </li>
                </>
              )}
            </ul>

            {/* Logout button on the right */}
            {token !== "" ? (
              <form className="d-flex justify-content-center me-4">
                <button
                  className="btn btn-logout"
                  type="button"
                  onClick={() => {
                    window.sessionStorage.removeItem("jwtToken");
                    setToken("");
                    toast.success("Logout successful", {
                      duration: 2000,
                      position: "top-center",
                    });
                  }}
                >
                  {window.innerWidth <= 991 ? (
                    "Logout"
                  ) : (
                    <img
                      src={Logout}
                      alt="Logout"
                      style={{ width: "30px", height: "30px" }}
                    />
                  )}
                </button>
              </form>
            ) : (
              ""
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

Navbar.propTypes = {
  jwtToken: PropTypes.string, // `settoken` is a required function
};

export default Navbar;
