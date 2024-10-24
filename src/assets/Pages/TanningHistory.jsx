import { useState, useEffect } from "react";
// import { getTanningHistoryByDate } from "../services/api"; // Assuming the API is set up
import DatePicker from "react-datepicker"; // You can use any date picker library
import "react-datepicker/dist/react-datepicker.css";
import "../CSS/TanningHistory.css";
import axios from "axios";
import toast from "react-hot-toast";

import PropTypes from "prop-types";

const TanningHistory = ({ setProgress }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [punchHistory, setPunchHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

  // Fetch tanning history when date is selected
  const fetchTanningHistory = async (date) => {
    setLoading(true);
    setProgress(0);
    try {
      // Format date as YYYY-MM-DD

      const response = await axios.get(
        `https://island-sun-tanning-backend-production.up.railway.app/api/v1/getPunchHistory/${date}`
      );

      if (response.data.data.customers) {
        setPunchHistory(response.data.data.customers);
        toast.success("Punch History Found successful", {
          duration: 2000,
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error fetching tanning history:", error);
      setPunchHistory([]);
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  // Fetch history when the selected date changes
  useEffect(() => {
    fetchTanningHistory(selectedDate);
  }, [selectedDate]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = punchHistory.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(punchHistory.length / itemsPerPage);

  return (
    <div className="tanning-history-container">
      <h2 className="page-title">Tanning History</h2>
      <div className="date-picker-container">
        <label className="date-label">Select a Date:</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          className="date-picker"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : currentItems.length > 0 ? (
        <div className="history-list">
          <h3>Sign-ins for {selectedDate.toDateString()}</h3>
          <ul className="punch-list">
            {currentItems.map((punch) => (
              <li key={punch._id} className="punch-item">
                <div className="punch-details">
                  <p>
                    <strong>Customer:</strong> {punch.customerName}
                  </p>
                  <p>
                    <strong>Bed:</strong> {punch.bedName || "N/A"}
                  </p>
                  <p>
                    <strong>Package:</strong> {punch.packageName || "N/A"}
                  </p>
                  <p>
                    <strong>Time:</strong>{" "}
                    {new Date(punch.punchDate).toLocaleTimeString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`pagination-button ${
                  currentPage === index + 1 ? "active" : ""
                }`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="pagination-button"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p>No sign-ins found for the selected date.</p>
      )}
    </div>
  );
};

TanningHistory.propTypes = {
  setProgress: PropTypes.func.isRequired,
};

export default TanningHistory;
