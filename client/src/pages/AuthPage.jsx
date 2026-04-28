import React, { useState, useEffect } from "react";
import LoginPage from "../components/auth/LoginPage.jsx";
import RegisterPage from "../components/auth/RegisterPage.jsx";
import { useLocation, useNavigate } from "react-router-dom";

const AuthPage = ({ onLogin, onRegister }) => {
  const [authView, setAuthView] = useState("login");
  const location = useLocation();
  const navigate = useNavigate();

  const message = location.state?.message || "";
  const pendingSearch = location.state?.pendingSearch || null;

  const handleLoginWrapper = async (credentials) => {
    await onLogin(credentials, pendingSearch);
    navigate("/app");
  };

  const handleRegisterWrapper = async (credentials) => {
    await onRegister(credentials, pendingSearch);
    navigate("/app");
  };

  return (
    <div className="page auth-page-container fade-in">
      <div className="auth-wrapper">
        {message && <p className="info-banner slide-down">{message}</p>}

        {authView === "register" ? (
          <RegisterPage
            onRegister={handleRegisterWrapper}
            onSwitchToLogin={() => setAuthView("login")}
          />
        ) : (
          <LoginPage
            onLogin={handleLoginWrapper}
            onSwitchToRegister={() => setAuthView("register")}
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
