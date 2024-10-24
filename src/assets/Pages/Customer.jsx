import { useState } from "react";
import InputMask from "react-input-mask";
import "../CSS/Customer.css";
import axios from "axios";
import toast from "react-hot-toast";

function Customer() {
  const [phone, setPhone] = useState("");
  const [customer, setCustomer] = useState(null);
  const [packages, setPackages] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://island-sun-tanning-backend-production.up.railway.app/api/v1/getCustomers",
        {
          phone,
        }
      );
      const data = await axios.get(
        "https://island-sun-tanning-backend-production.up.railway.app/api/v1/getPackages"
      );
      setPackages(data.data.data.Packages);

      if (response.data.data.currentCustomer) {
        setCustomer(response.data.data.currentCustomer); // Accessing customer data properly
        toast.success("Customer Founded", {
          duration: 2000,
          position: "top-center",
        });
      } else {
        toast.error("No customer found.", {
          duration: 2000,
          position: "top-center",
        });
        setCustomer(null);
      }
    } catch (error) {
      console.error("Error fetching customer:", error); // Log error
      alert("Error Happen");
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysLeft = (expirationDate) => {
    const today = new Date();
    const expiration = new Date(expirationDate);
    const timeDifference = expiration.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if (daysLeft > 0) {
      return `${daysLeft} day(s) left until expiration`;
    } else if (daysLeft === 0) {
      return "Package expires today";
    } else {
      return "Package expired";
    }
  };

  const packageDetails = (pkgID) => {
    const packageDetails = packages.find((pkg) => pkg._id === pkgID);
    return packageDetails;
  };

  return (
    <>
      <div className="customer-screen-container">
        <h2 className="screen-title">Check Your Packages</h2>
        <form onSubmit={handleSearch} className="search-form">
          <InputMask
            mask="0399-9999999"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="form-input mb-3"
            placeholder="Enter your phone number"
            required
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        {customer && (
          <div className="customer-info">
            <h3 className="customer-found">Customer Found: {customer.name}</h3>
            <h4 className="packages-title">Your Packages</h4>
            {customer?.packages?.length > 0 ? (
              customer.packages.map((pkg) => {
                return (
                  <div key={pkg._id || Math.random()} className="package-card">
                    {pkg.packageId ? (
                      <>
                        <h4 className="package-title">
                          Package Name:{" "}
                          {packageDetails(pkg.packageId).name || "N/A"}
                        </h4>
                        <p className="package-details">
                          Remaining Redemptions:{" "}
                          {packageDetails(pkg.packageId).isUnlimited
                            ? "Unlimited"
                            : pkg.remainingRedemptions}
                        </p>
                        <p className="package-expiration">
                          Expiration Date:{" "}
                          {pkg.expiration
                            ? calculateDaysLeft(pkg.expiration)
                            : "No expiration"}
                        </p>
                        <p className="package-assigned">
                          Assigned on:{" "}
                          {pkg.assignedDate
                            ? new Date(pkg.assignedDate).toLocaleDateString()
                            : "Unknown"}
                        </p>
                      </>
                    ) : (
                      <p>Package information not available</p>
                    )}
                  </div>
                );
              })
            ) : (
              <p>No packages found for this customer.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Customer;
