
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminEnquiries() {
  const navigate = useNavigate();

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const token = localStorage.getItem("admin_token");

  // FETCH ENQUIRIES
  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/enquiries", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load enquiries");
      }

      const data = await response.json();
      setEnquiries(data);
    } catch (err) {
      console.error(err);
      setError("Could not load enquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // UPDATE ENQUIRY STATUS
  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedEnquiry = await response.json();

      setEnquiries((current) =>
        current.map((item) =>
          item.id === id ? updatedEnquiry : item
        )
      );
    } catch (err) {
      console.error(err);
      alert("Could not update enquiry status.");
    }
  };

  // DELETE ENQUIRY
  const deleteEnquiry = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this enquiry?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/enquiries/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete enquiry");
      }

      setEnquiries((current) =>
        current.filter((item) => item.id !== id)
      );
    } catch (err) {
      console.error(err);
      alert("Could not delete enquiry.");
    }
  };

  // FILTER ENQUIRIES
  const filteredEnquiries = enquiries.filter((enquiry) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      (enquiry.name || "").toLowerCase().includes(search) ||
      (enquiry.email || "").toLowerCase().includes(search) ||
      (enquiry.phone || "").toLowerCase().includes(search) ||
      (enquiry.destination || "").toLowerCase().includes(search) ||
      (enquiry.package || "").toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" ||
      enquiry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // STATISTICS
  const newCount = enquiries.filter(
    (item) => item.status === "new"
  ).length;

  const contactedCount = enquiries.filter(
    (item) => item.status === "contacted"
  ).length;

  const closedCount = enquiries.filter(
    (item) => item.status === "closed"
  ).length;

  // DATE FORMAT
  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/admin");
  };

  return (
    <div className="ff-admin-layout">

      {/* SIDEBAR - SAME STRUCTURE AS PACKAGES */}

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
            className="ff-nav-item"
            onClick={() => navigate("/admin/packages")}
          >
            <span>▣</span> Packages
          </button>

          <button
            type="button"
            className="ff-nav-item active"
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

        {/* TOPBAR - SAME STRUCTURE AS PACKAGES */}

       

        {/* ENQUIRIES CONTENT */}

        <div className="ff-enquiries-content">
          <div className="ff-enquiries-inner">

            {/* PAGE HEADER */}

            <div className="ff-enquiries-heading">
              <div>
                <span className="ff-enquiries-eyebrow">
                  CUSTOMER MANAGEMENT
                </span>

                <h1>Manage Enquiries</h1>

                <p>
                  View customer requests and manage travel enquiries.
                </p>
              </div>

              <button
                type="button"
                className="ff-enquiry-refresh"
                onClick={fetchEnquiries}
                disabled={loading}
              >
                ↻ Refresh
              </button>
            </div>

            {/* STATISTICS */}

            <div className="ff-enquiry-stats">

              <div className="ff-enquiry-stat-card">
                <div className="ff-enquiry-stat-icon total">
                  <span>▤</span>
                </div>

                <div>
                  <span>Total Enquiries</span>
                  <h2>{enquiries.length}</h2>
                </div>
              </div>

              <div className="ff-enquiry-stat-card">
                <div className="ff-enquiry-stat-icon new">
                  <span>✉</span>
                </div>

                <div>
                  <span>New Enquiries</span>
                  <h2>{newCount}</h2>
                </div>
              </div>

              <div className="ff-enquiry-stat-card">
                <div className="ff-enquiry-stat-icon contacted">
                  <span>☎</span>
                </div>

                <div>
                  <span>Contacted</span>
                  <h2>{contactedCount}</h2>
                </div>
              </div>

              <div className="ff-enquiry-stat-card">
                <div className="ff-enquiry-stat-icon closed">
                  <span>✓</span>
                </div>

                <div>
                  <span>Closed</span>
                  <h2>{closedCount}</h2>
                </div>
              </div>

            </div>

            {/* ENQUIRY TABLE CARD */}

            <section className="ff-enquiry-table-card">

              <div className="ff-enquiry-table-header">
                <div>
                  <h2>All Enquiries</h2>
                  <p>View and manage all customer enquiries</p>
                </div>
              </div>

              {/* SEARCH AND FILTER */}

              <div className="ff-enquiry-filters">

                <div className="ff-enquiry-search">
                  <span>⌕</span>

                  <input
                    type="text"
                    placeholder="Search name, email, destination..."
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value)
                    }
                  />
                </div>

                <select
                  className="ff-enquiry-filter-select"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>

              </div>

              {/* LOADING */}

              {loading && (
                <div className="ff-enquiry-state">
                  <div className="ff-enquiry-spinner"></div>
                  <p>Loading enquiries...</p>
                </div>
              )}

              {/* ERROR */}

              {!loading && error && (
                <div className="ff-enquiry-state error">
                  <p>{error}</p>

                  <button
                    type="button"
                    onClick={fetchEnquiries}
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* EMPTY */}

              {!loading &&
                !error &&
                filteredEnquiries.length === 0 && (
                  <div className="ff-enquiry-state">
                    <div className="ff-enquiry-empty-icon">
                      ✉
                    </div>

                    <h3>No enquiries found</h3>

                    <p>
                      No customer enquiries match your search.
                    </p>
                  </div>
                )}

              {/* TABLE */}

              {!loading &&
                !error &&
                filteredEnquiries.length > 0 && (
                  <div className="ff-enquiry-table-wrapper">
                    <table className="ff-enquiry-table">

                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Contact Details</th>
                          <th>Destination</th>
                          <th>Package</th>
                          <th>Travel Date</th>
                          <th>Travellers</th>
                          <th>Message</th>
                          <th>Status</th>
                          <th>Received</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredEnquiries.map((enquiry) => (
                          <tr key={enquiry.id}>

                            <td>
                              <div className="ff-enquiry-customer">
                                <div className="ff-enquiry-avatar">
                                  {(enquiry.name || "C")
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <strong>
                                  {enquiry.name || "Unknown"}
                                </strong>
                              </div>
                            </td>

                            <td>
                              <div className="ff-enquiry-contact">
                                <span>
                                  ✉ {enquiry.email || "—"}
                                </span>

                                <span>
                                  ☎ {enquiry.phone || "—"}
                                </span>
                              </div>
                            </td>

                            <td>
                              <span className="ff-enquiry-destination">
                                {enquiry.destination || "—"}
                              </span>
                            </td>

                            <td>
                              {enquiry.package || "—"}
                            </td>

                            <td>
                              <span className="ff-enquiry-date">
                                {formatDate(enquiry.travel_date)}
                              </span>
                            </td>

                            <td className="ff-enquiry-travellers">
                              {enquiry.travellers || "—"}
                            </td>

                            <td>
                              <div
                                className="ff-enquiry-message"
                                title={enquiry.message || ""}
                              >
                                {enquiry.message || "—"}
                              </div>
                            </td>

                            <td>
                              <select
                                className={`ff-enquiry-status ${
                                  enquiry.status || "new"
                                }`}
                                value={enquiry.status || "new"}
                                onChange={(e) =>
                                  updateStatus(
                                    enquiry.id,
                                    e.target.value
                                  )
                                }
                              >
                                <option value="new">New</option>
                                <option value="contacted">
                                  Contacted
                                </option>
                                <option value="closed">
                                  Closed
                                </option>
                              </select>
                            </td>

                            <td className="ff-enquiry-received">
                              {formatDate(enquiry.created_at)}
                            </td>

                            <td>
                              <button
                                type="button"
                                className="ff-enquiry-delete"
                                title="Delete enquiry"
                                onClick={() =>
                                  deleteEnquiry(enquiry.id)
                                }
                              >
                                🗑
                              </button>
                            </td>

                          </tr>
                        ))}
                      </tbody>

                    </table>
                  </div>
                )}

              {/* FOOTER */}

              <div className="ff-enquiry-footer">
                Showing {filteredEnquiries.length} of{" "}
                {enquiries.length} enquiries
              </div>

            </section>

            <div className="ff-package-footer">
              Freefly Admin Panel · Enquiry Management
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminEnquiries;
