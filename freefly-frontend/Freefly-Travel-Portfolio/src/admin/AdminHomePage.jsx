
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminHomePage.css";

const API = "http://127.0.0.1:8000";

export default function AdminHomePage() {
  const navigate = useNavigate();

  const [section, setSection] = useState("banners");
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const emptyForm = {
    title: "",
    subtitle: "",
    description: "",
    image: "",
    button_text: "",
    button_link: "",
    active: true,
    display_order: 1
  };

  const [form, setForm] = useState(emptyForm);

  const token = localStorage.getItem("admin_token");

  const headers = {
    Authorization: `Bearer ${token}`
  };

  const fetchItems = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API}/api/admin/homepage/${section}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error("Unable to load homepage content.");
      }

      setItems(await response.json());
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [section]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm(previous => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Upload selected image to existing Cloudinary API
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    try {
      setUploading(true);

      const response = await fetch(
        `${API}/api/admin/media/upload`,
        {
          method: "POST",
          headers,
          body: data
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Image upload failed.");
      }

      setForm(previous => ({
        ...previous,
        image: result.image.url,
        public_id: result.image.public_id
      }));

      alert("Image uploaded successfully.");
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image) {
      alert("Please upload an image.");
      return;
    }

    const url = editingId
      ? `${API}/api/admin/homepage/${section}/${editingId}`
      : `${API}/api/admin/homepage/${section}`;

    try {
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          display_order: Number(form.display_order)
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Unable to save content.");
      }

      alert("Homepage content saved successfully.");

      setForm(emptyForm);
      setEditingId(null);

      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title || "",
      subtitle: item.subtitle || "",
      description: item.description || "",
      image: item.image || "",
      public_id: item.public_id || "",
      button_text: item.button_text || "",
      button_link: item.button_link || "",
      active: item.active ?? true,
      display_order: item.display_order ?? 1
    });

    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this content?")) return;

    try {
      const response = await fetch(
        `${API}/api/admin/homepage/${section}/${id}`,
        {
          method: "DELETE",
          headers
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed.");
      }

      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/admin");
  };

  return (
    <div className="ff-home-admin">

      <aside className="ff-home-sidebar">
        <h2>Freefly<span>.</span></h2>

        <p>CONTENT MANAGEMENT</p>

        <button onClick={() => navigate("/admin/dashboard")}>
          Dashboard
        </button>

        <button
          className="selected"
          onClick={() => navigate("/admin/homepage")}
        >
          Home Page
        </button>

        <button onClick={() => navigate("/admin/destinations")}>
          Destinations
        </button>

        <button onClick={() => navigate("/admin/packages")}>
          Packages
        </button>

        <button onClick={() => navigate("/admin/enquiries")}>
          Enquiries
        </button>

        <button onClick={handleLogout}>Logout</button>
      </aside>

      <main className="ff-home-main">

        <div className="ff-home-heading">
          <div>
            <span>WEBSITE CONTENT</span>
            <h1>Home Page Management</h1>
            <p>Manage your homepage banners and promotional postcards.</p>
          </div>
        </div>

        <div className="ff-home-tabs">
          <button
            className={section === "banners" ? "active" : ""}
            onClick={() => {
              resetForm();
              setSection("banners");
            }}
          >
            Hero Banners
          </button>

          <button
            className={section === "postcards" ? "active" : ""}
            onClick={() => {
              resetForm();
              setSection("postcards");
            }}
          >
            Promotional Postcards
          </button>
        </div>

        <section className="ff-home-form-card">
          <h2>{editingId ? "Edit Content" : "Add New Content"}</h2>

          <form onSubmit={handleSubmit}>

            <label>Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter title"
              required
            />

            <label>Subtitle</label>
            <input
              name="subtitle"
              value={form.subtitle}
              onChange={handleChange}
              placeholder="Enter subtitle"
            />

            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter description"
            />

            <label>Upload Image *</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageUpload}
              disabled={uploading}
            />

            {uploading && <p>Uploading image...</p>}

            {form.image && (
              <img
                src={form.image}
                alt="Preview"
                className="ff-home-preview"
              />
            )}

            <label>Button Text</label>
            <input
              name="button_text"
              value={form.button_text}
              onChange={handleChange}
              placeholder="Example: Explore More"
            />

            <label>Button Link</label>
            <input
              name="button_link"
              value={form.button_link}
              onChange={handleChange}
              placeholder="/destinations"
            />

            <label>Display Order</label>
            <input
              type="number"
              min="1"
              name="display_order"
              value={form.display_order}
              onChange={handleChange}
            />

            <label className="ff-home-checkbox">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />
              Active
            </label>

            <div className="ff-home-actions">
              <button type="submit" disabled={uploading}>
                {editingId ? "Update Content" : "Save Content"}
              </button>

              <button type="button" onClick={resetForm}>
                Clear
              </button>
            </div>

          </form>
        </section>

        <section className="ff-home-list">
          <h2>
            {section === "banners" ? "Homepage Banners" : "Promotional Postcards"}
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : items.length === 0 ? (
            <p>No content added yet.</p>
          ) : (
            <div className="ff-home-grid">
              {items.map(item => (
                <article key={item.id} className="ff-home-item">
                  <img src={item.image} alt={item.title} />

                  <div className="ff-home-item-info">
                    <h3>{item.title}</h3>
                    <p>{item.subtitle}</p>

                    <span className={item.active ? "status-active" : "status-inactive"}>
                      {item.active ? "Active" : "Inactive"}
                    </span>

                    <div>
                      <button onClick={() => handleEdit(item)}>
                        Edit
                      </button>

                      <button onClick={() => handleDelete(item.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
