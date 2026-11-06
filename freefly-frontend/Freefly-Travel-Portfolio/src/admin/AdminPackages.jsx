import { useEffect, useState } from "react";

function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
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
  });

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setFormData({
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
    });

    setEditingId(null);
  };

  // =========================================================
  // GET PACKAGES
  // =========================================================

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

      console.log("Package API status:", response.status);
      console.log("Package API data:", data);

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load packages"
        );
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

  // =========================================================
  // BASIC INPUT CHANGE
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // EDIT PACKAGE
  // =========================================================

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

  // =========================================================
  // DELETE PACKAGE
  // =========================================================

  const handleDelete = async (packageId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this package?"
    );

    if (!confirmDelete) {
      return;
    }

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
        throw new Error(
          data.detail || "Failed to delete package"
        );
      }

      alert("Package deleted successfully!");

      await fetchPackages();
    } catch (error) {
      console.error("Delete package error:", error);
      alert(error.message);
    }
  };

  // =========================================================
  // ENABLE / DISABLE PACKAGE
  // =========================================================

  const handleStatusChange = async (packageItem) => {
    try {
      const token = localStorage.getItem("admin_token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const newStatus =
        packageItem.status === "active"
          ? "inactive"
          : "active";

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

  // =========================================================
  // INCLUSIONS
  // =========================================================

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

  // =========================================================
  // EXCLUSIONS
  // =========================================================

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

  // =========================================================
  // ITINERARY
  // =========================================================

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

  // =========================================================
  // ADD / UPDATE PACKAGE
  // =========================================================

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

      console.log("Save package status:", response.status);
      console.log("Save package response:", data);

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to save package"
        );
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

  // =========================================================
  // CLOSE FORM
  // =========================================================

  const handleCloseForm = () => {
    resetForm();
    setShowForm(false);
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "40px",
        color: "#111827",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            gap: "20px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "30px",
                fontWeight: "700",
                color: "#0f172a",
              }}
            >
              Manage Packages
            </h1>

            <p
              style={{
                margin: "8px 0 0",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Add, edit, enable, disable, or delete travel
              packages.
            </p>
          </div>

          <button
            onClick={() => {
              if (showForm) {
                handleCloseForm();
              } else {
                resetForm();
                setShowForm(true);
              }
            }}
            style={primaryButtonStyle}
          >
            {showForm ? "Close Form" : "+ Add Package"}
          </button>
        </div>

        {/* ADD / EDIT FORM */}

        {showForm && (
          <div style={formCardStyle}>
            <div style={{ marginBottom: "25px" }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: "21px",
                  color: "#0f172a",
                }}
              >
                {editingId ? "Edit Package" : "Add Package"}
              </h2>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                Add complete package information for
                customers.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* BASIC INFORMATION */}

              <div style={sectionTitleStyle}>
                Basic Information
              </div>

              <div style={twoColumnGrid}>
                <div>
                  <label style={labelStyle}>
                    Package Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Example: Bali Escape"
                    required
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    Destination
                  </label>

                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="Example: Bali"
                    required
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    Duration
                  </label>

                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="Example: 4 Days / 3 Nights"
                    required
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    Price
                  </label>

                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Example: From ₹45,000"
                    required
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    Package Tag
                  </label>

                  <input
                    type="text"
                    name="tag"
                    value={formData.tag}
                    onChange={handleChange}
                    placeholder="Example: Most loved"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: "20px" }}>
                <label style={labelStyle}>
                  Main Image URL
                </label>

                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="/travel/bali.jpg"
                  required
                  style={inputStyle}
                />
              </div>

              <div style={{ marginTop: "20px" }}>
                <label style={labelStyle}>
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter package description"
                  rows="4"
                  required
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                  }}
                />
              </div>

              {/* INCLUSIONS */}

              <div style={sectionStyle}>
                <div style={sectionHeaderStyle}>
                  <div>
                    <h3 style={sectionTitleStyle}>
                      Package Inclusions
                    </h3>

                    <p style={sectionDescriptionStyle}>
                      Add everything included in the package.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addInclusion}
                    style={outlineButtonStyle}
                  >
                    + Add Inclusion
                  </button>
                </div>

                {formData.inclusions.length === 0 ? (
                  <div style={emptySectionStyle}>
                    No inclusions added yet.
                  </div>
                ) : (
                  formData.inclusions.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <input
                        type="text"
                        value={item}
                        onChange={(event) =>
                          updateInclusion(
                            index,
                            event.target.value
                          )
                        }
                        placeholder="Example: Daily breakfast"
                        required
                        style={{
                          ...inputStyle,
                          flex: 1,
                        }}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeInclusion(index)
                        }
                        style={removeButtonStyle}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* EXCLUSIONS */}

              <div style={sectionStyle}>
                <div style={sectionHeaderStyle}>
                  <div>
                    <h3 style={sectionTitleStyle}>
                      Package Exclusions
                    </h3>

                    <p style={sectionDescriptionStyle}>
                      Add things that are not included.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addExclusion}
                    style={outlineButtonStyle}
                  >
                    + Add Exclusion
                  </button>
                </div>

                {formData.exclusions.length === 0 ? (
                  <div style={emptySectionStyle}>
                    No exclusions added yet.
                  </div>
                ) : (
                  formData.exclusions.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <input
                        type="text"
                        value={item}
                        onChange={(event) =>
                          updateExclusion(
                            index,
                            event.target.value
                          )
                        }
                        placeholder="Example: Personal expenses"
                        required
                        style={{
                          ...inputStyle,
                          flex: 1,
                        }}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeExclusion(index)
                        }
                        style={removeButtonStyle}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* ITINERARY */}

              <div style={sectionStyle}>
                <div style={sectionHeaderStyle}>
                  <div>
                    <h3 style={sectionTitleStyle}>
                      Package Itinerary
                    </h3>

                    <p style={sectionDescriptionStyle}>
                      Add the day-by-day package itinerary.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addItineraryDay}
                    style={outlineButtonStyle}
                  >
                    + Add Day
                  </button>
                </div>

                {formData.itinerary.length === 0 ? (
                  <div style={emptySectionStyle}>
                    No itinerary days added yet.
                  </div>
                ) : (
                  formData.itinerary.map((day, index) => (
                    <div
                      key={index}
                      style={itemCardStyle}
                    >
                      <div style={itemHeaderStyle}>
                        <strong>
                          Day {index + 1}
                        </strong>

                        <button
                          type="button"
                          onClick={() =>
                            removeItineraryDay(index)
                          }
                          style={removeButtonStyle}
                        >
                          Remove
                        </button>
                      </div>

                      <textarea
                        value={day}
                        onChange={(event) =>
                          updateItineraryDay(
                            index,
                            event.target.value
                          )
                        }
                        placeholder={`Example: Day ${
                          index + 1
                        } - Arrival, hotel check-in and local sightseeing`}
                        rows="3"
                        required
                        style={{
                          ...inputStyle,
                          resize: "vertical",
                        }}
                      />
                    </div>
                  ))
                )}
              </div>

              {/* FORM BUTTONS */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "28px",
                  paddingTop: "22px",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <button
                  type="button"
                  onClick={handleCloseForm}
                  style={secondaryButtonStyle}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={primaryButtonStyle}
                >
                  {editingId
                    ? "Update Package"
                    : "Save Package"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PACKAGES */}

        {loading ? (
          <div style={emptyBoxStyle}>
            <p>Loading packages...</p>
          </div>
        ) : packages.length === 0 ? (
          <div style={emptyBoxStyle}>
            <h3>No packages found</h3>

            <p>
              Add your first package to get started.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            {packages.map((packageItem) => (
              <div
                key={packageItem.id}
                style={packageCardStyle}
              >
                {/* IMAGE */}

                <div
                  style={{
                    position: "relative",
                    height: "210px",
                    overflow: "hidden",
                    background: "#e5e7eb",
                  }}
                >
                  <img
                    src={packageItem.image}
                    alt={packageItem.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      top: "14px",
                      right: "14px",
                      padding: "6px 11px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "700",
                      background:
                        packageItem.status === "active"
                          ? "#ecfdf3"
                          : "#fef2f2",
                      color:
                        packageItem.status === "active"
                          ? "#15803d"
                          : "#dc2626",
                    }}
                  >
                    {packageItem.status === "active"
                      ? "● Active"
                      : "● Inactive"}
                  </div>
                </div>

                {/* CONTENT */}

                <div
                  style={{
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  <h2
                    style={{
                      margin: "0 0 8px",
                      fontSize: "21px",
                      fontWeight: "700",
                    }}
                  >
                    {packageItem.title}
                  </h2>

                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "14px",
                      marginBottom: "8px",
                    }}
                  >
                    📍 {packageItem.destination}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                      marginBottom: "12px",
                    }}
                  >
                    <span style={infoBadgeStyle}>
                      {packageItem.duration}
                    </span>

                    <span style={priceBadgeStyle}>
                      {packageItem.price}
                    </span>
                  </div>

                  {packageItem.tag && (
                    <div style={{ marginBottom: "12px" }}>
                      <span style={categoryBadgeStyle}>
                        {packageItem.tag}
                      </span>
                    </div>
                  )}

                  <p
                    style={{
                      margin: 0,
                      color: "#64748b",
                      fontSize: "14px",
                      lineHeight: "1.7",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {packageItem.description}
                  </p>

                  <div style={{ flex: 1 }} />

                  <div
                    style={{
                      height: "1px",
                      background: "#e5e7eb",
                      margin: "20px 0 16px",
                    }}
                  />

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(3, 1fr)",
                      gap: "8px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(packageItem)
                      }
                      style={{
                        ...actionButtonStyle,
                        color: "#2563eb",
                        borderColor: "#bfdbfe",
                      }}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(packageItem.id)
                      }
                      style={{
                        ...actionButtonStyle,
                        color: "#dc2626",
                        borderColor: "#fecaca",
                      }}
                    >
                      Delete
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleStatusChange(packageItem)
                      }
                      style={{
                        ...actionButtonStyle,
                        color:
                          packageItem.status === "active"
                            ? "#d97706"
                            : "#16a34a",
                        borderColor:
                          packageItem.status === "active"
                            ? "#fde68a"
                            : "#bbf7d0",
                      }}
                    >
                      {packageItem.status === "active"
                        ? "Disable"
                        : "Enable"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================
// STYLES
// =========================================================

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: "600",
  color: "#334155",
  marginBottom: "7px",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 12px",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  fontSize: "14px",
  outline: "none",
  background: "#ffffff",
  color: "#111827",
};

const twoColumnGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2, minmax(0, 1fr))",
  gap: "20px",
};

const formCardStyle = {
  background: "#ffffff",
  padding: "28px",
  borderRadius: "14px",
  marginBottom: "30px",
  border: "1px solid #e5e7eb",
  boxShadow:
    "0 4px 14px rgba(15, 23, 42, 0.06)",
};

const sectionStyle = {
  marginTop: "30px",
  paddingTop: "25px",
  borderTop: "1px solid #e5e7eb",
};

const sectionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  marginBottom: "18px",
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: "16px",
  fontWeight: "700",
  color: "#0f172a",
};

const sectionDescriptionStyle = {
  margin: "5px 0 0",
  fontSize: "13px",
  color: "#64748b",
};

const itemCardStyle = {
  padding: "18px",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  marginBottom: "14px",
  background: "#f8fafc",
};

const itemHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
  color: "#334155",
};

const emptySectionStyle = {
  padding: "20px",
  textAlign: "center",
  background: "#f8fafc",
  borderRadius: "8px",
  color: "#64748b",
  fontSize: "13px",
  border: "1px dashed #cbd5e1",
};

const outlineButtonStyle = {
  background: "#ffffff",
  color: "#0f172a",
  border: "1px solid #cbd5e1",
  padding: "9px 14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "13px",
  whiteSpace: "nowrap",
};

const removeButtonStyle = {
  background: "#ffffff",
  color: "#dc2626",
  border: "1px solid #fecaca",
  padding: "7px 11px",
  borderRadius: "7px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "12px",
};

const primaryButtonStyle = {
  background: "#0f172a",
  color: "#ffffff",
  border: "none",
  padding: "11px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
};

const secondaryButtonStyle = {
  background: "#ffffff",
  color: "#475569",
  border: "1px solid #cbd5e1",
  padding: "11px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
};

const actionButtonStyle = {
  background: "#ffffff",
  border: "1px solid",
  padding: "10px 8px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "13px",
};

const packageCardStyle = {
  background: "#ffffff",
  borderRadius: "16px",
  overflow: "hidden",
  border: "1px solid #e5e7eb",
  boxShadow:
    "0 4px 14px rgba(15, 23, 42, 0.06)",
  display: "flex",
  flexDirection: "column",
  minHeight: "560px",
};

const categoryBadgeStyle = {
  display: "inline-block",
  padding: "6px 11px",
  background: "#f8fafc",
  color: "#475569",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
  border: "1px solid #e2e8f0",
};

const infoBadgeStyle = {
  display: "inline-block",
  padding: "6px 10px",
  background: "#f8fafc",
  color: "#475569",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
  border: "1px solid #e2e8f0",
};

const priceBadgeStyle = {
  display: "inline-block",
  padding: "6px 10px",
  background: "#f1f5f9",
  color: "#0f172a",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "700",
  border: "1px solid #cbd5e1",
};

const emptyBoxStyle = {
  background: "#ffffff",
  borderRadius: "12px",
  padding: "40px",
  textAlign: "center",
  border: "1px solid #e5e7eb",
  color: "#64748b",
};

export default AdminPackages;