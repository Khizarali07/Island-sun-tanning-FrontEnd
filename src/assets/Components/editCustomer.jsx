import "../CSS/EnrollmentForm.css"; // Link to the custom CSS
import InputMask from "react-input-mask"; // Import the input mask
import axios from "axios";
import toast from "react-hot-toast";
import calculateExpirationDate from "../Components/expirationDate";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function EditCustomer() {
  const { id } = useParams();
  const [customer, setCustomer] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [selectedPackage, setSelectedPackage] = useState("");
  const [packages, setPackages] = useState([]); // State to store packages

  // Fetch the latest packages on component mount and after package changes
  const fetchingData = async () => {
    try {
      const latestPackages = await axios.get(
        "http://island-sun-tanning-backend-production.up.railway.app/api/v1/getPackages"
      );
      setPackages(latestPackages.data.data.Packages);

      const updatedCustomer = await axios.post(
        "http://island-sun-tanning-backend-production.up.railway.app/api/v1/getCustomers",
        {
          _id: id,
        }
      );

      setCustomer(updatedCustomer.data.data.currentCustomer);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  useEffect(() => {
    fetchingData(); // Fetch packages when component mounts
  }, [id]);

  useEffect(() => {
    setNewCustomer({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    });
  }, [customer]);

  const handleAssignPackage = async (e) => {
    e.preventDefault();
    try {
      const packageDetails = packages.find(
        (pkg) => pkg._id === selectedPackage
      );
      console.log("Package details:", packageDetails);
      const { redemptions, status } = packageDetails;

      if (packageDetails.isUnlimited) {
        const expiration = calculateExpirationDate(
          packageDetails.duration,
          packageDetails.durationUnit
        );

        console.log(expiration);

        const res = await axios.post(
          `http://island-sun-tanning-backend-production.up.railway.app/api/v1/updateCustomerPackage/${id}`,
          {
            selectedPackage,
            status: expiration === null ? "active" : "redeemed",
            remainingRedemptions: redemptions,
            expiration,
          }
        );
        console.log(res);
      } else {
        const redemptions = packageDetails.redemptions;
        await axios.post(
          `http://island-sun-tanning-backend-production.up.railway.app/api/v1/updateCustomerPackage/${id}`,
          {
            selectedPackage,
            status,
            remainingRedemptions: redemptions,
          }
        );
      }

      const updatedCustomer = await axios.post(
        "http://island-sun-tanning-backend-production.up.railway.app/api/v1/getCustomers",
        {
          _id: id,
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
      await axios.post(
        `http://island-sun-tanning-backend-production.up.railway.app/api/v1/updateCustomer/${id}`,
        newCustomer
      );

      const updatedCustomer = await axios.post(
        "http://island-sun-tanning-backend-production.up.railway.app/api/v1/getCustomers",
        {
          _id: id,
        }
      );

      setCustomer(updatedCustomer.data.data.currentCustomer);
      toast.success("Customer details updated successfully", {
        duration: 2000,
        position: "top-center",
      });

      // Reset the form fields
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
  const handleDeleteCustomer = async (e) => {
    e.preventDefault();
    try {
      if (window.confirm("Are you sure you want to delete this customer?")) {
        await axios.delete(
          `http://island-sun-tanning-backend-production.up.railway.app/api/v1/deleteCustomer/${id}`
        );
        toast.success("Customer deleted successfully", {
          duration: 2000,
          position: "top-center",
        });

        window.location.href = "/all-customers";
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
          `http://island-sun-tanning-backend-production.up.railway.app/api/v1/deleteCustomerPackage/${id}`,
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
    <div>
      <div className="enrollment-form-container">
        <div className="enrollment-form-body">
          <div className="left-section">
            <h3 className="section-title">Edit Customer Details</h3>
          </div>

          <div className="right-section">
            {
              <div>
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
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditCustomer;
