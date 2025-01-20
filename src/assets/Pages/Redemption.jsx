import { useState, useEffect, useRef } from "react";

import InputMask from "react-input-mask";
import "../CSS/Redemption.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

import PropTypes from "prop-types";
import ConsentForm from "../Components/consentForm";
import calculateExpirationDate from "../Components/expirationDate";
import { FaTrash } from "react-icons/fa";

function Redemption({ setProgress }) {
  const [phone, setPhone] = useState("");
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [availableBeds, setAvailableBeds] = useState([]);
  const [selectedBed, setSelectedBed] = useState(null);
  const [isConsentChecked, setIsConsentChecked] = useState(false);

  const [consentSignature, setConsentSignature] = useState("");
  const [packages, setPackages] = useState([]); // To fetch and store all available packages
  const [allBeds, setAllBeds] = useState([]);
  const [assignPackageMode, setAssignPackageMode] = useState(false); // Control for assigning new package
  const navigate = useNavigate(); // Initialize useNavigate hook
  const sigCanvasRef = useRef(null); // Reference to signature canvas

  // Clear the signature pad
  const clearSignature = () => {
    sigCanvasRef.current.clear();
    setConsentSignature("");
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://island-sun-tanning-back-end-4xb6.vercel.app/api/v1/getCustomers",
        {
          phone,
        }
      );

      if (response.data.data.currentCustomer) {
        setCustomer(response.data.data.currentCustomer);
        setAssignPackageMode(false); // Reset assign package mode
        setSelectedPackage(null);
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
      const data = await axios.get(
        "https://island-sun-tanning-back-end-4xb6.vercel.app/api/v1/getPackages"
      );
      setPackages(data.data.data.Packages);

      const Beds = await axios.get(
        `https://island-sun-tanning-back-end-4xb6.vercel.app/api/v1/getallbeds`
      );

      setAllBeds(Beds.data.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setProgress(100);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handlePackageSelection = async (packageId) => {
    setSelectedPackage(packageId);
    try {
      const beds = await axios.get(
        `https://island-sun-tanning-back-end-4xb6.vercel.app/api/v1/getbeds/${packageId}`
      );

      setAvailableBeds(beds.data.data);
    } catch (error) {
      console.error("Error fetching beds", error);
    }
  };

  const handleAssignPackage = async (e) => {
    e.preventDefault();
    try {
      const packageDetails = packages.find(
        (pkg) => pkg._id === selectedPackage
      );

      let expiration = "";

      if (packageDetails.isUnlimited) {
        expiration = calculateExpirationDate(
          packageDetails.duration,
          packageDetails.durationUnit
        );
      } else {
        expiration = null;
      }

      await axios.post(
        `https://island-sun-tanning-back-end-4xb6.vercel.app/api/v1/updateCustomerPackage/${customer._id}`,
        {
          selectedPackage,
          status: packageDetails.status,
          remainingRedemptions: packageDetails.redemptions,
          expiration,
        }
      );

      // await assignPackageToCustomer(customer._id, selectedPackage);
      toast.success("Package assigned successfully", {
        duration: 2000,
        position: "top-center",
      });

      setAssignPackageMode(false);
      setSelectedPackage(null);

      // Refresh customer data to include the newly assigned package
      await handleSearch();
    } catch (error) {
      toast.success("Failed to assign package", {
        duration: 2000,
        position: "top-center",
      });
      console.error("Error assigning package", error);
    }
  };

  // Categorize customer packages into different groups
  const categorizePackages = (packages) => {
    const unusedPackages = [];
    const inProgressPackages = [];
    const expiredOrUsedPackages = [];

    packages.forEach((pkg) => {
      const { status, expiration } = pkg;

      const isExpiredByDate = expiration && new Date(expiration) < new Date();

      if (status === "expired" || isExpiredByDate) {
        expiredOrUsedPackages.push(pkg);
      } else if (status === "unused" || status === "active") {
        unusedPackages.push(pkg);
      } else {
        inProgressPackages.push(pkg);
      }
    });

    return { unusedPackages, inProgressPackages, expiredOrUsedPackages };
  };

  const packageDetails = (pkgID) => {
    const packageDetails = packages.find((pkg) => pkg._id === pkgID);
    return packageDetails;
  };

  const bedDetails = (bedID) => {
    const beddetails = allBeds.find((findbed) => findbed._id === bedID);
    return beddetails;
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
                      onChange={() => handlePackageSelection(pkg.packageId)}
                      checked={selectedPackage === pkg.packageId}
                    />
                    <label htmlFor={pkg.packageId}>
                      {packageDetails(pkg.packageId)?.name} (
                      {packageDetails(pkg.packageId)?.isUnlimited
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
                      id={pkg.packageId}
                      name="package"
                      value={pkg.packageId}
                      onChange={() => handlePackageSelection(pkg.packageId)}
                      checked={selectedPackage === pkg.packageId}
                    />
                    <label htmlFor={pkg.packageId}>
                      {packageDetails(pkg.packageId)?.name} (
                      {packageDetails(pkg.packageId)?.isUnlimited
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
                    <label htmlFor={pkg.packageId}>
                      {packageDetails(pkg.packageId)?.name} (Expired or Used -
                      Assigned on{" "}
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

  const renderBeds = () => {
    if (selectedPackage && availableBeds.length > 0) {
      return (
        <div className="beds-section">
          <h4>Select a Bed</h4>
          {availableBeds.map((bed) => (
            <div key={bed._id} className="bed-option">
              <input
                type="radio"
                id={bed._id}
                name="bed"
                value={bed._id}
                onChange={() => setSelectedBed(bed._id)}
                checked={selectedBed === bed._id}
              />
              <label htmlFor={bed._id}>{bed.name}</label>
            </div>
          ))}
        </div>
      );
    }
    return selectedPackage ? <p>No beds available for this package</p> : null;
  };

  // Handle the punch redemption
  const handlePunchRedemption = async (e) => {
    e.preventDefault();

    if (!isConsentChecked || !consentSignature) {
      toast.error("You must acknowledge the consent and provide a signature.", {
        duration: 2000,
        position: "top-center",
      });
      return;
    }

    try {
      await axios.post(
        "https://island-sun-tanning-back-end-4xb6.vercel.app/api/v1/redemptions",
        {
          customerId: customer._id,
          packageId: selectedPackage,
          bedId: selectedBed,
          consentSignature,
        }
      );

      toast.success("Redemption punched successfully", {
        duration: 2000,
        position: "top-center",
      });

      setSelectedPackage(null);
      setSelectedBed(null);
      clearSignature(); // Clear signature after submission
      setIsConsentChecked(false);

      // Refresh customer data to update punch history
      await handleSearch();
    } catch (error) {
      toast.error("Failed to punch redemption", {
        duration: 2000,
        position: "top-center",
      });
      console.error("Punch Redemption Error", error);
    }
  };

  // Handle revert punch
  const handleRevertPunch = async (punchId, packageId) => {
    try {
      await axios.post(
        "https://island-sun-tanning-back-end-4xb6.vercel.app/api/v1/revertRedemptions",
        {
          customerId: customer._id,
          packageId,
          punchId,
        }
      );

      // Refresh customer data after revert
      await handleSearch();
    } catch (error) {
      alert("Failed to revert punch");
      console.error("Revert Redemption Error", error);
    }
  };

  // Render punch history
  const renderPunchHistory = () => {
    if (
      !customer ||
      !customer.punchHistory ||
      customer.punchHistory.length === 0
    ) {
      return <p>No punch history available</p>;
    }

    return (
      <div className="punch-history-section">
        <h4>Punch History</h4>
        <ul className="punch-history-list">
          {customer.punchHistory.map((punch) => (
            <li key={punch._id} className="punch-history-item">
              <span>
                {`Punch on ${new Date(punch.date).toLocaleString()} - Bed: ${
                  bedDetails(punch.bedId)?.name
                } - Package: ${packageDetails(punch.packageId)?.name}`}
              </span>
              <button
                className="delete-button"
                onClick={() => handleRevertPunch(punch._id, punch.packageId)}
              >
                <FaTrash className="delete-icon" />
                {/* Font Awesome delete icon */}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
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

          <div>{renderBeds()}</div>
          {selectedBed && (
            <ConsentForm
              isConsentChecked={isConsentChecked}
              setIsConsentChecked={setIsConsentChecked}
              setConsentSignature={setConsentSignature}
              clearSignature={clearSignature}
              sigCanvasRef={sigCanvasRef}
            />
          )}
          {selectedBed && isConsentChecked && consentSignature && (
            <button
              className="punch-button"
              onClick={handlePunchRedemption}
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
          <form onSubmit={handleAssignPackage}>
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

      {customer && renderPunchHistory()}
    </div>
  );
}

Redemption.propTypes = {
  setProgress: PropTypes.func.isRequired,
};

export default Redemption;
