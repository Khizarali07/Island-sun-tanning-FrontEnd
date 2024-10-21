import { useEffect, useState, useRef } from "react";
import "../CSS/AdminDashboard.css";
import axios from "axios";
import toast from "react-hot-toast";
import Packages from "../Components/Packages";

function AdminDashboard() {
  const [name, setName] = useState("");
  const [type, setType] = useState("period");
  const [redemptions, setRedemptions] = useState(0);
  const [duration, setDuration] = useState(1);
  const [durationUnit, setDurationUnit] = useState("days");
  const [packageList, setPackageList] = useState([]); // Use state for managing package list
  const [loading, setLoading] = useState(false); // Add loading state
  const [isEditing, setIsEditing] = useState(false);
  const [id, setID] = useState(false);

  const formRef = useRef(null);

  const fetchPackages = async () => {
    const data = await axios.get("http://127.0.0.1:3000/api/v1/getPackages");
    setPackageList(data.data.data.Packages);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handlePackage = (e) => {
    e.preventDefault();
    if (isEditing === true) {
      handleupdate();
    } else {
      handlePackageCreation();
    }
  };

  const handlePackageCreation = async () => {
    setLoading(true);
    try {
      const newPackage = {
        name,
        duration: type === "period" ? duration : null, // Store custom duration for unlimited packages
        durationUnit: type === "period" ? durationUnit : null,
        redemptions: type === "number" ? Number(redemptions) : 0,
        isUnlimited: type === "period",
      };

      const createdPackage = await axios.post(
        "http://127.0.0.1:3000/api/v1/createPackage",
        {
          newPackage,
        }
      );
      console.log(createdPackage);
      toast.success("Package created successfully", {
        duration: 2000,
        position: "top-center",
      });
      setPackageList([...packageList, createdPackage.data.data.currentPackage]);
      setName("");
      setType("period");
      setRedemptions(0);
      setDuration(1);
      setDurationUnit("days");
      setLoading(false);
    } catch (error) {
      console.error("Error creating package", error);
      alert("Failed to create package");
    }
  };

  const updatePackage = async (pkg) => {
    setIsEditing(true);
    setName(pkg.name);
    const a = pkg.isUnlimited ? "period" : "number";
    setType(a);

    setRedemptions(pkg.redemptions);

    setDuration(pkg.duration);
    setDurationUnit(pkg.durationUnit);
    setID(pkg._id);
    // Scroll to the form
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleupdate = async () => {
    setLoading(true);
    const newPackage = {
      name,
      duration: type === "period" ? duration : null, // Store custom duration for unlimited packages
      durationUnit: type === "period" ? durationUnit : null,
      redemptions: type === "number" ? Number(redemptions) : 0,
      isUnlimited: type === "period",
    };
    console.log(id);

    const response = await axios.patch(
      `http://127.0.0.1:3000/api/v1/updatePackage/${id}`,
      newPackage
    );
    console.log(response);

    if (response.data.status) {
      toast.success("Package updated successfully", {
        duration: 2000,
        position: "top-center",
      });
    }

    const data = await axios.get("http://127.0.0.1:3000/api/v1/getPackages");
    setPackageList(data.data.data.Packages);

    setName("");
    setType("period");
    setRedemptions(0);
    setDuration(1);
    setDurationUnit("days");
    setLoading(false);
  };

  return (
    <>
      <div className="admin-dashboard-container">
        <h1 className="admin-title">Admin Dashboard</h1>

        {/* Package Creation Form */}
        <div className="package-creation-section" ref={formRef}>
          <h2 className="section-title">
            {isEditing ? "Edit Package" : "Create a New Package"}
          </h2>
          <form onSubmit={handlePackage} className="package-form">
            <div className="form-group">
              <label>Package Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                placeholder="Enter package name"
                required
              />
            </div>
            <div className="form-group">
              <label>Package Type:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="form-input"
                required
              >
                <option value="period">Unlimited (custom expiration)</option>
                <option value="number">Number-based (no expiration)</option>
              </select>
            </div>
            {type === "period" && (
              <>
                <div className="form-group">
                  <label>Expires in:</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="form-input"
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duration Unit:</label>
                  <select
                    value={durationUnit}
                    onChange={(e) => setDurationUnit(e.target.value)}
                    className="form-input"
                    required
                  >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </>
            )}
            {type === "number" && (
              <div className="form-group">
                <label>Number of Redemptions:</label>
                <input
                  type="number"
                  value={redemptions}
                  onChange={(e) => setRedemptions(e.target.value)}
                  className="form-input"
                  placeholder="Enter number of redemptions"
                  required
                />
              </div>
            )}
            <button type="submit" className="create-package-button">
              {isEditing ? "Edit Package" : "Create a New Package"}
            </button>
          </form>
        </div>

        {/* List of Available Packages */}
        {loading ? (
          <p>Loading packages...</p> // Show loading message while packages are being fetched
        ) : (
          <Packages
            packages={packageList}
            setPackages={setPackageList}
            updatePackage={updatePackage}
          />
        )}
      </div>
    </>
  );
}

export default AdminDashboard;
