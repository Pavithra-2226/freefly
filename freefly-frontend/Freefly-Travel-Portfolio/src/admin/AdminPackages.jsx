
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const initialFormData = {
  title: "",
  destination: "",
  duration: "",
  price: "",
  description: "",
  image: "",
  tag: "",
  status: "active",
  inclusions: [],
  exclusions: [],
  itinerary: [],
};

function AdminPackages() {
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  // RESET FORM
  const resetForm = () => {
    setFormData({
      ...initialFormData,
      inclusions: [],
      exclusions: [],
      itinerary: [],
    });
    setEditingId(null);
  };

  // GET PACKAGES
  const fetchPackages = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("admin_token");

      if (!token) {
        console.error("Admin token not found.");
        return;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/packages",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to load packages");
      }

      setPackages(data);
    } catch (error) {
      console.error("Package error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // BASIC INPUT CHANGE
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // EDIT PACKAGE
  const handleEdit = (packageItem) => {
    setEditingId(packageItem.id);

    setFormData({
      title: packageItem.title || "",
      destination: packageItem.destination || "",
      duration: packageItem.duration || "",
      price: packageItem.price || "",
      description: packageItem.description || "",
      image: packageItem.image || "",
      tag: packageItem.tag || "",
      status: packageItem.status || "active",
      inclusions: packageItem.inclusions || [],
      exclusions: packageItem.exclusions || [],
      itinerary: packageItem.itinerary || [],
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE PACKAGE
  const handleDelete = async (packageId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this package?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("admin_token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api/admin/packages/${packageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to delete package");
      }

      alert("Package deleted successfully!");
      await fetchPackages();
    } catch (error) {
      console.error("Delete package error:", error);
      alert(error.message);
    }
  };

  // ENABLE / DISABLE PACKAGE
  const handleStatusChange = async (packageItem) => {
    try {
      const token = localStorage.getItem("admin_token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const newStatus =
        packageItem.status === "active" ? "inactive" : "active";

      const response = await fetch(
        `http://127.0.0.1:8000/api/admin/packages/${packageItem.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to update package status"
        );
      }

      alert(
        newStatus === "active"
          ? "Package enabled!"
          : "Package disabled!"
      );

      await fetchPackages();
    } catch (error) {
      console.error("Status update error:", error);
      alert(error.message);
    }
  };

  // INCLUSIONS
  const addInclusion = () => {
    setFormData((previous) => ({
      ...previous,
      inclusions: [...previous.inclusions, ""],
    }));
  };

  const updateInclusion = (index, value) => {
    setFormData((previous) => {
      const updated = [...previous.inclusions];
      updated[index] = value;

      return {
        ...previous,
        inclusions: updated,
      };
    });
  };

  const removeInclusion = (index) => {
    setFormData((previous) => ({
      ...previous,
      inclusions: previous.inclusions.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  };

  // EXCLUSIONS
  const addExclusion = () => {
    setFormData((previous) => ({
      ...previous,
      exclusions: [...previous.exclusions, ""],
    }));
  };

  const updateExclusion = (index, value) => {
    setFormData((previous) => {
      const updated = [...previous.exclusions];
      updated[index] = value;

      return {
        ...previous,
        exclusions: updated,
      };
    });
  };

  const removeExclusion = (index) => {
    setFormData((previous) => ({
      ...previous,
      exclusions: previous.exclusions.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  };

  // ITINERARY
  const addItineraryDay = () => {
    setFormData((previous) => ({
      ...previous,
      itinerary: [...previous.itinerary, ""],
    }));
  };

  const updateItineraryDay = (index, value) => {
    setFormData((previous) => {
      const updated = [...previous.itinerary];
      updated[index] = value;

      return {
        ...previous,
        itinerary: updated,
      };
    });
  };

  const removeItineraryDay = (index) => {
    setFormData((previous) => ({
      ...previous,
      itinerary: previous.itinerary.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  };

  // ADD / UPDATE PACKAGE
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("admin_token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const url = editingId
        ? `http://127.0.0.1:8000/api/admin/packages/${editingId}`
        : "http://127.0.0.1:8000/api/admin/packages";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to save package");
      }

      alert(
        editingId
          ? "Package updated successfully!"
          : "Package added successfully!"
      );

      resetForm();
      setShowForm(false);

      await fetchPackages();
    } catch (error) {
      console.error("Package save error:", error);
      alert(error.message);
    }
  };

  // CLOSE FORM
  const handleCloseForm = () => {
    resetForm();
    setShowForm(false);
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/admin");
  };

  // REUSABLE INPUT
  const renderInput = (label, name, placeholder, required = false) => (
    <div className="ff-package-field">
      <label>{label}</label>
      <input
        type="text"
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );

  // REUSABLE ARRAY INPUT
  const renderArrayItems = (items, updateItem, removeItem, placeholder, label) => (
    <div className="ff-package-array">
      {items.length === 0 ? (
        <div className="ff-package-empty-section">
          No {label.toLowerCase()} added yet.
        </div>
      ) : (
        items.map((item, index) => (
          <div className="ff-package-array-row" key={index}>
            <input
              type="text"
              value={item}
              onChange={(event) => updateItem(index, event.target.value)}
              placeholder={placeholder}
              required
            />
            <button
              type="button"
              className="ff-package-remove-btn"
              onClick={() => removeItem(index)}
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="ff-admin-layout">

      {/* SIDEBAR */}

      <aside className="ff-sidebar">
        <div className="ff-logo">
          <div className="ff-logo-icon">Γ£ê</div>
          <span>
            Freefly<span style={{ color: "#60a5fa" }}>.</span>
          </span>
        </div>

        <p className="ff-sidebar-label">MAIN MENU</p>

        <nav className="ff-sidebar-nav">
          <button
            type="button"
            className="ff-nav-item"
            onClick={() => navigate("/admin/dashboard")}
          >
            <span>Γûª</span> Dashboard
          </button>

          <button
            type="button"
            className="ff-nav-item"
            onClick={() => navigate("/admin/destinations")}
          >
            <span>ΓùÄ</span> Destinations
          </button>

          <button
            type="button"
            className="ff-nav-item active"
            onClick={() => navigate("/admin/packages")}
          >
            <span>Γûú</span> Packages
          </button>

          <button
            type="button"
            className="ff-nav-item"
            onClick={() => navigate("/admin/enquiries")}
          >
            <span>Γ£ë</span> Enquiries
          </button>

          <button
            type="button"
            className="ff-nav-item"
            onClick={() => navigate("/admin/offers")}
          >
            <span>Γùç</span> Offers
          </button>
        </nav>

        <div className="ff-sidebar-bottom">
          <div className="ff-sidebar-travel">
            <span>≡ƒîì</span>
            <div>
              <strong>Explore the world</strong>
              <small>Manage your travel experience</small>
            </div>
          </div>

          <button
            type="button"
            className="ff-logout"
            onClick={handleLogout}
          >
            Γå¬ <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}

      <main className="ff-main">

        {/* TOPBAR */}

       

        <div className="ff-packages-content">
          <div className="ff-packages-inner">

            {/* PAGE HEADER */}

            <div className="ff-packages-heading">
              <div>
                <span className="ff-packages-eyebrow">
                  TRAVEL CONTENT
                </span>
                <h1>Manage Packages</h1>
                <p>
                  Create, update, and manage your travel packages.
                </p>
              </div>

              <button
                type="button"
                className="ff-package-primary-btn"
                onClick={() => {
                  if (showForm) {
                    handleCloseForm();
                  } else {
                    resetForm();
                    setShowForm(true);
                  }
                }}
              >
                {showForm ? "Γ£ò Close Form" : "+ Add Package"}
              </button>
            </div>

            {/* ADD / EDIT FORM */}

            {showForm && (
              <section className="ff-package-form-card">
                <div className="ff-package-form-heading">
                  <span className="ff-packages-eyebrow">
                    PACKAGE DETAILS
                  </span>
                  <h2>
                    {editingId ? "Edit Package" : "Add New Package"}
                  </h2>
                  <p>
                    Enter the travel package information below.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>

                  {/* BASIC INFORMATION */}

                  <div className="ff-package-form-section">
                    <div className="ff-package-section-heading">
                      <span>01</span>
                      <div>
                        <h3>Basic Information</h3>
                        <p>Package title, destination and pricing</p>
                      </div>
                    </div>

                    <div className="ff-package-form-grid">
                      {renderInput(
                        "Package Title",
                        "title",
                        "Example: Bali Escape",
                        true
                      )}

                      {renderInput(
                        "Destination",
                        "destination",
                        "Example: Bali",
                        true
                      )}

                      {renderInput(
                        "Duration",
                        "duration",
                        "Example: 4 Days / 3 Nights",
                        true
                      )}

                      {renderInput(
                        "Price",
                        "price",
                        "Example: From Γé╣45,000",
                        true
                      )}

                      {renderInput(
                        "Package Tag",
                        "tag",
                        "Example: Most Loved"
                      )}

                      <div className="ff-package-field">
                        <label>Status</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="ff-package-full-field">
                      {renderInput(
                        "Main Image URL",
                        "image",
                        "/travel/bali.jpg",
                        true
                      )}
                    </div>

                    <div className="ff-package-full-field">
                      <div className="ff-package-field">
                        <label>Description</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Enter package description..."
                          rows="4"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* INCLUSIONS */}

                  <div className="ff-package-form-section">
                    <div className="ff-package-section-heading ff-package-section-action">
                      <div className="ff-package-section-title">
                        <span>02</span>
                        <div>
                          <h3>Package Inclusions</h3>
                          <p>Everything included in the package</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="ff-package-outline-btn"
                        onClick={addInclusion}
                      >
                        + Add Inclusion
                      </button>
                    </div>

                    {renderArrayItems(
                      formData.inclusions,
                      updateInclusion,
                      removeInclusion,
                      "Example: Daily breakfast",
                      "Inclusions"
                    )}
                  </div>

                  {/* EXCLUSIONS */}

                  <div className="ff-package-form-section">
                    <div className="ff-package-section-heading ff-package-section-action">
                      <div className="ff-package-section-title">
                        <span>03</span>
                        <div>
                          <h3>Package Exclusions</h3>
                          <p>Things that are not included</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="ff-package-outline-btn"
                        onClick={addExclusion}
                      >
                        + Add Exclusion
                      </button>
                    </div>

                    {renderArrayItems(
                      formData.exclusions,
                      updateExclusion,
                      removeExclusion,
                      "Example: Personal expenses",
                      "Exclusions"
                    )}
                  </div>

                  {/* ITINERARY */}

                  <div className="ff-package-form-section">
                    <div className="ff-package-section-heading ff-package-section-action">
                      <div className="ff-package-section-title">
                        <span>04</span>
                        <div>
                          <h3>Package Itinerary</h3>
                          <p>Add the day-by-day travel plan</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="ff-package-outline-btn"
                        onClick={addItineraryDay}
                      >
                        + Add Day
                      </button>
                    </div>

                    {formData.itinerary.length === 0 ? (
                      <div className="ff-package-empty-section">
                        No itinerary days added yet.
                      </div>
                    ) : (
                      formData.itinerary.map((day, index) => (
                        <div className="ff-package-itinerary-card" key={index}>
                          <div className="ff-package-itinerary-heading">
                            <strong>Day {index + 1}</strong>

                            <button
                              type="button"
                              className="ff-package-remove-btn"
                              onClick={() => removeItineraryDay(index)}
                            >
                              Remove
                            </button>
                          </div>

                          <textarea
                            value={day}
                            onChange={(event) =>
                              updateItineraryDay(index, event.target.value)
                            }
                            placeholder={`Day ${index + 1} - Arrival, hotel check-in and sightseeing`}
                            rows="3"
                            required
                          />
                        </div>
                      ))
                    )}
                  </div>

                  {/* FORM ACTIONS */}

                  <div className="ff-package-form-actions">
                    <button
                      type="button"
                      className="ff-package-cancel-btn"
                      onClick={handleCloseForm}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="ff-package-primary-btn"
                    >
                      {editingId ? "Update Package" : "Save Package"}
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* PACKAGE LIST */}

            <div className="ff-package-list-heading">
              <div>
                <h2>All Packages</h2>
                <p>Your available travel packages</p>
              </div>

              <span className="ff-package-count">
                {packages.length} Packages
              </span>
            </div>

            {loading ? (
              <div className="ff-package-empty-state">
                <div className="ff-package-spinner"></div>
                <p>Loading packages...</p>
              </div>
            ) : packages.length === 0 ? (
              <div className="ff-package-empty-state">
                <div className="ff-package-empty-icon">Γ£ê</div>
                <h3>No packages found</h3>
                <p>Add your first travel package to get started.</p>

                <button
                  type="button"
                  className="ff-package-primary-btn"
                  onClick={() => setShowForm(true)}
                >
                  + Add Package
                </button>
              </div>
            ) : (
              <div className="ff-package-grid">
                {packages.map((packageItem) => (
                  <article
                    className="ff-package-card"
                    key={packageItem.id}
                  >
                    <div className="ff-package-image">
                      <img
                        src={packageItem.image}
                        alt={packageItem.title}
                      />

                      <span
                        className={
                          packageItem.status === "active"
                            ? "ff-package-status active"
                            : "ff-package-status inactive"
                        }
                      >
                        <span></span>
                        {packageItem.status === "active"
                          ? "Active"
                          : "Inactive"}
                      </span>

                      {packageItem.tag && (
                        <span className="ff-package-image-tag">
                          {packageItem.tag}
                        </span>
                      )}
                    </div>

                    <div className="ff-package-card-body">
                      <h3>{packageItem.title}</h3>

                      <p className="ff-package-destination">
                        ≡ƒôì {packageItem.destination}
                      </p>

                      <div className="ff-package-info">
                        <span>Γù╖ {packageItem.duration}</span>
                        <strong>{packageItem.price}</strong>
                      </div>

                      <p className="ff-package-description">
                        {packageItem.description}
                      </p>

                      <div className="ff-package-card-actions">
                        <button
                          type="button"
                          className="ff-package-edit-btn"
                          onClick={() => handleEdit(packageItem)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="ff-package-delete-btn"
                          onClick={() => handleDelete(packageItem.id)}
                        >
                          Delete
                        </button>

                        <button
                          type="button"
                          className="ff-package-status-btn"
                          onClick={() => handleStatusChange(packageItem)}
                        >
                          {packageItem.status === "active"
                            ? "Disable"
                            : "Enable"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="ff-package-footer">
              Freefly Admin Panel ┬╖ Package Management
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminPackages;
