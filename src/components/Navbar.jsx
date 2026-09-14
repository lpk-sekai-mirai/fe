import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex space-x-4">
        <Link to="/dashboard" className="hover:underline">
          Dashboard
        </Link>{" "}
        {/* ✅ route ada */}
        <Link to="/students" className="hover:underline">
          Siswa
        </Link>
        {user.role === "admin" && (
          <Link to="/users" className="hover:underline">
            Users
          </Link>
        )}
      </div>
      <div>
        <span className="mr-4">
          {user.username} ({user.role})
        </span>
        <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
