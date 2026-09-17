import { useEffect, useState } from "react";

function AdminDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    country: "",
    category: "",
    description: "",
    image: "",
    best_time_to_visit: "",
    places: [],
    things_to_do: [],
    gallery: [],
    status: "active",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      country: "",
      category: "",
      description: "",
      image: "",
      best_time_to_visit: "",
      places: [],
      things_to_do: [],
      gallery: [],
      status: "active",
    });

    setEditingId(null);
  };

  // =========================================================
  // GET DESTINATIONS
  // =========================================================

  const fetchDestinations = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("admin_token");

      if (!token) {
        console.error("Admin token not found.");
        return;
      }
      console.log("FORM DATA BEFORE SAVE:", formData);
      console.log("PLACES BEFORE SAVE:", formData.places);
      console.log("THINGS TO DO BEFORE SAVE:", formData.things_to_do);
      console.log("GALLERY BEFORE SAVE:", formData.gallery);
      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/destinations",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Destination API status:", response.status);
      console.log("Destination API data:", data);

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load destinations"
        );
      }

      setDestinations(data);
    } catch (error) {
      console.error("Destination error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
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
  // EDIT DESTINATION
  // =========================================================

  const handleEdit = (destination) => {
    setEditingId(destination.id);

    setFormData({
      name: destination.name || "",
      country: destination.country || "",
      category: destination.category || "",
      description: destination.description || "",
      image: destination.image || "",
      best_time_to_visit: destination.best_time_to_visit || "",
      places: destination.places || [],
      things_to_do: destination.things_to_do || [],
      gallery: destination.gallery || [],
      status: destination.status || "active",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // DELETE DESTINATION
  // =========================================================

  const handleDelete = async (destinationId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this destination?"
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
        `http://127.0.0.1:8000/api/admin/destinations/${destinationId}`,
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
          data.detail || "Failed to delete destination"
        );
      }

      alert("Destination deleted successfully!");

      await fetchDestinations();
    } catch (error) {
      console.error("Delete destination error:", error);
      alert(error.message);
    }
  };

  // =========================================================
  // ENABLE / DISABLE DESTINATION
  // =========================================================

  const handleStatusChange = async (destination) => {
    try {
      const token = localStorage.getItem("admin_token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const newStatus =
        destination.status === "active"
          ? "inactive"
          : "active";

      const response = await fetch(
        `http://127.0.0.1:8000/api/admin/destinations/${destination.id}`,
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
          data.detail || "Failed to update destination status"
        );
      }

      alert(
        newStatus === "active"
          ? "Destination enabled!"
          : "Destination disabled!"
      );

      await fetchDestinations();
    } catch (error) {
      console.error("Status update error:", error);
      alert(error.message);
    }
  };

  // =========================================================
  // TOP PLACES
  // =========================================================

  const addPlace = () => {
    setFormData((previous) => ({
      ...previous,
      places: [
        ...previous.places,
        {
          name: "",
          image: "",
          description: "",
        },
      ],
    }));
  };

  const updatePlace = (index, field, value) => {
    setFormData((previous) => {
      const updatedPlaces = [...previous.places];

      updatedPlaces[index] = {
        ...updatedPlaces[index],
        [field]: value,
      };

      return {
        ...previous,
        places: updatedPlaces,
      };
    });
  };

  const removePlace = (index) => {
    setFormData((previous) => ({
      ...previous,
      places: previous.places.filter(
        (_, placeIndex) => placeIndex !== index
      ),
    }));
  };

  // =========================================================
  // THINGS TO DO
  // =========================================================

  const addActivity = () => {
    setFormData((previous) => ({
      ...previous,
      things_to_do: [
        ...previous.things_to_do,
        {
          name: "",
          image: "",
          description: "",
        },
      ],
    }));
  };

  const updateActivity = (index, field, value) => {
    setFormData((previous) => {
      const updatedActivities = [...previous.things_to_do];

      updatedActivities[index] = {
        ...updatedActivities[index],
        [field]: value,
      };

      return {
        ...previous,
        things_to_do: updatedActivities,
      };
    });
  };

  const removeActivity = (index) => {
    setFormData((previous) => ({
      ...previous,
      things_to_do: previous.things_to_do.filter(
        (_, activityIndex) => activityIndex !== index
      ),
    }));
  };

  // =========================================================
  // GALLERY
  // =========================================================

  const addGalleryImage = () => {
    setFormData((previous) => ({
      ...previous,
      gallery: [...previous.gallery, ""],
    }));
  };

  const updateGalleryImage = (index, value) => {
    setFormData((previous) => {
      const updatedGallery = [...previous.gallery];

      updatedGallery[index] = value;

      return {
        ...previous,
        gallery: updatedGallery,
      };
    });
  };

  const removeGalleryImage = (index) => {
    setFormData((previous) => ({
      ...previous,
      gallery: previous.gallery.filter(
        (_, galleryIndex) => galleryIndex !== index
      ),
    }));
  };

  // =========================================================
  // ADD / UPDATE DESTINATION
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
        ? `http://127.0.0.1:8000/api/admin/destinations/${editingId}`
        : "http://127.0.0.1:8000/api/admin/destinations";

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

      console.log("Save status:", response.status);
      console.log("Save response:", data);

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to save destination"
        );
      }

      alert(
        editingId
          ? "Destination updated successfully!"
          : "Destination added successfully!"
      );

      resetForm();
      setShowForm(false);

      await fetchDestinations();
    } catch (error) {
      console.error("Destination save error:", error);
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
              Manage Destinations
            </h1>

            <p
              style={{
                margin: "8px 0 0",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Add, edit, enable, disable, or delete travel
              destinations.
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
            {showForm ? "Close Form" : "+ Add Destination"}
          </button>
        </div>

        {/* =====================================================
            ADD / EDIT FORM
        ====================================================== */}

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
                {editingId
                  ? "Edit Destination"
                  : "Add Destination"}
              </h2>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                Add complete destination information for
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
                    Destination Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Example: Paris"
                    required
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    Country
                  </label>

                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Example: France"
                    required
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  >
                    <option value="">
                      Select Category
                    </option>

                    <option value="International">
                      International
                    </option>

                    <option value="India">
                      India
                    </option>

                    <option value="Beach">
                      Beach
                    </option>

                    <option value="Adventure">
                      Adventure
                    </option>

                    <option value="Honeymoon">
                      Honeymoon
                    </option>
                  </select>
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
                    <option value="active">
                      Active
                    </option>

                    <option value="inactive">
                      Inactive
                    </option>
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
                  placeholder="https://example.com/paris.jpg"
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
                  placeholder="Enter destination description"
                  rows="4"
                  required
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                  }}
                />
              </div>

              {/* BEST TIME */}

              <div style={sectionStyle}>
                <div style={sectionHeaderStyle}>
                  <div>
                    <h3 style={sectionTitleStyle}>
                      Best Time to Visit
                    </h3>

                    <p style={sectionDescriptionStyle}>
                      Example: April - June / September -
                      October
                    </p>
                  </div>
                </div>

                <input
                  type="text"
                  name="best_time_to_visit"
                  value={formData.best_time_to_visit}
                  onChange={handleChange}
                  placeholder="April - June / September - October"
                  style={inputStyle}
                />
              </div>

              {/* TOP PLACES */}

              <div style={sectionStyle}>
                <div style={sectionHeaderStyle}>
                  <div>
                    <h3 style={sectionTitleStyle}>
                      Top Places to Visit
                    </h3>

                    <p style={sectionDescriptionStyle}>
                      Add famous places and attractions.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addPlace}
                    style={outlineButtonStyle}
                  >
                    + Add Place
                  </button>
                </div>

                {formData.places.length === 0 ? (
                  <div style={emptySectionStyle}>
                    No places added yet.
                  </div>
                ) : (
                  formData.places.map((place, index) => (
                    <div
                      key={index}
                      style={itemCardStyle}
                    >
                      <div style={itemHeaderStyle}>
                        <strong>
                          Place {index + 1}
                        </strong>

                        <button
                          type="button"
                          onClick={() =>
                            removePlace(index)
                          }
                          style={removeButtonStyle}
                        >
                          Remove
                        </button>
                      </div>

                      <div style={twoColumnGrid}>
                        <div>
                          <label style={labelStyle}>
                            Place Name
                          </label>

                          <input
                            type="text"
                            value={place.name}
                            onChange={(event) =>
                              updatePlace(
                                index,
                                "name",
                                event.target.value
                              )
                            }
                            placeholder="Example: Eiffel Tower"
                            required
                            style={inputStyle}
                          />
                        </div>

                        <div>
                          <label style={labelStyle}>
                            Image URL
                          </label>

                          <input
                            type="text"
                            value={place.image}
                            onChange={(event) =>
                              updatePlace(
                                index,
                                "image",
                                event.target.value
                              )
                            }
                            placeholder="https://example.com/eiffel.jpg"
                            required
                            style={inputStyle}
                          />
                        </div>
                      </div>

                      <div style={{ marginTop: "15px" }}>
                        <label style={labelStyle}>
                          Description
                        </label>

                        <textarea
                          value={place.description}
                          onChange={(event) =>
                            updatePlace(
                              index,
                              "description",
                              event.target.value
                            )
                          }
                          placeholder="Describe this place..."
                          rows="3"
                          required
                          style={{
                            ...inputStyle,
                            resize: "vertical",
                          }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* THINGS TO DO */}

              <div style={sectionStyle}>
                <div style={sectionHeaderStyle}>
                  <div>
                    <h3 style={sectionTitleStyle}>
                      Things to Do
                    </h3>

                    <p style={sectionDescriptionStyle}>
                      Add activities and experiences.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addActivity}
                    style={outlineButtonStyle}
                  >
                    + Add Activity
                  </button>
                </div>

                {formData.things_to_do.length === 0 ? (
                  <div style={emptySectionStyle}>
                    No activities added yet.
                  </div>
                ) : (
                  formData.things_to_do.map(
                    (activity, index) => (
                      <div
                        key={index}
                        style={itemCardStyle}
                      >
                        <div style={itemHeaderStyle}>
                          <strong>
                            Activity {index + 1}
                          </strong>

                          <button
                            type="button"
                            onClick={() =>
                              removeActivity(index)
                            }
                            style={removeButtonStyle}
                          >
                            Remove
                          </button>
                        </div>

                        <div style={twoColumnGrid}>
                          <div>
                            <label style={labelStyle}>
                              Activity Name
                            </label>

                            <input
                              type="text"
                              value={activity.name}
                              onChange={(event) =>
                                updateActivity(
                                  index,
                                  "name",
                                  event.target.value
                                )
                              }
                              placeholder="Example: Seine River Cruise"
                              required
                              style={inputStyle}
                            />
                          </div>

                          <div>
                            <label style={labelStyle}>
                              Image URL
                            </label>

                            <input
                              type="text"
                              value={activity.image}
                              onChange={(event) =>
                                updateActivity(
                                  index,
                                  "image",
                                  event.target.value
                                )
                              }
                              placeholder="https://example.com/cruise.jpg"
                              required
                              style={inputStyle}
                            />
                          </div>
                        </div>

                        <div style={{ marginTop: "15px" }}>
                          <label style={labelStyle}>
                            Description
                          </label>

                          <textarea
                            value={activity.description}
                            onChange={(event) =>
                              updateActivity(
                                index,
                                "description",
                                event.target.value
                              )
                            }
                            placeholder="Describe this activity..."
                            rows="3"
                            required
                            style={{
                              ...inputStyle,
                              resize: "vertical",
                            }}
                          />
                        </div>
                      </div>
                    )
                  )
                )}
              </div>

              {/* GALLERY */}

              <div style={sectionStyle}>
                <div style={sectionHeaderStyle}>
                  <div>
                    <h3 style={sectionTitleStyle}>
                      Destination Gallery
                    </h3>

                    <p style={sectionDescriptionStyle}>
                      Add additional destination images.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addGalleryImage}
                    style={outlineButtonStyle}
                  >
                    + Add Gallery Image
                  </button>
                </div>

                {formData.gallery.length === 0 ? (
                  <div style={emptySectionStyle}>
                    No gallery images added yet.
                  </div>
                ) : (
                  formData.gallery.map((image, index) => (
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
                        value={image}
                        onChange={(event) =>
                          updateGalleryImage(
                            index,
                            event.target.value
                          )
                        }
                        placeholder="https://example.com/paris-gallery.jpg"
                        required
                        style={{
                          ...inputStyle,
                          flex: 1,
                        }}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeGalleryImage(index)
                        }
                        style={removeButtonStyle}
                      >
                        Remove
                      </button>
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
                    ? "Update Destination"
                    : "Save Destination"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =====================================================
            DESTINATIONS
        ====================================================== */}

        {loading ? (
          <div style={emptyBoxStyle}>
            <p>Loading destinations...</p>
          </div>
        ) : destinations.length === 0 ? (
          <div style={emptyBoxStyle}>
            <h3>No destinations found</h3>

            <p>
              Add your first destination to get started.
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
            {destinations.map((destination) => (
              <div
                key={destination.id}
                style={destinationCardStyle}
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
                    src={destination.image}
                    alt={destination.name}
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
                        destination.status === "active"
                          ? "#ecfdf3"
                          : "#fef2f2",
                      color:
                        destination.status === "active"
                          ? "#15803d"
                          : "#dc2626",
                    }}
                  >
                    {destination.status === "active"
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
                    {destination.name}
                  </h2>

                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "14px",
                      marginBottom: "12px",
                    }}
                  >
                    📍 {destination.country}
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <span style={categoryBadgeStyle}>
                      {destination.category}
                    </span>
                  </div>

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
                    {destination.description}
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
                        handleEdit(destination)
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
                        handleDelete(destination.id)
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
                        handleStatusChange(destination)
                      }
                      style={{
                        ...actionButtonStyle,
                        color:
                          destination.status === "active"
                            ? "#d97706"
                            : "#16a34a",
                        borderColor:
                          destination.status === "active"
                            ? "#fde68a"
                            : "#bbf7d0",
                      }}
                    >
                      {destination.status === "active"
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

const destinationCardStyle = {
  background: "#ffffff",
  borderRadius: "16px",
  overflow: "hidden",
  border: "1px solid #e5e7eb",
  boxShadow:
    "0 4px 14px rgba(15, 23, 42, 0.06)",
  display: "flex",
  flexDirection: "column",
  minHeight: "530px",
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

const emptyBoxStyle = {
  background: "#ffffff",
  borderRadius: "12px",
  padding: "40px",
  textAlign: "center",
  border: "1px solid #e5e7eb",
  color: "#64748b",
};

export default AdminDestinations;