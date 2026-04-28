import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import api from "./api/apiClient.js";
import Header from "./components/Header.jsx";
import {
  clearAuthSession,
  getStoredUser,
  saveAuthSession
} from "./utils/authStorage.js";

import HomePage from "./pages/HomePage.jsx";
import EvFinderPage from "./pages/EvFinderPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";

const getRoleFromToken = (token) => {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;

    const normalizedBase64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = normalizedBase64.padEnd(
      normalizedBase64.length + ((4 - (normalizedBase64.length % 4)) % 4),
      "="
    );
    const payload = JSON.parse(atob(paddedBase64));
    return payload.role || null;
  } catch (_error) {
    return null;
  }
};

function AppContent() {
  const [currentUser, setCurrentUser] = useState(getStoredUser);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const completeLoginSession = async (data, pendingSearch) => {
    const roleFromToken = getRoleFromToken(data.token);
    const authenticatedUser = {
      ...data.user,
      role: roleFromToken || data.user?.role || "user"
    };

    saveAuthSession({
      token: data.token,
      user: authenticatedUser
    });
    setCurrentUser(authenticatedUser);
    
    if (pendingSearch) {
      sessionStorage.setItem('pendingSearch', JSON.stringify(pendingSearch));
    }
  };

  const handleLogin = async (credentials, pendingSearch) => {
    try {
      const { data } = await api.post("/auth/login", credentials);
      await completeLoginSession(data, pendingSearch);
    } catch (requestError) {
      throw new Error(
        requestError.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  const handleRegister = async (payload, pendingSearch) => {
    try {
      const { data } = await api.post("/auth/register", payload);
      await completeLoginSession(data, pendingSearch);
    } catch (requestError) {
      throw new Error(
        requestError.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    setCurrentUser(null);
  };

  return (
    <div className="app-shell">
      <div className="background-glow background-glow-one" />
      <div className="background-glow background-glow-two" />

      <main className="page-wrapper">
        <Header 
          currentUser={currentUser} 
          onLogout={handleLogout} 
          toggleTheme={toggleTheme} 
          theme={theme} 
        />
        
        <div className="page-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/app" element={<EvFinderPage currentUser={currentUser} />} />
            <Route 
              path="/login" 
              element={<AuthPage onLogin={handleLogin} onRegister={handleRegister} />} 
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
