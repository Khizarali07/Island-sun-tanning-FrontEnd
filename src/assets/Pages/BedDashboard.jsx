import { useState, useEffect, useRef } from "react";

// import BedList from "../Components/BedList";
import "../CSS/BedDashboard.css";
import axios from "axios";
import toast from "react-hot-toast";
import BedList from "../Components/BedList";

const BedDashboard = () => {
  const [bedName, setBedName] = useState(""); // For bed creation/edit
  const [availablePackages, setAvailablePackages] = useState([]); // Store the packages fetched
  const [selectedPackages, setSelectedPackages] = useState([]); // Store selected packages for bed creation/edit
  const [beds, setBeds] = useState([]); // Store list of beds with assigned packages
  const [loading, setLoading] = useState(false); // Loading state for fetching data
  const [isEditing, setIsEditing] = useState(false); // Track editing state
  const [editingBedId, setEditingBedId] = useState(null); // Store bed ID for editing

  const formRef = useRef(null); // Ref for the bed form

  // Fetch packages for bed creation
  const fetchPackages = async () => {
    setLoading(true);
    try {
      const packages = await axios.get(
        "http://127.0.0.1:3000/api/v1/getPackages"
      );
      setAvailablePackages(packages.data.data.Packages);
    } catch (error) {
      console.error("Error fetching packages", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all beds with assigned packages
  const fetchBeds = async () => {
    setLoading(true);
    try {
      const beds = await axios.get("http://127.0.0.1:3000/api/v1/getBeds");
      setBeds(beds.data.data.Beds);
    } catch (error) {
      console.error("Error fetching beds", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
    fetchBeds();
  }, []);

  const handlebeds = (e) => {
    e.preventDefault();
    if (isEditing === true) {
      handleUpdateBed();
    } else {
      handleCreateBed();
    }
  };

  // Handle bed creation
  const handleCreateBed = async () => {
    if (!bedName || selectedPackages.length === 0) {
      toast.error("Please enter a bed name and select at least one package.", {
        duration: 2000,
        position: "top-center",
      });
      return;
    }

    try {
      const newBed = {
        name: bedName,
        packages: selectedPackages.map((pkg) => ({ id: pkg })),
      };

      await axios.post("http://127.0.0.1:3000/api/v1/createBed", {
        newBed,
      });

      toast.success("Bed created successfully", {
        duration: 2000,
        position: "top-center",
      });

      //   }
      setBedName("");
      setSelectedPackages([]);
      setIsEditing(false);
      setEditingBedId(null);

      fetchBeds(); // Refresh the list of beds
    } catch (error) {
      console.error("Error creating/updating bed", error);
      alert("Failed to create/update bed");
    }
  };

  //   // Handle edit bed
  const EditBed = (bed) => {
    setIsEditing(true);
    setEditingBedId(bed._id);
    setBedName(bed.name); // Set the bed name to the form
    setSelectedPackages(bed.packages.map((pkg) => pkg.id));

    // Scroll to the form
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleUpdateBed = async () => {
    setLoading(true);
    const newBed = {
      name: bedName,
      packages: selectedPackages.map((pkg) => ({ id: pkg, name: "" })),
    };

    const response = await axios.patch(
      `http://127.0.0.1:3000/api/v1/updateBed/${editingBedId}`,
      newBed
    );
    console.log(response);

    if (response.data.status) {
      toast.success("Bed updated successfully", {
        duration: 2000,
        position: "top-center",
      });
    }

    setBedName("");
    setSelectedPackages([]);
    setIsEditing(false);
    setEditingBedId(null);

    fetchBeds();
    setLoading(false);
  };

  // Handle checkbox selection for packages
  const handlePackageSelection = (e, packageId) => {
    const { checked } = e.target;
    setSelectedPackages((prevSelected) =>
      checked
        ? [...prevSelected, packageId]
        : prevSelected.filter((id) => id !== packageId)
    );
  };

  return (
    <div className="bed-dashboard">
      <h1 className="dashboard-title">Bed Management Dashboard</h1>

      {/* Bed Creation/Editing Section */}
      <div className="bed-creation-section" ref={formRef}>
        <h2 className="section-title">
          {isEditing ? "Edit Bed" : "Create a New Bed"}
        </h2>
        <form onSubmit={handlebeds} className="bed-form">
          <div className="form-group">
            <label htmlFor="bedName">Bed Name</label>
            <input
              type="text"
              id="bedName"
              value={bedName}
              onChange={(e) => setBedName(e.target.value)}
              className="form-input"
              placeholder="Enter bed name"
              required
            />
          </div>

          <div className="form-group">
            <label>Select Packages:</label>
            <div className="package-checkbox-group">
              {loading ? (
                <p>Loading packages...</p>
              ) : (
                availablePackages.map((pkg) => (
                  <label key={pkg._id} className="package-checkbox">
                    <input
                      type="checkbox"
                      value={pkg._id}
                      checked={selectedPackages.includes(pkg._id)}
                      onChange={(e) => handlePackageSelection(e, pkg._id)}
                    />
                    {pkg.name}
                  </label>
                ))
              )}
            </div>
          </div>

          <button type="submit" className="create-bed-button">
            {isEditing ? "Update Bed" : "Create Bed"}
          </button>
        </form>
      </div>

      {/* Bed List Section */}
      <div className="bed-list-section">
        <h2 className="section-title">Available Beds</h2>
        <BedList beds={beds} fetchBeds={fetchBeds} EditBed={EditBed} />
      </div>
    </div>
  );
};

export default BedDashboard;
