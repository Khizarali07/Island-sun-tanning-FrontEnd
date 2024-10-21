import { useState, useEffect } from "react";
import {
  getAllCustomers,
  deleteCustomer,
  exportCustomersToExcel,
} from "../services/api";
import "./AllCustomersPage.css";
import Loader from "./Loader";

const AllCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [inputPage, setInputPage] = useState(1); // Input for user to type page number

  // Fetch all customers on component mount
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle customer deletion
  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomer(customerId);
        alert("Customer deleted successfully.");
        fetchCustomers(); // Refresh customer list
      } catch (error) {
        console.error("Error deleting customer:", error);
        alert("Failed to delete customer.");
      }
    }
  };

  // Handle export to Excel
  const handleExportToExcel = async () => {
    try {
      await exportCustomersToExcel();
      alert("Customers exported to Excel successfully.");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Failed to export customers.");
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = customers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(customers.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setInputPage(pageNumber); // Sync input box with current page
    }
  };

  // Handle input change for pagination
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      setInputPage(value);
    }
  };

  // Handle Enter key press for page input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      let pageNumber = parseInt(inputPage);
      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
        paginate(pageNumber);
      } else {
        alert(`Please enter a valid page number between 1 and ${totalPages}`);
      }
    }
  };

  return (
    <div className="all-customers-container">
      <h1 className="all-customers-title">Customer Management</h1>

      {/* Export Button */}
      <div className="export-section">
        <button className="export-button" onClick={handleExportToExcel}>
          Export to Excel
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : currentItems.length > 0 ? (
        <div className="customers-list-container">
          {currentItems.map((customer) => (
            <div key={customer._id} className="customer-card">
              <h3 className="customer-name">{customer.name}</h3>
              <p>
                <span className="label">Date Created:</span>{" "}
                {new Date(customer.createdAt).toLocaleDateString()}
              </p>
              <p>
                <span className="label">Phone:</span> {customer.phone}
              </p>
              <p>
                <span className="label">Email:</span>{" "}
                {customer.email ? customer.email : "N/A"}
              </p>
              <p>
                <span className="label">Last Check-in:</span>{" "}
                {customer.punchHistory.length > 0
                  ? new Date(customer.punchHistory[0].date).toLocaleDateString()
                  : "No Check-ins"}
              </p>
              <div className="actions-container">
                <button
                  className="edit-button"
                  onClick={() =>
                    (window.location.href = `/edit-customer/${customer._id}`)
                  }
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteCustomer(customer._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {/* Pagination */}
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt; Previous
            </button>
            <div className="page-info-container">
              Page{" "}
              <input
                type="text"
                value={inputPage}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="page-input"
              />{" "}
              of {totalPages}
            </div>
            <button
              className="pagination-button"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next &gt;
            </button>
          </div>
        </div>
      ) : (
        <p>No customers found.</p>
      )}
    </div>
  );
};

export default AllCustomersPage;
