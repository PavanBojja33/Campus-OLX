import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";
import Button from "./Button";
import Modal from "./Modal";
import { useState } from "react";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  function handleLogoutConfirm() {
    logout();
    setShowLogoutModal(false);
    toast.success("Logged out successfully");
    navigate("/");
  }

  const isOnMarketplace = location.pathname.startsWith("/marketplace");

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to={isAuthenticated ? "/marketplace" : "/"}
            className="text-2xl font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            Campus OLX
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated && !isOnMarketplace && (
              <Link
                to="/marketplace"
                className="hidden md:inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border border-primary-100 dark:border-primary-900 text-primary-700 dark:text-primary-300 bg-primary-50/80 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/60 transition-colors"
              >
                Browse Marketplace
              </Link>
            )}

            {isAuthenticated && (
              <Link
                to="/add-item"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Sell Item
              </Link>
            )}

            {isAuthenticated && (
              <Link
                to="/profile"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Profile
              </Link>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {user && (
                  <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:block max-w-[140px] truncate">
                    {user.name || user.email}
                  </span>
                )}
                <Button variant="ghost" size="sm" onClick={() => setShowLogoutModal(true)}>
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Logout"
        size="sm"
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Are you sure you want to logout from your Campus OLX account?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogoutConfirm}>
            Logout
          </Button>
        </div>
      </Modal>
    </nav>
  );
}

export default Navbar;
