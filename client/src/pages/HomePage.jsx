import React from "react";
import { Link } from "react-router-dom";
import { FaSearchLocation, FaMapMarkedAlt, FaBolt, FaCarSide } from "react-icons/fa";
import { MdOutlineEvStation, MdMyLocation, MdCheckCircle } from "react-icons/md";

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Smart EV Charging Stations Near You</h1>
          <p className="hero-subtitle">
            Discover Nearby EV Charging Stations Instantly. Plan your journey, check real-time availability, and find the best spots for your electric vehicle.
          </p>
          <div className="hero-actions">
            <Link to="/app" className="primary-cta-button">
              Get Started <FaBolt />
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose ElectroMap?</h2>
          <p>Everything you need to keep your journey fully charged.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><FaSearchLocation /></div>
            <h3>Smart Search</h3>
            <p>Easily find charging stations near you or at any specific destination.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><MdOutlineEvStation /></div>
            <h3>Real-time Availability</h3>
            <p>Know which stations are available, busy, or offline before you arrive.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaCarSide /></div>
            <h3>EV Compatibility</h3>
            <p>Filter stations by connector types matching your specific EV model.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaMapMarkedAlt /></div>
            <h3>Map Navigation</h3>
            <p>Interactive maps with detailed views to help you navigate effortlessly.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Get charged up in three simple steps.</p>
        </div>
        <div className="steps-container">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-icon"><FaCarSide /></div>
            <h3>Select your EV</h3>
            <p>Choose your electric vehicle to see compatible stations.</p>
          </div>
          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-icon"><MdMyLocation /></div>
            <h3>Enter Location</h3>
            <p>Use your current location or search for a specific area.</p>
          </div>
          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-icon"><MdCheckCircle /></div>
            <h3>Find Best Stations</h3>
            <p>Review availability, navigate, and start charging.</p>
          </div>
        </div>
      </section>

      <footer className="footer-section">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="brand-tag">ElectroMap</span>
            <p>Empowering the electric revolution, one charge at a time.</p>
          </div>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/app">Find Stations</Link>
            <Link to="/login">Login</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ElectroMap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
