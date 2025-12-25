import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";


function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    if (!window.confirm("Are you sure you want to logout?")) return;
    logout();
    toast.success("Logged out");
    navigate("/login");
    }


  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <NavLink
            to="/marketplace"
            className={({ isActive }) =>
                isActive
                ? "text-blue-600 font-semibold"
                : "text-gray-600 hover:text-blue-600"
            }
            >
            Marketplace
        </NavLink>

        <Link to="/my-listings">My Listings</Link>


      <div className="flex items-center gap-4">
        {!token ? (
          <>
            <Link to="/login" className="text-gray-600 hover:text-blue-600">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/marketplace"
              className="text-gray-600 hover:text-blue-600"
            >
              Marketplace
            </Link>
            <Link
              to="/add-item"
              className="text-gray-600 hover:text-blue-600"
            >
              Add Item
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
