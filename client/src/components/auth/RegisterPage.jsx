import { useState } from "react";
import { FaUserPlus, FaSpinner, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";

function RegisterPage({ onRegister, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isFormComplete = formData.name.trim() !== "" && formData.email.trim() !== "" && formData.password !== "";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onRegister({
        name: formData.name.trim(),
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
        <h3 className="gradient-heading">Create Account</h3>
        <p className="auth-subtitle">Join ElectroMap to find stations instantly</p>
      </div>

      <form className="station-form auth-form-modern" onSubmit={handleSubmit}>
        <div className="input-group-modern">
          <label>Full Name</label>
          <div className="input-wrapper">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              className="premium-input"
            />
          </div>
        </div>

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
              placeholder="Create password"
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
              <><FaSpinner className="spin-icon" /> Creating Account...</>
            ) : (
              <><FaUserPlus /> Create Account</>
            )}
          </button>
        </div>

        <div className="auth-footer text-center">
          <p>
            Already have an account?{" "}
            <button
              type="button"
              className="switch-auth-link"
              onClick={onSwitchToLogin}
              disabled={loading}
            >
              Login
            </button>
          </p>
        </div>
      </form>
    </section>
  );
}

export default RegisterPage;
