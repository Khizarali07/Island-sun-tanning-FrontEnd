import { useState, useEffect } from "react";
import "../CSS/EnrollmentForm.css";
import InputMask from "react-input-mask";

function Enrollment() {
  const [phone, setPhone] = useState("");
  const [customer, setCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [selectedPackage, setSelectedPackage] = useState("");
  const [packages, setPackages] = useState([]); // Store packages

  useEffect(() => {
    // Fetch packages from API (GET request)
    const latestPackages = "Fetch packages via GET request";
    setPackages(latestPackages);
  }, []);

  // Search customer by phone (GET request)
  const handleSearch = (e) => {
    e.preventDefault();
    const formattedPhone = phone.replace(/-/g, ""); // Remove dashes
    const response = "Fetch customer by phone via GET request";

    if (response) {
      setCustomer(response.customer);
      setNewCustomer({
        name: response.customer.name,
        phone: response.customer.phone,
        email: response.customer.email,
      });
      alert("Customer found! You can edit details or assign a package.");
    } else {
      alert("No customer found.");
      setCustomer(null);
      setNewCustomer({ ...newCustomer, phone: formattedPhone });
    }
  };

  // Assign a package to the customer (POST request)
  const handleAssignPackage = (e) => {
    e.preventDefault();
    const packageDetails = packages.find((pkg) => pkg._id === selectedPackage);
    const assignPackage = "Assign package to customer via POST request";
    alert("Package assigned successfully.");
  };

  // Enroll a new customer (POST request)
  const handleEnroll = (e) => {
    e.preventDefault();
    const formattedPhone = newCustomer.phone.replace(/-/g, "");
    const enrollData = "Enroll customer with package via POST request";
    alert("Customer enrolled successfully.");
    setCustomer(null);
    setPhone("");
    setNewCustomer({ name: "", phone: "", email: "" });
    setSelectedPackage("");
  };

  // Update customer details (PUT request)
  const handleUpdateCustomer = (e) => {
    e.preventDefault();
    const updateCustomer = "Update customer details via PUT request";
    alert("Customer details updated.");
  };

  // Delete customer (DELETE request)
  const handleDeleteCustomer = () => {
    if (window.confirm("Are you sure?")) {
      const deleteCustomer = "Delete customer via DELETE request";
      alert("Customer deleted.");
    }
  };

  return (
    <div className="enrollment-form-container">
      <form onSubmit={handleSearch}>
        <InputMask
          type="text"
          mask="999-999-9999"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter customer phone"
          className="search-input"
          required
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {customer ? (
        <div>
          <h3>Customer Found: {customer.name}</h3>
          <form onSubmit={handleUpdateCustomer}>
            <input
              type="text"
              value={newCustomer.name}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, name: e.target.value })
              }
              placeholder="Customer Name"
              required
            />
            <input
              type="email"
              value={newCustomer.email}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, email: e.target.value })
              }
              placeholder="Customer Email"
            />
            <InputMask
              type="text"
              mask="999-999-9999"
              value={newCustomer.phone}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, phone: e.target.value })
              }
              placeholder="Customer Phone"
              required
            />
            <button type="submit">Update Customer</button>
            <button type="button" onClick={handleDeleteCustomer}>
              Delete Customer
            </button>
          </form>

          <h3>Assign Package</h3>
          <form onSubmit={handleAssignPackage}>
            <select
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              required
            >
              <option value="">Select Package</option>
              {/* {packages?.map((pack) => (
                <option key={pack._id} value={pack._id}>
                  {pack.name}
                </option>
              ))} */}
            </select>
            <button type="submit">Assign Package</button>
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
            required
          />
          <input
            type="email"
            placeholder="Customer Email"
            value={newCustomer.email}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, email: e.target.value })
            }
          />
          <InputMask
            type="text"
            mask="999-999-9999"
            value={newCustomer.phone}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, phone: e.target.value })
            }
            placeholder="Customer Phone"
            required
          />
          <select
            value={selectedPackage}
            onChange={(e) => setSelectedPackage(e.target.value)}
            required
          >
            <option value="">Select Package</option>
            {/* {packages?.map((pack) => (
              <option key={pack._id} value={pack._id}>
                {pack.name}
              </option>
            ))} */}
          </select>
          <button type="submit">Enroll Customer</button>
        </form>
      )}
    </div>
  );
}

export default Enrollment;
