import { useState, useEffect } from "react";
import "../CSS/AllCustomersPage.css";
import Loader from "../Components/Loader";
import axios from "axios";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
// import InfiniteScroll from "react-infinite-scroll-component";

import PropTypes from "prop-types";

const AllCustomersPage = ({ setProgress }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [inputPage, setInputPage] = useState(1); // Input for user to type page number

  // Fetch all customers on component mount
  const fetchCustomers = async () => {
    try {
      setProgress(0);
      setLoading(true);
      const data = await axios.get(
        "https://island-sun-tanning-backend-production.up.railway.app/api/v1/getAllCustomers"
      );

      setCustomers(data.data.data.customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle customer deletion
  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(
          `https://island-sun-tanning-backend-production.up.railway.app/api/v1/deleteCustomer/${customerId}`
        );
        toast.success("Customer deleted successfully", {
          duration: 2000,
          position: "top-center",
        });

        fetchCustomers(); // Refresh customer list
      } catch (error) {
        console.error("Error deleting customer:", error);
        toast.error("Failed to delete customer.", {
          duration: 2000,
          position: "top-center",
        });
      }
    }
  };

  // Handle export to Excel
  const handleExport = () => {
    // Create a worksheet from your data
    const excelData = customers.map((customer) => {
      let lastCheckIn = "No Check-In";

      if (customer.punchHistory.length > 0) {
        // Get the last punch history entry's date
        const lastPunch =
          customer.punchHistory[customer.punchHistory.length - 1];
        lastCheckIn = new Date(lastPunch.date).toLocaleString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true, // 12-hour format
        });
      }

      return {
        Date_Created: new Date(customer.createdAt).toLocaleString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        }),
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        Last_Tanning_Check_In: lastCheckIn, // Show the last check-in or "No Check-In"
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

    // Export the workbook to a .xlsx file
    XLSX.writeFile(workbook, "customers.xlsx");

    toast.success("Customers exported to Excel successfully.", {
      duration: 2000,
      position: "top-center",
    });
  };
  let currentItems = [];
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  currentItems = customers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(customers.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setInputPage(pageNumber); // Sync input box with current page
    }
  };

  // // Handle input change for pagination
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      setInputPage(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      let pageNumber = parseInt(inputPage);
      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
        paginate(pageNumber);
      } else {
        toast.success(
          `Please enter a valid page number between 1 and ${totalPages}`,
          {
            duration: 2000,
            position: "top-center",
          }
        );
      }
    }
  };

  // Infinite scroll logic

  // const loadMoreCustomers = () => {
  //   setTimeout(() => {
  //     setCurrentPage((prevPage) => prevPage + 1);
  //     setInputPage((prevPage) => prevPage + 1);
  //   }, 2500);
  // };

  return (
    // <InfiniteScroll
    //   dataLength={currentPage} // This is important field to render the next data
    //   next={loadMoreCustomers} // Function to be called for loading more data
    //   hasMore={currentPage < totalPages} // Indicates if there are more items to load
    //   loader={<Loader />} // You can use your loader component here
    // >
    <div className="all-customers-container">
      <h1 className="all-customers-title">Customer Management</h1>

      {/* Export Button */}
      <div className="export-section">
        <button className="export-button" onClick={handleExport}>
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
                  ? new Date(
                      customer.punchHistory[
                        customer.punchHistory.length - 1
                      ].date
                    ).toLocaleDateString()
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
                  className="edit-button"
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
              onClick={() => {
                paginate(currentPage - 1);
              }}
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
              onClick={() => {
                paginate(currentPage + 1);
              }}
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
    // </InfiniteScroll>
  );
};

AllCustomersPage.propTypes = {
  setProgress: PropTypes.func.isRequired,
};

export default AllCustomersPage;
