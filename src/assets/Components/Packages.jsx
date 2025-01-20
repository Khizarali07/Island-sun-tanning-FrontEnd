import "../CSS/PackageList.css";
import axios from "axios";

import PropTypes from "prop-types";
import toast from "react-hot-toast";

import { FaEdit } from "react-icons/fa";

function Packages({ packages, setPackages, updatePackage }) {
  const deletePackage = async (packageId) => {
    await axios.delete(
      `https://island-sun-tanning-back-end-4xb6.vercel.app/api/v1/deletePackage/${packageId}`
    );

    toast.success("Package deleted successfully", {
      duration: 2000,
      position: "top-center",
    });

    const data = await axios.get(
      "https://island-sun-tanning-back-end-4xb6.vercel.app/api/v1/getPackages"
    );
    setPackages(data.data.data.Packages);
  };

  const getExpirationString = (pack) => {
    if (pack.isUnlimited && pack.duration && pack.durationUnit) {
      return `Expires in ${pack.duration} ${pack.durationUnit}`;
    }
    return "No expiration";
  };

  return (
    <div className="package-list-container">
      <h2 className="package-list-title">Available Packages</h2>
      <div className="cards">
        {packages.map((pack) => (
          <div key={pack._id} className={"card card-2"}>
            <div className="card__icon">
              <i className="fas fa-gift"></i>
            </div>
            <p className="card__exit">
              <button
                onClick={() => deletePackage(pack._id)}
                className="delete-icon-button"
              >
                <img
                  src="https://img.icons8.com/ios-glyphs/30/000000/trash--v1.png"
                  alt="Delete"
                  className="delete-icon"
                />
              </button>

              <button
                onClick={() => updatePackage(pack)}
                className="update-icon-button"
              >
                <FaEdit className="update-icon" />
              </button>
            </p>

            <h2 className="card__title">{pack.name}</h2>
            <p className="card__details">
              {pack.isUnlimited
                ? "Unlimited Redemptions"
                : `${pack.redemptions} Redemptions`}
            </p>
            <p className="card__expiration">{getExpirationString(pack)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

Packages.propTypes = {
  packages: PropTypes.array.isRequired,
  setPackages: PropTypes.func.isRequired, // `setPackages` is a required function
  updatePackage: PropTypes.func.isRequired, // `updatePackage` is a required function
};

export default Packages;
