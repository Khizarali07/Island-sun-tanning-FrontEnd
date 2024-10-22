import { useState, useRef, useEffect } from "react";
// import SignatureCanvas from "react-signature-canvas"; // Signature pad for capturing touch signatures

import InputMask from "react-input-mask";
import "../CSS/Redemption.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

import PropTypes from "prop-types";

function Redemption({ setProgress }) {
  const [phone, setPhone] = useState("");
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  //   const [availableBeds, setAvailableBeds] = useState([]);
  const [selectedBed, setSelectedBed] = useState(null);
  const [isConsentChecked, setIsConsentChecked] = useState(false);
  //   const sigCanvasRef = useRef(null); // Reference to signature canvas
  const [consentSignature, setConsentSignature] = useState("");
  const [packages, setPackages] = useState([]); // To fetch and store all available packages
  const [assignPackageMode, setAssignPackageMode] = useState(false); // Control for assigning new package
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:3000/api/v1/getCustomers",
        {
          phone,
        }
      );
      console.log(response.data.data.currentCustomer);

      if (response.data.data.currentCustomer) {
        setCustomer(response.data.data.currentCustomer);
        setAssignPackageMode(false); // Reset assign package mode
        setSelectedPackage(null);
        toast.success("Customer Founded", {
          duration: 2000,
          position: "top-center",
        });
      } else {
        setCustomer(null);
        toast.error("No customer found. You can enroll a new customer.", {
          duration: 2000,
          position: "top-center",
        });
        navigate("/enroll");
      }
    } catch (error) {
      console.error("Error searching customer:", error);
      toast.error("No customer found. You can enroll a new customer.", {
        duration: 2000,
        position: "top-center",
      });
      navigate("/enroll");
    } finally {
      setLoading(false);
    }
  };

  // Fetch available packages for assigning new ones
  const fetchPackages = async () => {
    setProgress(0);
    try {
      const data = await axios.get("http://127.0.0.1:3000/api/v1/getPackages");
      setPackages(data.data.data.Packages);
      console.log(data.data.data.Packages);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setProgress(100);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Categorize customer packages into different groups
  const categorizePackages = (packages) => {
    const unusedPackages = [];
    const inProgressPackages = [];
    const expiredOrUsedPackages = [];

    packages.forEach((pkg) => {
      const { remainingRedemptions, packageId, status } = pkg;

      if (status === "expired" || remainingRedemptions === 0) {
        expiredOrUsedPackages.push(pkg);
      } else if (
        status === "unused" &&
        remainingRedemptions === packageId.redemptions
      ) {
        unusedPackages.push(pkg);
      } else {
        inProgressPackages.push(pkg);
      }
    });

    return { unusedPackages, inProgressPackages, expiredOrUsedPackages };
  };

  const renderPackages = () => {
    if (customer) {
      if (customer.packages && customer.packages.length > 0) {
        const { unusedPackages, inProgressPackages, expiredOrUsedPackages } =
          categorizePackages(customer.packages);

        if (unusedPackages.length === 0 && inProgressPackages.length === 0) {
          // No valid packages, show option to assign a new package
          return (
            <div className="no-packages-section">
              <p>No valid packages available. Please assign a new package.</p>
              <button onClick={() => setAssignPackageMode(true)}>
                Assign New Package
              </button>
            </div>
          );
        }

        return (
          <div className="packages-section">
            <h4>Select a Package</h4>

            {unusedPackages.length > 0 && (
              <>
                <h5>Unused Packages</h5>
                {unusedPackages.map((pkg) => (
                  <div key={pkg._id} className="package-option">
                    <input
                      type="radio"
                      id={pkg.packageId._id}
                      name="package"
                      value={pkg.packageId._id}
                      // onChange={() => handlePackageSelection(pkg.packageId._id)}
                      checked={selectedPackage === pkg.packageId._id}
                    />
                    <label htmlFor={pkg.packageId._id}>
                      {pkg.packageId.name} (
                      {pkg.packageId.isUnlimited
                        ? "Unlimited redemptions"
                        : `${pkg.remainingRedemptions} redemption(s)`}{" "}
                      - Assigned on{" "}
                      {new Date(pkg.assignedDate).toLocaleDateString()})
                    </label>
                  </div>
                ))}
              </>
            )}

            {inProgressPackages.length > 0 && (
              <>
                <h5>In Progress Packages</h5>
                {inProgressPackages.map((pkg) => (
                  <div key={pkg._id} className="package-option">
                    <input
                      type="radio"
                      id={pkg.packageId._id}
                      name="package"
                      value={pkg.packageId._id}
                      // onChange={() => handlePackageSelection(pkg.packageId._id)}
                      checked={selectedPackage === pkg.packageId._id}
                    />
                    <label htmlFor={pkg.packageId._id}>
                      {pkg.packageId.name} (
                      {pkg.packageId.isUnlimited
                        ? "Unlimited redemptions"
                        : `${pkg.remainingRedemptions} redemption(s)`}{" "}
                      - Assigned on{" "}
                      {new Date(pkg.assignedDate).toLocaleDateString()})
                    </label>
                  </div>
                ))}
              </>
            )}

            {expiredOrUsedPackages.length > 0 && (
              <>
                <h5>Expired or Used Packages</h5>
                {expiredOrUsedPackages.map((pkg) => (
                  <div key={pkg._id} className="package-option disabled">
                    <label htmlFor={pkg.packageId._id}>
                      {pkg.packageId.name} (Expired or Used - Assigned on{" "}
                      {new Date(pkg.assignedDate).toLocaleDateString()})
                    </label>
                  </div>
                ))}
              </>
            )}
          </div>
        );
      } else {
        // Customer has no packages, show option to assign a new package
        return (
          <div className="no-packages-section">
            <p>No packages available. Please assign a new package.</p>
            <button onClick={() => setAssignPackageMode(true)}>
              Assign New Package
            </button>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="redemption-container">
      <h2 className="redemption-title">Search Customer for Redemption</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="search-form"
      >
        <InputMask
          type="text"
          mask="0399-9999999"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="search-input"
          placeholder="Enter Phone Number"
          required
        />
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {customer && !assignPackageMode && (
        <div className="customer-info">
          <div className="customer-details">
            <h3>Customer Details</h3>
            <p>
              <strong>Name:</strong> {customer.name}
            </p>
            <p>
              <strong>Email:</strong> {customer.email}
            </p>
            <p>
              <strong>Phone:</strong> {customer.phone}
            </p>
          </div>

          <div className="package-bed-selection">{renderPackages()}</div>

          <div>{/* {renderBeds()} */}</div>
          {/* {selectedBed && renderConsentForm()} */}
          {selectedBed && isConsentChecked && consentSignature && (
            <button
              className="punch-button"
              //   onClick={handlePunchRedemption}
              disabled={!isConsentChecked || !consentSignature}
            >
              Punch Redemption
            </button>
          )}
        </div>
      )}

      {assignPackageMode && (
        <div className="assign-package-section">
          <h3>Assign New Package</h3>
          <form
          //   onSubmit={handleAssignPackage}
          >
            <select
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              className="form-input"
              required
            >
              <option value="">Select Package</option>
              {packages.map((pack) => (
                <option key={pack._id} value={pack._id}>
                  {pack.name}
                </option>
              ))}
            </select>
            <button type="submit" className="form-button">
              Assign Package
            </button>
          </form>
        </div>
      )}

      {/* {customer && renderPunchHistory()} */}
    </div>
  );
}

Redemption.propTypes = {
  setProgress: PropTypes.func.isRequired,
};

export default Redemption;
