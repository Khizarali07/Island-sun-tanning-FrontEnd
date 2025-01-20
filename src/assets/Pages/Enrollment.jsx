import { useState, useEffect } from "react";

import "../CSS/EnrollmentForm.css"; // Link to the custom CSS
import InputMask from "react-input-mask"; // Import the input mask
import axios from "axios";
import toast from "react-hot-toast";
import calculateExpirationDate from "../Components/expirationDate";

import PropTypes from "prop-types";

const EnrollmentForm = ({ setProgress }) => {
  const [phone, setPhone] = useState("");
  const [customer, setCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [selectedPackage, setSelectedPackage] = useState("");
  const [packages, setPackages] = useState([]); // State to store packages

  // Fetch the latest packages on component mount and after package changes
  const fetchPackages = async () => {
    setProgress(0);
    try {
      const latestPackages = await axios.get(
        "https://island-sun-tanning-back-end-4xb6.vercel.app/api/v1/getPackages"
      );
      setPackages(latestPackages.data.data.Packages);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setProgress(100);
    }
  };

  useEffect(() => {
    fetchPackages(); // Fetch packages when component mounts
  }, []);

  // Search customer by phone number
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await await axios.post(
        "https://island-sun-tanning-back-end-4xb6.vercel.app/api/v1/getCustomers",
        {
          phone,
        }
      );

      if (response.data.data.currentCustomer) {
        setCustomer(response.data.data.currentCustomer); // Set the customer data
        setNewCustomer({
          name: response.data.data.currentCustomer.name,
          phone: response.data.data.currentCustomer.phone,
          email: response.data.data.currentCustomer.email,
        });

        toast.success(
          "Customer found! You can now edit details or assign a new package.",
          {
            duration: 2000,
            position: "top-center",
          }
        );
      } else {
        toast.error("No customer found. You can enroll a new customer.", {
          duration: 2000,
          position: "top-center",
        });
        setCustomer(null);
        setNewCustomer({
          name: "",
          phone,
          email: "",
        });
      }
    } catch (error) {
      console.error("Error searching customer", error);
      toast.error("No customer found. You can enroll a new customer.", {
        duration: 2000,
        position: "top-center",
      });
    }
  };

  // Enroll a new customer
  const handleEnroll = async (e) => {
    e.preventDefault();
    try {
      const packageDetails = packages.find(
        (pkg) => pkg._id === selectedPackage
      );

      let expiration = null;

      // Calculate expiration based on custom duration and unit
      if (
        packageDetails &&
        packageDetails.isUnlimited &&
        packageDetails.duration &&
        packageDetails.durationUnit
      ) {
        const now = new Date();
        if (packageDetails.durationUnit === "days") {
          expiration = new Date(
            now.setDate(now.getDate() + packageDetails.duration)
          );
        } else if (packageDetails.durationUnit === "weeks") {
          expiration = new Date(
            now.setDate(now.getDate() + packageDetails.duration * 7)
          );
        } else if (packageDetails.durationUnit === "months") {
          expiration = new Date(
            now.setMonth(now.getMonth() + packageDetails.duration)
          );
        }
      }

      const customerData = {
        ...newCustomer,
        packages: [
          {
            packageId: selectedPackage,
            remainingRedemptions: packageDetails.redemptions,
            expiration,
            status: expiration === null ? "active" : "redeemed", // Status indicating new package assignment
          },
        ],
      };

      await axios.post(
        "https://island-sun-tanning-back-end-4xb6.vercel.app/api/v1/customers",
        {
          customerData,
        }
      );

      toast.success("Customer enrolled successfully", {
        duration: 2000,
        position: "top-center",
      });

      // Reset the form fields
      setCustomer(null);
      setPhone("");
      setNewCustomer({ name: "", phone: "", email: "" });
      setSelectedPackage("");
      fetchPackages();
    } catch (error) {
      console.error("Error enrolling customer:", error);
      if (error) {
        toast.error(
          "This customer is already enrolled and exists in the system.",
          {
            duration: 2000,
            position: "top-center",
          }
        );
      }
    }
  };

  // Assign a package to the customer
  const handleAssignPackage = async (e) => {
    e.preventDefault();
    try {
      const packageDetails = packages.find(
        (pkg) => pkg._id === selectedPackage
      );

      const { redemptions, status } = packageDetails;

      if (packageDetails.isUnlimited) {
        const expiration = calculateExpirationDate(
          packageDetails.duration,
          packageDetails.durationUnit
        );

        await axios.post(
          `https://island-sun-tanning-back-end-4xb6.vercel.app/api/v1/updateCustomerPackage/${customer._id}`,
          {
            selectedPackage,
            status: "redeemed",
            remainingRedemptions: redemptions,
            expiration,
          }
        );
      } else {
        const redemptions = packageDetails.redemptions;
        await axios.post(
          `https://island-sun-tanning-back-end-4xb6.vercel.app/api/v1/updateCustomerPackage/${customer._id}`,
          {
            selectedPackage,
            status,
            remainingRedemptions: redemptions,
          }
        );
      }

      const updatedCustomer = await axios.post(
        "https://island-sun-tanning-back-end-4xb6.vercel.app/api/v1/getCustomers",
        {
          phone,
        }
      );

      setCustomer(updatedCustomer.data.data.currentCustomer); // Accessing updated customer data

      toast.success("Package assigned successfully", {
        duration: 2000,
        position: "top-center",
      });
      setSelectedPackage("");
    } catch (error) {
      console.error("Error assigning package", error);
      toast.error("Failed to assign package", {
        duration: 2000,
        position: "top-center",
      });
    }
  };

  // Update customer details
  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    try {
      const updatedCustomer = await axios.post(
        `https://island-sun-tanning-back-end-4xb6.vercel.app/api/v1/updateCustomer/${customer._id}`,
        newCustomer
      );

      setCustomer(updatedCustomer);
      toast.success("Customer details updated successfully", {
        duration: 2000,
        position: "top-center",
      });

      // Reset the form fields
      setCustomer(null);
      setPhone("");
      setNewCustomer({ name: "", phone: "", email: "" });
      setSelectedPackage("");
    } catch (error) {
      console.error("Error updating customer", error);
      toast.success("Failed to update customer", {
        duration: 2000,
        position: "top-center",
      });
    }
  };

  // // Delete customer
  const handleDeleteCustomer = async () => {
    try {
      if (window.confirm("Are you sure you want to delete this customer?")) {
        await axios.delete(
          `https://island-sun-tanning-back-end-4xb6.vercel.app/api/v1/deleteCustomer/${customer._id}`
        );
        toast.success("Customer deleted successfully", {
          duration: 2000,
          position: "top-center",
        });

        setCustomer(null);
        setPhone("");
        setNewCustomer({ name: "", phone: "", email: "" });
      }
    } catch (error) {
      console.error("Error deleting customer", error);
      toast.error("Failed to delete customer", {
        duration: 2000,
        position: "top-center",
      });
    }
  };

  // // Delete a package from the customer's list
  const handleDeletePackage = async (packageId) => {
    try {
      if (
        window.confirm(
          "Are you sure you want to remove this package from the customer?"
        )
      ) {
        await axios.post(
          `https://island-sun-tanning-back-end-4xb6.vercel.app/api/v1/deleteCustomerPackage/${customer._id}`,
          { packageId }
        );

        // Update the customer state by filtering out the deleted package
        const updatedPackages = customer.packages.filter(
          (pkg) => pkg.packageId !== packageId
        );
        setCustomer({ ...customer, packages: updatedPackages });

        toast.success("Package removed successfully", {
          duration: 2000,
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error deleting package", error);
      toast.error("Failed to delete package", {
        duration: 2000,
        position: "top-center",
      });
    }
  };

  // // Render package status (active, expired, fully redeemed)
  const renderPackageStatus = (pkg) => {
    const currentDate = new Date();
    if (pkg.status === "active") return "New Package";
    if (pkg.packageId.isUnlimited) return "Active Package";
    if (pkg.remainingRedemptions === 0 && pkg.expiration === null)
      return "Fully Redeemed";
    if (pkg.expiration && new Date(pkg.expiration) < currentDate)
      return "Expired";
    return "Active Package";
  };

  return (
    <div className="enrollment-form-container">
      <div className="search-bar-container">
        <form onSubmit={handleSearch}>
          <InputMask
            type="text"
            mask="0399-9999999" // Mask to enforce the phone format
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter existing customer phone number"
            className="search-input"
            required
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>

      <div className="enrollment-form-body">
        <div className="left-section">
          <h3 className="section-title">Customer Details</h3>
        </div>

        <div className="right-section">
          {customer ? (
            <div>
              <h3>Customer Found: {customer.name}</h3>
              <form onSubmit={handleUpdateCustomer}>
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={newCustomer.name}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, name: e.target.value })
                  }
                  className="form-input"
                  required
                />
                <input
                  type="email"
                  placeholder="Customer Email"
                  value={newCustomer.email}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, email: e.target.value })
                  }
                  className="form-input"
                />
                <InputMask
                  type="text"
                  mask="0399-9999999"
                  value={newCustomer.phone}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, phone: e.target.value })
                  }
                  className="form-input"
                  placeholder="Customer Phone"
                  required
                />
                <button type="submit" className="form-button">
                  Update Customer
                </button>
                <button
                  type="button"
                  className="form-button2"
                  onClick={handleDeleteCustomer}
                >
                  Delete Customer
                </button>
              </form>

              <h3 className="section-title">Assigned Packages</h3>
              <div className="assigned-packages">
                {customer.packages && customer.packages.length > 0 ? (
                  customer.packages.map((pkg) => (
                    <div key={pkg._id} className="package-card1">
                      <div className="package-details1">
                        <span className="package-name1">
                          {pkg.packageId.name}
                        </span>
                        <span className="package-status">
                          {renderPackageStatus(pkg)}
                        </span>
                        <span className="package-redemptions1">
                          {pkg.packageId.isUnlimited
                            ? "Unlimited Redemptions"
                            : `${pkg.remainingRedemptions} Redemptions`}
                        </span>
                        <span className="package-expiration1">
                          {pkg.expiration
                            ? `Expires: ${new Date(
                                pkg.expiration
                              ).toLocaleDateString()}`
                            : "No Expiration"}
                        </span>
                        <span className="package-expiration1">
                          Assigned on:{" "}
                          {new Date(pkg.assignedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeletePackage(pkg.packageId)}
                        className="delete-package-button"
                      >
                        <img
                          src="https://img.icons8.com/ios-glyphs/30/000000/trash--v1.png"
                          alt="Delete"
                          className="delete-icon"
                        />
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No packages assigned to this customer.</p>
                )}
              </div>

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
          ) : (
            <form onSubmit={handleEnroll}>
              <input
                type="text"
                placeholder="Customer Name"
                value={newCustomer.name}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, name: e.target.value })
                }
                className="form-input"
                required
              />
              <input
                type="email"
                placeholder="Customer Email"
                value={newCustomer.email}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, email: e.target.value })
                }
                className="form-input"
              />
              <InputMask
                type="text"
                mask="0399-9999999"
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, phone: e.target.value })
                }
                className="form-input"
                placeholder="Customer Phone"
                required
              />
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
                Enroll Customer
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

EnrollmentForm.propTypes = {
  setProgress: PropTypes.func.isRequired,
};

export default EnrollmentForm;
