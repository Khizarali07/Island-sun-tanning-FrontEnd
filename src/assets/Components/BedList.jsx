import axios from "axios";
import "../CSS/BedList.css"; // Link to the custom CSS for styling
import { FaTrash, FaEdit } from "react-icons/fa"; // Import trash and edit icons from react-icons
import toast from "react-hot-toast";

import PropTypes from "prop-types";

function BedList({ beds, fetchBeds, EditBed }) {
  if (!beds || beds.length === 0) {
    return <p>No beds available</p>;
  }

  const deletebeds = async (bedId) => {
    await axios.delete(
      `https://island-sun-tanning-back-end-4xb6.vercel.app/api/v1/deleteBed/${bedId}`
    );

    toast.success("Package deleted successfully", {
      duration: 2000,
      position: "top-center",
    });

    fetchBeds();
  };

  return (
    <div className="bed-list">
      {beds.map((bed) => (
        <div key={bed._id} className="bed-card">
          <div className="bed-header">
            <h3 className="bed-name">{bed.Name}</h3>
            <div className="bed-actions">
              <FaEdit
                className="edit-icon"
                onClick={() => EditBed(bed)} // Call the edit function when the icon is clicked
              />
              <FaTrash
                className="delete-icon"
                onClick={() => deletebeds(bed._id)} // Call the delete function when the icon is clicked
              />
            </div>
          </div>
          <div className="bed-packages">
            <p>Assigned Packages:</p>
            <ul>
              {bed.packages.length > 0 ? (
                bed.packages.map((pkg) => (
                  <li key={pkg.id} className="package-item">
                    {pkg.name}
                  </li>
                ))
              ) : (
                <li className="no-packages">No packages assigned</li>
              )}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

BedList.propTypes = {
  beds: PropTypes.array.isRequired,
  fetchBeds: PropTypes.func.isRequired, // `setPackages` is a required function
  EditBed: PropTypes.func.isRequired, // `updatePackage` is a required function
};

export default BedList;
