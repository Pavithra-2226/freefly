
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const API = "/api/admin";

function getRecords(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.destinations)) return data.destinations;
  if (Array.isArray(data?.packages)) return data.packages;
  if (Array.isArray(data?.enquiries)) return data.enquiries;
  if (Array.isArray(data?.offers)) return data.offers;
  return [];
}

function AdminDashboard() {
  const navigate = useNavigate();

  const adminUser = JSON.parse(
    localStorage.getItem("admin_user") || "{}"
  );

  const [stats, setStats] = useState({
    destinations: 0,
    packages: 0,
    enquiries: 0,
    offers: 0,
  });

  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const menuItems = [
    { name: "Dashboard", icon: "⌂", path: "/admin/dashboard" },
    { name: "Destinations", icon: "⌖", path: "/admin/destinations" },
    { name: "Packages", icon: "▣", path: "/admin/packages" },
    { name: "Enquiries", icon: "✉", path: "/admin/enquiries" },
    { name: "Offers", icon: "◇", path: "/admin/offers" },
  ];

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("admin_token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const endpoints = [
      { key: "destinations", url: `${API}/destinations` },
      { key: "packages", url: `${API}/packages` },
      { key: "enquiries", url: `${API}/enquiries` },
      { key: "offers", url: `${API}/offers` },
    ];

    try {
      const results = await Promise.allSettled(
        endpoints.map(async (endpoint) => {
          const response = await fetch(endpoint.url, { headers });

          if (!response.ok) {
            throw new Error(`Unable to fetch ${endpoint.key}`);
          }

          const data = await response.json();
          return {
            key: endpoint.key,
            records: getRecords(data),
          };
        })
      );

      const updatedStats = {
        destinations: 0,
        packages: 0,
        enquiries: 0,
        offers: 0,
      };

      let enquiries = [];

      results.forEach((result) => {
        if (result.status !== "fulfilled") return;

        const { key, records } = result.value;
        updatedStats[key] = records.length;

        if (key === "enquiries") {
          enquiries = records;
        }
      });

      setStats(updatedStats);

      enquiries.sort((a, b) => {
        const dateA = new Date(
          a.created_at || a.createdAt || 0
        ).getTime();

        const dateB = new Date(
          b.created_at || b.createdAt || 0
        ).getTime();

        return dateB - dateA;
      });

      setRecentEnquiries(enquiries.slice(0, 5));
    } catch (error) {
      console.error("Dashboard data error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/admin");
  };

  const formatTime = (dateValue) => {
    if (!dateValue) return "Recently";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "Recently";

    const difference = Math.max(0, Date.now() - date.getTime());
    const minutes = Math.floor(difference / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} mins ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} days ago`;

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  const getCustomerName = (item) =>
    item.name || item.customer_name || item.full_name || "Customer";

  const getEnquiryDestination = (item) =>
    item.destination || item.package || item.subject || "Travel enquiry";

  const filteredEnquiries = recentEnquiries.filter((item) => {
    const query = search.toLowerCase();

    return (
      getCustomerName(item).toLowerCase().includes(query) ||
      getEnquiryDestination(item).toLowerCase().includes(query) ||
      (item.email || "").toLowerCase().includes(query)
    );
  });

  const statCards = [
    {
      title: "Destinations",
      value: stats.destinations,
      icon: "▣",
      color: "blue",
      growth: "Travel locations",
    },
    {
      title: "Packages",
      value: stats.packages,
      icon: "◧",
      color: "purple",
      growth: "Travel packages",
    },
    {
      title: "Enquiries",
      value: stats.enquiries,
      icon: "✉",
      color: "orange",
      growth: "Customer requests",
    },
    {
      title: "Offers",
      value: stats.offers,
      icon: "◇",
      color: "green",
      growth: "Special offers",
    },
  ];

  const quickActions = [
    {
      title: "Add Destination",
      icon: "📍",
      color: "blue",
      path: "/admin/destinations",
    },
    {
      title: "Add Package",
      icon: "🧳",
      color: "purple",
      path: "/admin/packages",
    },
    {
      title: "View Enquiries",
      icon: "✉️",
      color: "orange",
      path: "/admin/enquiries",
    },
    {
      title: "Create Offer",
      icon: "🏷️",
      color: "green",
      path: "/admin/offers",
    },
  ];

  return (
    <div className="ff-admin-layout ff-new-dashboard">

      {/* SIDEBAR */}
      <aside className="ff-sidebar ff-dashboard-sidebar">

        <div className="ff-logo ff-dashboard-logo">
          <div className="ff-logo-icon">✈</div>
          <div>
            <h2>Free<span>fly</span></h2>
            <p>TOURISM & TRAVELS</p>
          </div>
        </div>

        <p className="ff-sidebar-label">ADMIN PANEL</p>

        <nav className="ff-sidebar-nav">
          {menuItems.map((item, index) => (
            <button
              key={item.name}
              type="button"
              className={`ff-nav-item ${index === 0 ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="ff-dashboard-sidebar-bottom">
          <div className="ff-sidebar-travel">
            <span>✈</span>
            <p>Explore the world with Freefly.</p>
          </div>

          <button
            type="button"
            className="ff-logout"
            onClick={handleLogout}
          >
            ⇥ Logout
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="ff-main ff-dashboard-main">

        {/* TOPBAR */}
        <header className="ff-dashboard-topbar">

          <div className="ff-dashboard-search">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search customers or destinations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="ff-dashboard-top-profile">
            <div className="ff-dashboard-notification">♧</div>

            <div className="ff-dashboard-profile-avatar">
              {(adminUser.name || "A").charAt(0).toUpperCase()}
            </div>

            <div className="ff-dashboard-profile-info">
              <strong>{adminUser.name || "Admin"}</strong>
              <span>Administrator</span>
            </div>
          </div>
        </header>

        <div className="ff-dashboard-content">

          {/* WELCOME BANNER */}
          <section className="ff-modern-banner">
            <div className="ff-modern-banner-content">
              <span>YOUR TRAVEL CONTROL CENTER</span>
              <h1>
                Welcome Back, {adminUser.name || "Admin"}! 👋
              </h1>
              <p>
                Manage your travel website and create unforgettable journeys.
              </p>
            </div>

            <div className="ff-modern-banner-plane">✈</div>
          </section>

          {/* STATISTICS */}
          <section className="ff-modern-stats">
            {statCards.map((card) => (
              <div
                className="ff-modern-stat-card"
                key={card.title}
              >
                <div className={`ff-modern-stat-icon ${card.color}`}>
                  {card.icon}
                </div>

                <div className="ff-modern-stat-info">
                  <h2>{loading ? "—" : card.value}</h2>
                  <p>{card.title}</p>
                  <span>{card.growth}</span>
                </div>
              </div>
            ))}
          </section>

          {/* QUICK ACTIONS + RECENT ENQUIRIES */}
          <section className="ff-dashboard-bottom-grid">

            {/* QUICK ACTIONS */}
            <div className="ff-modern-quick-panel">
              <div className="ff-modern-panel-heading">
                <div>
                  <h2><span>ϟ</span> Quick Actions</h2>
                  <p>Quickly access your main management areas.</p>
                </div>
              </div>

              <div className="ff-modern-quick-grid">
                {quickActions.map((action) => (
                  <button
                    type="button"
                    key={action.title}
                    className={`ff-modern-quick-card ${action.color}`}
                    onClick={() => navigate(action.path)}
                  >
                    <span className="ff-modern-quick-icon">
                      {action.icon}
                    </span>
                    <strong>{action.title}</strong>
                  </button>
                ))}
              </div>
            </div>

            {/* RECENT ENQUIRIES */}
            <div className="ff-modern-enquiry-panel">

              <div className="ff-modern-panel-heading enquiry-heading">
                <div>
                  <h2><span>☷</span> Recent Enquiries</h2>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/admin/enquiries")}
                >
                  View All →
                </button>
              </div>

              {loading ? (
                <div className="ff-modern-enquiry-empty">
                  Loading enquiries...
                </div>
              ) : filteredEnquiries.length === 0 ? (
                <div className="ff-modern-enquiry-empty">
                  <span>✉</span>
                  <p>No recent enquiries found.</p>
                </div>
              ) : (
                <div className="ff-modern-enquiry-list">
                  {filteredEnquiries.map((item, index) => (
                    <div
                      className="ff-modern-enquiry-item"
                      key={item.id || item._id || index}
                    >
                      <div className="ff-modern-customer-avatar">
                        {getCustomerName(item).charAt(0).toUpperCase()}
                      </div>

                      <div className="ff-modern-customer-info">
                        <strong>{getCustomerName(item)}</strong>
                        <span>{getEnquiryDestination(item)}</span>
                      </div>

                      <div className="ff-modern-enquiry-time">
                        <span>
                          {formatTime(
                            item.created_at || item.createdAt
                          )}
                        </span>
                        <i></i>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </section>

          {/* FOOTER */}
          <footer className="ff-dashboard-footer">
            © 2026 Freefly Tourism & Travels. All rights reserved.
          </footer>

        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
