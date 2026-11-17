
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const initialFormData = {
  title: "",
  description: "",
  image: "",
  tag: "",
  button_text: "Explore Now",
  button_link: "/contact",
  status: "active",
  sort_order: 0,
};

function AdminServices() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token");

      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/services",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to load services");

      setServices(data);
    } catch (error) {
      console.error("Services error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: name === "sort_order" ? Number(value) : value,
    }));
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    setFormData({
      title: service.title || "",
      description: service.description || "",
      image: service.image || "",
      tag: service.tag || "",
      button_text: service.button_text || "Explore Now",
      button_link: service.button_link || "/contact",
      status: service.status || "active",
      sort_order: service.sort_order ?? 0,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        alert("Please login again.");
        return;
      }

      const url = editingId
        ? `http://127.0.0.1:8000/api/admin/services/${editingId}`
        : "http://127.0.0.1:8000/api/admin/services";

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to save service");

      alert(editingId ? "Service updated successfully!" : "Service added successfully!");
      resetForm();
      setShowForm(false);
      await fetchServices();
    } catch (error) {
      console.error("Save service error:", error);
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/admin/services/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to delete service");

      alert("Service deleted successfully!");
      await fetchServices();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleStatusChange = async (service) => {
    try {
      const token = localStorage.getItem("admin_token");
      const newStatus = service.status === "active" ? "inactive" : "active";

      const response = await fetch(
        `http://127.0.0.1:8000/api/admin/services/${service.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to update status");

      await fetchServices();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/admin");
  };

  const renderInput = (label, name, placeholder, required = false) => (
    <div className="ff-package-field">
      <label>{label}</label>
      <input
        type={name === "sort_order" ? "number" : "text"}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );

  return (
    <div className="ff-admin-layout">
      <aside className="ff-sidebar">
        <div className="ff-logo">
          <div className="ff-logo-icon">✈</div>
          <span>Freefly<span style={{ color: "#60a5fa" }}>.</span></span>
        </div>

        <p className="ff-sidebar-label">MAIN MENU</p>

        <nav className="ff-sidebar-nav">
          <button className="ff-nav-item" onClick={() => navigate("/admin/dashboard")}>▦ Dashboard</button>
          <button className="ff-nav-item" onClick={() => navigate("/admin/destinations")}>◎ Destinations</button>
          <button className="ff-nav-item" onClick={() => navigate("/admin/packages")}>▣ Packages</button>
          <button className="ff-nav-item" onClick={() => navigate("/admin/enquiries")}>✉ Enquiries</button>
          <button className="ff-nav-item active" onClick={() => navigate("/admin/services")}>◇ Services</button>
        </nav>

        <div className="ff-sidebar-bottom">
          <div className="ff-sidebar-travel">
            <span>🌍</span>
            <div>
              <strong>Explore the world</strong>
              <small>Manage your travel experience</small>
            </div>
          </div>
          <button className="ff-logout" onClick={handleLogout}>↪ <span>Logout</span></button>
        </div>
      </aside>

      <main className="ff-main">
        <div className="ff-packages-content">
          <div className="ff-packages-inner">
            <div className="ff-packages-heading">
              <div>
                <span className="ff-packages-eyebrow">TRAVEL CONTENT</span>
                <h1>Manage Services</h1>
                <p>Create, update, and manage your website services.</p>
              </div>

              <button
                className="ff-package-primary-btn"
                onClick={() => {
                  if (showForm) {
                    resetForm();
                    setShowForm(false);
                  } else {
                    resetForm();
                    setShowForm(true);
                  }
                }}
              >
                {showForm ? "✕ Close Form" : "+ Add Service"}
              </button>
            </div>

            {showForm && (
              <section className="ff-package-form-card">
                <div className="ff-package-form-heading">
                  <span className="ff-packages-eyebrow">SERVICE DETAILS</span>
                  <h2>{editingId ? "Edit Service" : "Add New Service"}</h2>
                  <p>Enter the information for your website service.</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="ff-package-form-section">
                    <div className="ff-package-section-heading">
                      <span>01</span>
                      <div>
                        <h3>Basic Information</h3>
                        <p>Service title, description and image</p>
                      </div>
                    </div>

                    <div className="ff-package-form-grid">
                      {renderInput("Service Title", "title", "Example: Flight Booking", true)}
                      {renderInput("Tag", "tag", "Example: Popular")}
                      {renderInput("Button Text", "button_text", "Example: Explore Now", true)}
                      {renderInput("Button Link", "button_link", "/contact", true)}
                      {renderInput("Display Order", "sort_order", "1")}
                      <div className="ff-package-field">
                        <label>Status</label>
                        <select name="status" value={formData.status} onChange={handleChange}>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="ff-package-full-field">
                      {renderInput("Image URL", "image", "Paste image URL here", true)}
                    </div>

                    <div className="ff-package-full-field">
                      <div className="ff-package-field">
                        <label>Description</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Enter service description..."
                          rows="4"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="ff-package-form-actions">
                    <button type="button" className="ff-package-cancel-btn" onClick={() => {
                      resetForm();
                      setShowForm(false);
                    }}>
                      Cancel
                    </button>
                    <button type="submit" className="ff-package-primary-btn">
                      {editingId ? "Update Service" : "Save Service"}
                    </button>
                  </div>
                </form>
              </section>
            )}

            <div className="ff-package-list-heading">
              <div>
                <h2>All Services</h2>
                <p>Manage the services displayed on your website.</p>
              </div>
              <span className="ff-package-count">{services.length} Services</span>
            </div>

            {loading ? (
              <div className="ff-package-empty-state">
                <div className="ff-package-spinner"></div>
                <p>Loading services...</p>
              </div>
            ) : services.length === 0 ? (
              <div className="ff-package-empty-state">
                <div className="ff-package-empty-icon">◇</div>
                <h3>No services found</h3>
                <p>Add your first service to get started.</p>
                <button className="ff-package-primary-btn" onClick={() => setShowForm(true)}>
                  + Add Service
                </button>
              </div>
            ) : (
              <div className="ff-package-grid">
                {services.map((service) => (
                  <article className="ff-package-card" key={service.id}>
                    <div className="ff-package-image">
                      <img src={service.image} alt={service.title} />
                      <span className={`ff-package-status ${service.status === "active" ? "active" : "inactive"}`}>
                        <span></span>
                        {service.status === "active" ? "Active" : "Inactive"}
                      </span>
                      {service.tag && <span className="ff-package-image-tag">{service.tag}</span>}
                    </div>

                    <div className="ff-package-card-body">
                      <h3>{service.title}</h3>
                      <p className="ff-package-description">{service.description}</p>
                      <div className="ff-package-info">
                        <span>Order: {service.sort_order}</span>
                        <strong>{service.button_text}</strong>
                      </div>

                      <div className="ff-package-card-actions">
                        <button className="ff-package-edit-btn" onClick={() => handleEdit(service)}>Edit</button>
                        <button className="ff-package-delete-btn" onClick={() => handleDelete(service.id)}>Delete</button>
                        <button className="ff-package-status-btn" onClick={() => handleStatusChange(service)}>
                          {service.status === "active" ? "Disable" : "Enable"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="ff-package-footer">
              Freefly Admin Panel · Service Management
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminServices;
