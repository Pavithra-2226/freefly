
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
  inclusion_images: [],
  exclusions: [],
  exclusion_images: [],
  itinerary: [],
};

function AdminPackages() {
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [uploadingImage, setUploadingImage] = useState(false);

  // RESET FORM
  const resetForm = () => {
    setFormData({
      ...initialFormData,
      inclusions: [],
      inclusion_images: [],
      exclusions: [],
      exclusion_images: [],
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

  // COMMON IMAGE UPLOAD (uses the existing backend media endpoint)
  const uploadImageToServer = async (file) => {
    if (!file) return "";

    if (!file.type.startsWith("image/")) {
      throw new Error("Please select a valid image.");
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error("Image size must be less than 10 MB.");
    }

    const token = localStorage.getItem("admin_token");
    if (!token) throw new Error("Please login again.");

    const uploadData = new FormData();
    uploadData.append("file", file);

    const response = await fetch(
      "http://127.0.0.1:8000/api/admin/media/upload",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: uploadData,
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Image upload failed.");
    }

    const imageUrl = data.image?.url;
    if (!imageUrl) {
      throw new Error("Image URL was not returned by the server.");
    }

    return imageUrl;
  };

  // Reusable upload handler for any package image field
  const handleImageUpload = async (file, onChange) => {
    if (!file) return;

    try {
      setUploadingImage(true);
      const imageUrl = await uploadImageToServer(file);
      onChange(imageUrl);
    } catch (error) {
      console.error("Image upload error:", error);
      alert(error.message);
    } finally {
      setUploadingImage(false);
    }
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
      inclusion_images: packageItem.inclusion_images || [],
      exclusions: packageItem.exclusions || [],
      exclusion_images: packageItem.exclusion_images || [],
      itinerary: (packageItem.itinerary || []).map((day, index) =>
        typeof day === "string"
          ? { day: index + 1, title: `Day ${index + 1}`, description: day, image: "" }
          : {
              day: day.day || index + 1,
              title: day.title || `Day ${index + 1}`,
              description: day.description || "",
              image: day.image || "",
            }
      ),
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
      itinerary: [
        ...previous.itinerary,
        {
          day: previous.itinerary.length + 1,
          title: "",
          description: "",
          image: "",
        },
      ],
    }));
  };

  const updateItineraryDay = (index, field, value) => {
    setFormData((previous) => ({
      ...previous,
      itinerary: previous.itinerary.map((day, itemIndex) =>
        itemIndex === index ? { ...day, [field]: value } : day
      ),
    }));
  };

  const removeItineraryDay = (index) => {
    setFormData((previous) => ({
      ...previous,
      itinerary: previous.itinerary
        .filter((_, itemIndex) => itemIndex !== index)
        .map((day, itemIndex) => ({ ...day, day: itemIndex + 1 })),
    }));
  };

  // INCLUSION / EXCLUSION IMAGE ARRAYS (maximum two images each)
  const addSectionImageSlot = (field) => {
    setFormData((previous) => {
      if (previous[field].length >= 2) return previous;
      return { ...previous, [field]: [...previous[field], ""] };
    });
  };

  const updateSectionImageUrl = (field, index, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: previous[field].map((url, itemIndex) =>
        itemIndex === index ? value : url
      ),
    }));
  };

  const uploadSectionImage = async (file, field, index) => {
    if (!file) return;
    try {
      setUploadingImage(true);
      const imageUrl = await uploadImageToServer(file);
      updateSectionImageUrl(field, index, imageUrl);
    } catch (error) {
      console.error("Section image upload error:", error);
      alert(error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeSectionImage = (field, index) => {
    setFormData((previous) => ({
      ...previous,
      [field]: previous[field].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  // ADD / UPDATE PACKAGE
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (uploadingImage) {
      alert("Please wait until the image finishes uploading.");
      return;
    }

    if (!formData.image.trim()) {
      alert("Please upload or enter the main package image URL.");
      return;
    }

    const cleanedFormData = {
      ...formData,
      inclusions: formData.inclusions.map((item) => item.trim()).filter(Boolean),
      exclusions: formData.exclusions.map((item) => item.trim()).filter(Boolean),
      inclusion_images: formData.inclusion_images.filter((url) => url.trim()),
      exclusion_images: formData.exclusion_images.filter((url) => url.trim()),
      itinerary: formData.itinerary.map((day, index) => ({
        day: index + 1,
        title: day.title.trim(),
        description: day.description.trim(),
        image: day.image.trim(),
      })),
    };

    if (cleanedFormData.itinerary.some((day) => !day.title || !day.description || !day.image)) {
      alert("Please complete the title, description, and image for every itinerary day.");
      return;
    }

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
        body: JSON.stringify(cleanedFormData),
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
  const renderArrayItems = (
    items,
    updateItem,
    removeItem,
    placeholder,
    label
  ) => (
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

  // REUSABLE IMAGE FIELD: upload from device OR paste an image URL
  const renderImagePicker = (label, value, onChange) => (
    <div className="ff-package-image-picker">
      <label>{label}</label>
      <div className="ff-package-image-options">
        <div>
          <small>Upload from device</small>
          <input
            type="file"
            accept="image/*"
            disabled={uploadingImage}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleImageUpload(file, onChange);
              event.target.value = "";
            }}
          />
        </div>
        <div>
          <small>Or paste image URL</small>
          <input
            type="text"
            value={value || ""}
            onChange={(event) => onChange(event.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>
      {value && (
        <div className="ff-package-image-preview">
          <img src={value} alt={`${label} preview`} />
          <button
            type="button"
            className="ff-package-image-remove"
            aria-label={`Remove ${label}`}
            title="Remove image"
            onClick={() => onChange("")}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );

  const renderSectionImageArray = (field, label) => (
    <div className="ff-package-section-image-manager">
      <div className="ff-package-section-image-title">
        <strong>{label} Images</strong>
        <span>{formData[field].length}/2 images</span>
      </div>

      {formData[field].map((imageUrl, index) => (
        <div className="ff-package-section-image-row" key={`${field}-${index}`}>
          <div className="ff-package-section-image-preview">
            {imageUrl ? (
              <img src={imageUrl} alt={`${label} ${index + 1}`} />
            ) : (
              <span>Image preview</span>
            )}
            <button
              type="button"
              className="ff-package-image-remove"
              aria-label={`Remove ${label} image ${index + 1}`}
              title="Remove image"
              onClick={() => removeSectionImage(field, index)}
            >
              ×
            </button>
          </div>

          <div className="ff-package-section-image-inputs">
            <label>Upload from device</label>
            <input
              type="file"
              accept="image/*"
              disabled={uploadingImage}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) uploadSectionImage(file, field, index);
                event.target.value = "";
              }}
            />
            <label>Or paste image URL</label>
            <input
              type="text"
              value={imageUrl}
              placeholder="https://example.com/image.jpg"
              onChange={(event) => updateSectionImageUrl(field, index, event.target.value)}
            />
          </div>
        </div>
      ))}

      {formData[field].length < 2 && (
        <button
          type="button"
          className="ff-package-outline-btn"
          onClick={() => addSectionImageSlot(field)}
        >
          + Add {label} Image
        </button>
      )}
      {uploadingImage && <small>Uploading image...</small>}
    </div>
  );

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
            <span>▦</span> Dashboard
          </button>

          <button
            type="button"
            className="ff-nav-item"
            onClick={() => navigate("/admin/destinations")}
          >
            <span>◎</span> Destinations
          </button>

          <button
            type="button"
            className="ff-nav-item active"
            onClick={() => navigate("/admin/packages")}
          >
            <span>▣</span> Packages
          </button>

          <button
            type="button"
            className="ff-nav-item"
            onClick={() => navigate("/admin/enquiries")}
          >
            <span>✉</span> Enquiries
          </button>

          <button
            type="button"
            className="ff-nav-item"
            onClick={() => navigate("/admin/offers")}
          >
            <span>◇</span> Offers
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
                {showForm ? "✕ Close Form" : "+ Add Package"}
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
                        "Example: From ₹45,000",
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

                    {/* PACKAGE MAIN IMAGE */}
                    <div className="ff-package-full-field">
                      {renderImagePicker(
                        "Package Main Image",
                        formData.image,
                        (value) => setFormData((previous) => ({ ...previous, image: value }))
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

                    {renderSectionImageArray("inclusion_images", "Inclusion")}
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

                    {renderSectionImageArray("exclusion_images", "Exclusion")}
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
                              Remove Day
                            </button>
                          </div>

                          <div className="ff-package-form-grid">
                            <div className="ff-package-field">
                              <label>Day Title</label>
                              <input
                                type="text"
                                value={day.title}
                                onChange={(event) => updateItineraryDay(index, "title", event.target.value)}
                                placeholder={`Day ${index + 1}: Arrival and sightseeing`}
                                required
                              />
                            </div>
                          </div>

                          <div className="ff-package-field">
                            <label>Day Description</label>
                            <textarea
                              value={day.description}
                              onChange={(event) => updateItineraryDay(index, "description", event.target.value)}
                              placeholder="Describe the activities for this day..."
                              rows="3"
                              required
                            />
                          </div>

                          {renderImagePicker(
                            `Day ${index + 1} Image`,
                            day.image,
                            (value) => updateItineraryDay(index, "image", value)
                          )}
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
                      disabled={uploadingImage}
                    >
                      {uploadingImage
                        ? "Uploading Image..."
                        : editingId
                          ? "Update Package"
                          : "Save Package"}
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
                <div className="ff-package-empty-icon">✈</div>
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
                        📍 {packageItem.destination}
                      </p>

                      <div className="ff-package-info">
                        <span>◷ {packageItem.duration}</span>
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
              Freefly Admin Panel · Package Management
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminPackages;
