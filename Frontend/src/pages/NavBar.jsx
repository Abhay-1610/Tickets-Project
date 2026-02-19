import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from "../features/auth/authSlice";
import { stopSignalR } from "../signalR/signalRService";
import { authApi } from "../features/auth/authApi";
import { adminApi } from "../features/admin/adminApi";
import { ticketsApi } from "../features/tickets/ticketsApi";
import { messagesApi } from "../features/messages/messagesApi";

function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // auth comes ONLY from redux now
  const { userId, role, email } = useSelector((state) => state.auth);

  /* ============================
     BRAND CLICK
  ============================ */
  const handleBrandClick = () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    if (role === "Admin") {
      navigate("/admin/dashboard");
    } else if (role === "Agent") {
      navigate("/agent/dashboard");
    } else {
      navigate("/customer/dashboard");
    }
  };

  /* ============================
     LOGOUT
  ============================ */
  const handleLogout = () => {
     stopSignalR();               // stop realtime connection
    localStorage.clear();        // remove tokens
    dispatch(clearAuth());       // clear redux auth
      // 🔥 reset all RTK Query caches
  dispatch(authApi.util.resetApiState());
  dispatch(adminApi.util.resetApiState());
  dispatch(ticketsApi.util.resetApiState());
  dispatch(messagesApi.util.resetApiState());
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary fixed-top">
      <div className="container-fluid">

        {/* LEFT */}
        <div className="d-flex align-items-center gap-4">
          <span
            className="navbar-brand fw-semibold mb-0"
            style={{ cursor: "pointer" }}
            onClick={handleBrandClick}
          >
            Ticket Support
          </span>

          {role === "Admin" && (
            <Link to="/admin/dashboard" className="nav-link text-light px-0">
              Admin
            </Link>
          )}

          {role === "Agent" && (
            <Link to="/agent/dashboard" className="nav-link text-light px-0">
              Agent
            </Link>
          )}

          {role === "Customer" && (
            <Link to="/customer/dashboard" className="nav-link text-light px-0">
              Customer
            </Link>
          )}
        </div>

        {/* RIGHT */}
        <div className="ms-auto d-flex align-items-center gap-3">
          {userId && (
            <span className="text-white small m-2 p-2">
              Logged in as – <strong>{email}</strong>
            </span>
          )}

          {!userId ? (
            <Link to="/login" className="btn btn-outline-light btn-sm">
              Login
            </Link>
          ) : (
            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}

export default NavBar;
