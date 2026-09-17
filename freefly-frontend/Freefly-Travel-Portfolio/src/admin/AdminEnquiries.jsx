import { useEffect, useState } from "react";
import { Trash2, RefreshCw, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AdminEnquiries() {
  const navigate = useNavigate();

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("admin_token");

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

  const pageStyle = {
    minHeight: "100vh",
    background: "#f8fafc",
    color: "#0f172a",
    padding: "40px",
    boxSizing: "border-box",
  };

  const containerStyle = {
    maxWidth: "1400px",
    margin: "0 auto",
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>

        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "32px",
            gap: "20px",
          }}
        >
          <div>
            <button
              onClick={() => navigate("/admin/dashboard")}
              style={{
                border: "none",
                background: "transparent",
                color: "#64748b",
                padding: 0,
                cursor: "pointer",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "18px",
              }}
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>

            <h1
              style={{
                margin: 0,
                fontSize: "34px",
                fontWeight: "700",
                color: "#0f172a",
              }}
            >
              Enquiries
            </h1>

            <p
              style={{
                margin: "10px 0 0",
                fontSize: "16px",
                color: "#64748b",
              }}
            >
              View and manage customer enquiries.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchEnquiries}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              background: "#ffffff",
              color: "#0f172a",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* CONTENT CARD */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)",
            overflow: "hidden",
          }}
        >
          {loading && (
            <div
              style={{
                padding: "50px",
                textAlign: "center",
                color: "#64748b",
              }}
            >
              Loading enquiries...
            </div>
          )}

          {!loading && error && (
            <div
              style={{
                padding: "50px",
                textAlign: "center",
                color: "#dc2626",
              }}
            >
              {error}
            </div>
          )}

          {!loading && !error && enquiries.length === 0 && (
            <div
              style={{
                padding: "60px",
                textAlign: "center",
                color: "#64748b",
              }}
            >
              <h3
                style={{
                  margin: "0 0 8px",
                  color: "#0f172a",
                }}
              >
                No enquiries yet
              </h3>

              <p style={{ margin: 0 }}>
                Customer enquiries will appear here.
              </p>
            </div>
          )}

          {!loading && !error && enquiries.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "1100px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#f8fafc",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    {[
                      "Customer",
                      "Contact",
                      "Destination",
                      "Package",
                      "Travel Date",
                      "Travellers",
                      "Message",
                      "Status",
                      "Received",
                      "Action",
                    ].map((heading) => (
                      <th
                        key={heading}
                        style={{
                          padding: "16px",
                          textAlign: "left",
                          fontSize: "13px",
                          fontWeight: "700",
                          color: "#475569",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {enquiries.map((enquiry) => (
                    <tr
                      key={enquiry.id}
                      style={{
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      <td
                        style={{
                          padding: "18px 16px",
                          fontWeight: "600",
                          color: "#0f172a",
                        }}
                      >
                        {enquiry.name}
                      </td>

                      <td
                        style={{
                          padding: "18px 16px",
                          color: "#475569",
                        }}
                      >
                        <div>{enquiry.email}</div>
                        <small
                          style={{
                            display: "block",
                            marginTop: "5px",
                            color: "#64748b",
                          }}
                        >
                          {enquiry.phone}
                        </small>
                      </td>

                      <td
                        style={{
                          padding: "18px 16px",
                          color: "#475569",
                        }}
                      >
                        {enquiry.destination || "—"}
                      </td>

                      <td
                        style={{
                          padding: "18px 16px",
                          color: "#475569",
                        }}
                      >
                        {enquiry.package || "—"}
                      </td>

                      <td
                        style={{
                          padding: "18px 16px",
                          color: "#475569",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {enquiry.travel_date || "—"}
                      </td>

                      <td
                        style={{
                          padding: "18px 16px",
                          color: "#475569",
                          textAlign: "center",
                        }}
                      >
                        {enquiry.travellers || "—"}
                      </td>

                      <td
                        style={{
                          padding: "18px 16px",
                          color: "#475569",
                          maxWidth: "280px",
                          lineHeight: "1.5",
                        }}
                      >
                        {enquiry.message || "—"}
                      </td>

                      <td style={{ padding: "18px 16px" }}>
                        <select
                          value={enquiry.status}
                          onChange={(event) =>
                            updateStatus(
                              enquiry.id,
                              event.target.value
                            )
                          }
                          style={{
                            padding: "8px 10px",
                            borderRadius: "7px",
                            border: "1px solid #cbd5e1",
                            background: "#ffffff",
                            color: "#0f172a",
                            fontSize: "13px",
                            fontWeight: "600",
                            cursor: "pointer",
                          }}
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

                      <td
                        style={{
                          padding: "18px 16px",
                          color: "#64748b",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {new Date(
                          enquiry.created_at
                        ).toLocaleDateString()}
                      </td>

                      <td style={{ padding: "18px 16px" }}>
                        <button
                          type="button"
                          onClick={() =>
                            deleteEnquiry(enquiry.id)
                          }
                          title="Delete enquiry"
                          style={{
                            width: "36px",
                            height: "36px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid #fecaca",
                            borderRadius: "8px",
                            background: "#fff",
                            color: "#dc2626",
                            cursor: "pointer",
                          }}
                        >
                          <Trash2 size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminEnquiries;