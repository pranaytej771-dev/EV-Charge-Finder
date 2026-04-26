import { Link, useLocation } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";

function Header({ currentUser, onLogout, toggleTheme, theme }) {
  const location = useLocation();

  return (
    <div className="floating-controls">
      <button 
        type="button" 
        className="theme-toggle" 
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? <FaMoon /> : <FaSun />}
      </button>

      {currentUser ? (
        <>
          <div className="divider"></div>
          <p className="user-info">
            {currentUser.name}
          </p>
          <div className="divider"></div>
          <button type="button" className="text-button" onClick={onLogout}>
            Logout
          </button>
        </>
      ) : (
        location.pathname !== '/login' && (
          <>
            <div className="divider"></div>
            <Link to="/login" className="text-button">
              Login
            </Link>
          </>
        )
      )}
    </div>
  );
}

export default Header;
