
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDestinations() {
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(0);

  const initialFormData = {
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
  };

  const [formData, setFormData] = useState(initialFormData);

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setFormData({ ...initialFormData });
    setEditingId(null);
  };

  // =====================================================
  // CLOUDINARY IMAGE UPLOAD
  // =====================================================

  const uploadImage = async (file, onSuccess) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must be less than 10 MB.");
      return;
    }

    const token = localStorage.getItem("admin_token");

    if (!token) {
      alert("Please login again.");
      return;
    }

    try {
      setUploadingImages((count) => count + 1);

      const uploadData = new FormData();
      uploadData.append("file", file);

      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/media/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: uploadData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Image upload failed."
        );
      }

      // Supports common response formats.
      const imageUrl =
        data.image?.url ||
        data.url ||
        data.secure_url ||
        data.data?.url;

      if (!imageUrl) {
        console.error("Unexpected upload response:", data);
        throw new Error(
          "Image URL was not returned by the server."
        );
      }

      onSuccess(imageUrl);

      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      alert(error.message || "Unable to upload image.");
    } finally {
      setUploadingImages((count) => Math.max(0, count - 1));
    }
  };

  // =====================================================
  // REUSABLE IMAGE UPLOADER
  // =====================================================

  const renderImageUploader = (label, imageUrl, onUpload, onUrlChange) => (
    <div className="ff-field">
      <label>{label}</label>

      <input
        type="file"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            uploadImage(file, onUpload);
          }

          // Allows selecting the same file again.
          event.target.value = "";
        }}
      />

      <small
        style={{
          display: "block",
          marginTop: "6px",
          color: "#64748b",
        }}
      >
        Select an image from your computer. Maximum size: 10 MB.
      </small>

      {/* Keep URL editing available for existing images */}
      <input
        type="text"
        value={imageUrl || ""}
        onChange={(event) => onUrlChange(event.target.value)}
        placeholder="Image URL will appear here after upload"
        style={{ marginTop: "12px" }}
      />

      {imageUrl && (
        <div style={{ marginTop: "12px" }}>
          <img
            src={imageUrl}
            alt={label}
            style={{
              width: "150px",
              height: "100px",
              objectFit: "cover",
              borderRadius: "10px",
              border: "1px solid #ddd",
              display: "block",
            }}
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />

          <small
            style={{
              display: "block",
              marginTop: "6px",
              color: "#16a34a",
            }}
          >
            Image URL available
          </small>
        </div>
      )}
    </div>
  );

  // =====================================================
  // GET DESTINATIONS
  // =====================================================

  const fetchDestinations = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("admin_token");

      if (!token) {
        console.error("Admin token not found.");
        return;
      }

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

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // EDIT DESTINATION
  // =====================================================

  const handleEdit = (destination) => {
    setEditingId(destination.id);

    setFormData({
      name: destination.name || "",
      country: destination.country || "",
      category: destination.category || "",
      description: destination.description || "",
      image: destination.image || "",
      best_time_to_visit: destination.best_time_to_visit || "",
      places: (destination.places || []).map((place) => ({
        name: place.name || "",
        image: place.image || "",
        description: place.description || "",
      })),
      things_to_do: (destination.things_to_do || []).map((activity) => ({
        name: activity.name || "",
        image: activity.image || "",
        description: activity.description || "",
      })),
      gallery: destination.gallery || [],
      status: destination.status || "active",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // DELETE DESTINATION
  // =====================================================

  const handleDelete = async (destinationId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this destination?"
    );

    if (!confirmDelete) return;

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

  // =====================================================
  // ENABLE / DISABLE DESTINATION
  // =====================================================

  const handleStatusChange = async (destination) => {
    try {
      const token = localStorage.getItem("admin_token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const newStatus =
        destination.status === "active" ? "inactive" : "active";

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

  // =====================================================
  // TOP PLACES
  // =====================================================

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

  // =====================================================
  // THINGS TO DO
  // =====================================================

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

  // =====================================================
  // GALLERY
  // =====================================================

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

  // =====================================================
  // ADD / UPDATE DESTINATION
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (uploadingImages > 0) {
      alert("Please wait until all images finish uploading.");
      return;
    }

    if (!formData.image.trim()) {
      alert("Please upload or enter a main destination image.");
      return;
    }

    const incompletePlace = formData.places.some(
      (place) =>
        !place.name.trim() ||
        !place.image.trim() ||
        !place.description.trim()
    );

    if (incompletePlace) {
      alert("Please complete all place details and upload their images.");
      return;
    }

    const incompleteActivity = formData.things_to_do.some(
      (activity) =>
        !activity.name.trim() ||
        !activity.image.trim() ||
        !activity.description.trim()
    );

    if (incompleteActivity) {
      alert("Please complete all activity details and upload their images.");
      return;
    }

    if (formData.gallery.some((image) => !image.trim())) {
      alert("Please upload or enter all gallery images.");
      return;
    }

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

  // =====================================================
  // CLOSE FORM
  // =====================================================

  const handleCloseForm = () => {
    resetForm();
    setShowForm(false);
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/admin");
  };

  // =====================================================
  // REUSABLE FORM FIELD
  // =====================================================

  const renderInput = (
    label,
    name,
    placeholder,
    required = false
  ) => (
    <div className="ff-field">
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

  const renderTextArea = (
    label,
    name,
    placeholder,
    rows = 4,
    required = false
  ) => (
    <div className="ff-field">
      <label>{label}</label>
      <textarea
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
      />
    </div>
  );

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="ff-admin-layout">

      {/* SIDEBAR */}

      <aside className="ff-sidebar">
        <div className="ff-logo">
          <div className="ff-logo-icon">✈</div>
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
            <span>▦</span>
            Dashboard
          </button>

          <button
            type="button"
            className="ff-nav-item active"
            onClick={() => navigate("/admin/destinations")}
          >
            <span>◎</span>
            Destinations
          </button>

          <button
            type="button"
            className="ff-nav-item"
            onClick={() => navigate("/admin/packages")}
          >
            <span>▣</span>
            Packages
          </button>

          <button
            type="button"
            className="ff-nav-item"
            onClick={() => navigate("/admin/enquiries")}
          >
            <span>✉</span>
            Enquiries
          </button>

          <button
            type="button"
            className="ff-nav-item"
            onClick={() => navigate("/admin/offers")}
          >
            <span>◇</span>
            Offers
          </button>
        </nav>

        <div className="ff-sidebar-bottom">
          <div className="ff-sidebar-travel">
            <span>🌍</span>
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
            ↪ <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}

      <main className="ff-main">
        <div className="ff-destinations-content">
          <div className="ff-destinations-inner">

            {/* PAGE HEADER */}

            <div className="ff-destination-heading">
              <div>
                <span className="ff-eyebrow">
                  TRAVEL CONTENT
                </span>

                <h1>Manage Destinations</h1>

                <p>
                  Add, edit, enable, disable, or delete your
                  travel destinations.
                </p>
              </div>

              <button
                type="button"
                className="ff-primary-btn"
                onClick={() => {
                  if (showForm) {
                    handleCloseForm();
                  } else {
                    resetForm();
                    setShowForm(true);
                  }
                }}
              >
                {showForm ? "✕ Close Form" : "+ Add Destination"}
              </button>
            </div>

            {/* ADD / EDIT FORM */}

            {showForm && (
              <section className="ff-destination-form-card">

                <div className="ff-form-heading">
                  <div>
                    <span className="ff-eyebrow">
                      DESTINATION DETAILS
                    </span>

                    <h2>
                      {editingId
                        ? "Edit Destination"
                        : "Add New Destination"}
                    </h2>

                    <p>
                      Enter the destination information below.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>

                  {/* BASIC INFORMATION */}

                  <div className="ff-form-section">
                    <div className="ff-form-section-heading">
                      <span>01</span>
                      <div>
                        <h3>Basic Information</h3>
                        <p>Main destination details</p>
                      </div>
                    </div>

                    <div className="ff-form-grid">
                      {renderInput(
                        "Destination Name",
                        "name",
                        "Example: Paris",
                        true
                      )}

                      {renderInput(
                        "Country",
                        "country",
                        "Example: France",
                        true
                      )}

                      <div className="ff-field">
                        <label>Category</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Category</option>
                          <option value="International">International</option>
                          <option value="India">India</option>
                          <option value="Beach">Beach</option>
                          <option value="Adventure">Adventure</option>
                          <option value="Honeymoon">Honeymoon</option>
                        </select>
                      </div>

                      <div className="ff-field">
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

                    <div className="ff-form-full-field">
                      {renderImageUploader(
                        "Main Destination Image",
                        formData.image,
                        (url) =>
                          setFormData((previous) => ({
                            ...previous,
                            image: url,
                          })),
                        (value) =>
                          setFormData((previous) => ({
                            ...previous,
                            image: value,
                          }))
                      )}
                    </div>

                    <div className="ff-form-full-field">
                      {renderTextArea(
                        "Description",
                        "description",
                        "Enter destination description...",
                        4,
                        true
                      )}
                    </div>
                  </div>

                  {/* BEST TIME */}

                  <div className="ff-form-section">
                    <div className="ff-form-section-heading">
                      <span>02</span>
                      <div>
                        <h3>Best Time to Visit</h3>
                        <p>Recommended travel season</p>
                      </div>
                    </div>

                    {renderInput(
                      "Best Time to Visit",
                      "best_time_to_visit",
                      "Example: April - June / September - October"
                    )}
                  </div>

                  {/* TOP PLACES */}

                  <div className="ff-form-section">
                    <div className="ff-form-section-heading ff-section-with-action">
                      <div className="ff-section-title-group">
                        <span>03</span>
                        <div>
                          <h3>Top Places to Visit</h3>
                          <p>Add famous places and attractions</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="ff-outline-btn"
                        onClick={addPlace}
                      >
                        + Add Place
                      </button>
                    </div>

                    {formData.places.length === 0 ? (
                      <div className="ff-empty-section">
                        No places added yet. Click Add Place to begin.
                      </div>
                    ) : (
                      formData.places.map((place, index) => (
                        <div className="ff-repeat-card" key={index}>
                          <div className="ff-repeat-card-heading">
                            <strong>Place {index + 1}</strong>

                            <button
                              type="button"
                              className="ff-remove-btn"
                              onClick={() => removePlace(index)}
                            >
                              Remove
                            </button>
                          </div>

                          <div className="ff-form-grid">
                            <div className="ff-field">
                              <label>Place Name</label>
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
                              />
                            </div>

                            {renderImageUploader(
                              "Place Image",
                              place.image,
                              (url) => updatePlace(index, "image", url),
                              (value) => updatePlace(index, "image", value)
                            )}
                          </div>

                          <div className="ff-form-full-field">
                            <div className="ff-field">
                              <label>Description</label>
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
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* THINGS TO DO */}

                  <div className="ff-form-section">
                    <div className="ff-form-section-heading ff-section-with-action">
                      <div className="ff-section-title-group">
                        <span>04</span>
                        <div>
                          <h3>Things to Do</h3>
                          <p>Add activities and experiences</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="ff-outline-btn"
                        onClick={addActivity}
                      >
                        + Add Activity
                      </button>
                    </div>

                    {formData.things_to_do.length === 0 ? (
                      <div className="ff-empty-section">
                        No activities added yet. Click Add Activity to begin.
                      </div>
                    ) : (
                      formData.things_to_do.map((activity, index) => (
                        <div className="ff-repeat-card" key={index}>
                          <div className="ff-repeat-card-heading">
                            <strong>Activity {index + 1}</strong>

                            <button
                              type="button"
                              className="ff-remove-btn"
                              onClick={() => removeActivity(index)}
                            >
                              Remove
                            </button>
                          </div>

                          <div className="ff-form-grid">
                            <div className="ff-field">
                              <label>Activity Name</label>
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
                                placeholder="Example: River Cruise"
                                required
                              />
                            </div>

                            {renderImageUploader(
                              "Activity Image",
                              activity.image,
                              (url) => updateActivity(index, "image", url),
                              (value) => updateActivity(index, "image", value)
                            )}
                          </div>

                          <div className="ff-form-full-field">
                            <div className="ff-field">
                              <label>Description</label>
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
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* GALLERY */}

                  <div className="ff-form-section">
                    <div className="ff-form-section-heading ff-section-with-action">
                      <div className="ff-section-title-group">
                        <span>05</span>
                        <div>
                          <h3>Destination Gallery</h3>
                          <p>Add additional destination images</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="ff-outline-btn"
                        onClick={addGalleryImage}
                      >
                        + Add Gallery Image
                      </button>
                    </div>

                    {formData.gallery.length === 0 ? (
                      <div className="ff-empty-section">
                        No gallery images added yet.
                      </div>
                    ) : (
                      formData.gallery.map((image, index) => (
                        <div className="ff-gallery-input-row" key={index}>
                          {renderImageUploader(
                            `Gallery Image ${index + 1}`,
                            image,
                            (url) => updateGalleryImage(index, url),
                            (value) => updateGalleryImage(index, value)
                          )}

                          <button
                            type="button"
                            className="ff-remove-btn"
                            onClick={() => removeGalleryImage(index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* FORM ACTIONS */}

                  <div className="ff-form-actions">
                    <button
                      type="button"
                      className="ff-cancel-btn"
                      onClick={handleCloseForm}
                      disabled={uploadingImages > 0}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="ff-primary-btn"
                      disabled={uploadingImages > 0}
                    >
                      {uploadingImages > 0
                        ? "Uploading Images..."
                        : editingId
                          ? "Update Destination"
                          : "Save Destination"}
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* DESTINATION LIST */}

            <div className="ff-destination-list-heading">
              <div>
                <h2>All Destinations</h2>
                <p>Your destination collection</p>
              </div>

              <span className="ff-destination-count">
                {destinations.length} Destinations
              </span>
            </div>

            {loading ? (
              <div className="ff-destination-empty">
                <div className="ff-loading-spinner"></div>
                <p>Loading destinations...</p>
              </div>
            ) : destinations.length === 0 ? (
              <div className="ff-destination-empty">
                <div className="ff-empty-icon">🌍</div>
                <h3>No destinations found</h3>
                <p>Add your first destination to get started.</p>

                <button
                  type="button"
                  className="ff-primary-btn"
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                >
                  + Add Destination
                </button>
              </div>
            ) : (
              <div className="ff-destination-grid">
                {destinations.map((destination) => (
                  <article
                    className="ff-destination-card"
                    key={destination.id}
                  >
                    <div className="ff-destination-image">
                      <img
                        src={destination.image}
                        alt={destination.name}
                      />

                      <span
                        className={
                          destination.status === "active"
                            ? "ff-status-badge active"
                            : "ff-status-badge inactive"
                        }
                      >
                        <span className="ff-status-dot"></span>
                        {destination.status === "active"
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                    <div className="ff-destination-card-body">
                      <div className="ff-destination-card-top">
                        <span className="ff-category-badge">
                          {destination.category}
                        </span>
                      </div>

                      <h3>{destination.name}</h3>

                      <p className="ff-destination-country">
                        <span>📍</span>
                        {destination.country}
                      </p>

                      <p className="ff-destination-description">
                        {destination.description}
                      </p>

                      <div className="ff-destination-card-footer">
                        <button
                          type="button"
                          className="ff-card-edit-btn"
                          onClick={() => handleEdit(destination)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="ff-card-delete-btn"
                          onClick={() => handleDelete(destination.id)}
                        >
                          Delete
                        </button>

                        <button
                          type="button"
                          className="ff-card-status-btn"
                          onClick={() => handleStatusChange(destination)}
                        >
                          {destination.status === "active"
                            ? "Disable"
                            : "Enable"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="ff-destination-footer">
              Freefly Admin Panel · Destination Management
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDestinations;
