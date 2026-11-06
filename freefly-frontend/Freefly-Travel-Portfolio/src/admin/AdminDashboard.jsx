import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const adminUser = JSON.parse(
    localStorage.getItem("admin_user") || "{}"
  );

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/admin");
  };

  const cardStyle = {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.06)",
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#0f172a",
        padding: "40px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "40px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "34px",
                fontWeight: "700",
                color: "#0f172a",
              }}
            >
              Dashboard
            </h1>

            <p
              style={{
                marginTop: "10px",
                marginBottom: 0,
                fontSize: "16px",
                color: "#64748b",
              }}
            >
              Welcome back, {adminUser.name || "Admin"}. Manage your
              travel website from here.
            </p>
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              background: "#ffffff",
              color: "#0f172a",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Logout
          </button>
        </div>

        {/* DASHBOARD CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4, minmax(0, 1fr))",
            gap: "22px",
          }}
        >
          {/* DESTINATIONS */}
          <div
            onClick={() => navigate("/admin/destinations")}
            style={cardStyle}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "#f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "22px",
                fontSize: "22px",
              }}
            >
              📍
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                fontSize: "20px",
                fontWeight: "700",
              }}
            >
              Destinations
            </h2>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              Manage travel destinations
            </p>

            <div
              style={{
                marginTop: "24px",
                color: "#1d4ed8",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Manage →
            </div>
          </div>

          {/* PACKAGES */}
          <div
            onClick={() => navigate("/admin/packages")}
            style={cardStyle}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "#f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "22px",
                fontSize: "22px",
              }}
            >
              🧳
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                fontSize: "20px",
                fontWeight: "700",
              }}
            >
              Packages
            </h2>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              Manage travel packages
            </p>

            <div
              style={{
                marginTop: "24px",
                color: "#1d4ed8",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Manage →
            </div>
          </div>

          {/* ENQUIRIES */}
          <div
            onClick={() => navigate("/admin/enquiries")}
            style={cardStyle}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "#f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "22px",
                fontSize: "22px",
              }}
            >
              ✉️
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                fontSize: "20px",
                fontWeight: "700",
              }}
            >
              Enquiries
            </h2>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              View customer enquiries
            </p>

            <div
              style={{
                marginTop: "24px",
                color: "#1d4ed8",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Manage →
            </div>
          </div>

          {/* OFFERS */}
          <div
            onClick={() => navigate("/admin/offers")}
            style={cardStyle}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "#f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "22px",
                fontSize: "22px",
              }}
            >
              🏷️
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                fontSize: "20px",
                fontWeight: "700",
              }}
            >
              Offers
            </h2>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              Manage special offers
            </p>

            <div
              style={{
                marginTop: "24px",
                color: "#1d4ed8",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Manage →
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div
          style={{
            marginTop: "32px",
            background: "#ffffff",
            padding: "28px",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)",
          }}
        >
          <h2
            style={{
              margin: "0 0 8px",
              fontSize: "20px",
            }}
          >
            Quick Actions
          </h2>

          <p
            style={{
              margin: "0 0 22px",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Quickly access the main content management areas.
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate("/admin/destinations")}
              style={quickButtonStyle}
            >
              + Add Destination
            </button>

            <button
              onClick={() => navigate("/admin/packages")}
              style={quickButtonStyle}
            >
              Manage Packages
            </button>

            <button
              onClick={() => navigate("/admin/enquiries")}
              style={quickButtonStyle}
            >
              View Enquiries
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const quickButtonStyle = {
  padding: "11px 18px",
  background: "#ffffff",
  color: "#0f172a",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
};

export default AdminDashboard;