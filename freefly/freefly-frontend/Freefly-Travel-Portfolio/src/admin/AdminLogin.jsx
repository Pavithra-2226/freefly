
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Invalid email or password.");
      }

      localStorage.setItem("admin_token", data.access_token);
      localStorage.setItem("admin_user", JSON.stringify(data.admin));

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="freefly-login-page">
      <div className="login-overlay"></div>

      <div className="login-content">
        <div className="login-brand">
          <div className="brand-icon">✈</div>
          <div>
            <h1>Free<span>fly</span></h1>
            <p>TOURISM & TRAVELS</p>
          </div>
        </div>

        <div className="admin-badge">ADMIN PORTAL</div>

        <h2>Welcome Back</h2>
        <p className="login-subtitle">
          Sign in to access the Freefly Admin Panel
        </p>

        {error && (
          <div className="login-error">{error}</div>
        )}

        <form onSubmit={handleLogin}>
          <div className="login-input-group">
            <span className="input-icon">✉</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              required
            />
          </div>

          <div className="login-input-group">
            <span className="input-icon">♙</span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
            {!loading && <span>→</span>}
          </button>
        </form>

        <p className="login-footer">
          © 2026 Freefly Tourism & Travels
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
