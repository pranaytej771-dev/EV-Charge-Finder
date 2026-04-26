import { useState } from "react";
import { FaSignInAlt, FaSpinner, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

function LoginPage({ onLogin, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isFormComplete = formData.email.trim() !== "" && formData.password !== "";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onLogin({
        email: formData.email.trim(),
        password: formData.password
      });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel auth-panel premium-glass-panel">
      <div className="auth-background-glow"></div>
      
      <div className="panel-heading text-center">
        <h3 className="gradient-heading">Welcome Back</h3>
        <p className="auth-subtitle">Log in to manage your EV stations</p>
      </div>

      <form className="station-form auth-form-modern" onSubmit={handleSubmit}>
        <div className="input-group-modern">
          <label>Email Address</label>
          <div className="input-wrapper">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="premium-input"
            />
          </div>
        </div>

        <div className="input-group-modern">
          <label>Password</label>
          <div className="input-wrapper">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              className="premium-input"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {error ? <div className="error-banner slide-down">{error}</div> : null}

        <div className="auth-actions">
          <button 
            type="submit" 
            className="auth-submit-button pill-button" 
            disabled={loading || !isFormComplete}
          >
            {loading ? (
              <><FaSpinner className="spin-icon" /> Logging in...</>
            ) : (
              <><FaSignInAlt /> Login</>
            )}
          </button>
        </div>

        <div className="auth-footer text-center">
          <p>
            Don't have an account?{" "}
            <button
              type="button"
              className="switch-auth-link"
              onClick={onSwitchToRegister}
              disabled={loading}
            >
              Create one
            </button>
          </p>
        </div>
      </form>
    </section>
  );
}

export default LoginPage;
