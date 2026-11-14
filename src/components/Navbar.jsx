import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        <h1>
          Job<span>Track</span>
        </h1>
      </Link>
      <div className="navbar-links">
        {user ? (
          <>
            <span>{user.user_metadata.name}</span>
            <Link to="/jobs">My Applications</Link>
            <Link to="/add-job">Add Job</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
