import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedAdminRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem("admin_token");

      // No token ΓåÆ go to login
      if (!token) {
        setAuthenticated(false);
        setChecking(false);
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/admin/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_user");

          setAuthenticated(false);
          setChecking(false);
          return;
        }

        const admin = await response.json();

        // Keep the latest admin information
        localStorage.setItem(
          "admin_user",
          JSON.stringify(admin)
        );

        setAuthenticated(true);
      } catch (error) {
        console.error("Admin authentication check failed:", error);

        setAuthenticated(false);
      } finally {
        setChecking(false);
      }
    };

    verifyAdmin();
  }, []);

  if (checking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#111827",
          background: "#f5f7fa",
        }}
      >
        Checking authentication...
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;
