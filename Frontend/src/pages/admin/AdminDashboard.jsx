import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllTicketsQuery } from "../../features/admin/adminApi";

function AdminDashboard() {
  const navigate = useNavigate();
  const { data: tickets = [] } = useGetAllTicketsQuery();

  const openCount = tickets.filter(t => t.status === "Open").length;
  const inProgressCount = tickets.filter(t => t.status === "InProgress").length;
  const closedCount = tickets.filter(t => t.status === "Closed").length;

  return (
    <div
      className="container-fluid px-4"
      style={{ backgroundColor: "#f5f2ed", minHeight: "100vh" }}
    >
      {/* PAGE HEADER */}
      <div className="pt-4 pb-3">
        <h2 className="fw-bold text-dark mb-1">Admin Dashboard</h2>
        <p className="text-muted mb-0">
          System overview and administrative controls
        </p>
      </div>

      {/* PRIMARY ACTION */}
      <div
        className="card mb-4 shadow-sm"
        style={{ borderRadius: "12px", border: "1px solid #ddd" }}
      >
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h5 className="fw-semibold text-dark mb-1">
              Administration Panel
            </h5>
            <p className="text-muted mb-0">
              Manage users, monitor tickets, and review audit activity.
            </p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div
            className="card shadow-sm text-center"
            style={{ borderRadius: "12px", border: "1px solid #ddd" }}
          >
            <div className="card-body">
              <h6 className="text-muted">Open Tickets</h6>
              <h2 className="fw-bold">{openCount}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card shadow-sm text-center"
            style={{ borderRadius: "12px", border: "1px solid #ddd" }}
          >
            <div className="card-body">
              <h6 className="text-muted">In Progress</h6>
              <h2 className="fw-bold">{inProgressCount}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card shadow-sm text-center"
            style={{ borderRadius: "12px", border: "1px solid #ddd" }}
          >
            <div className="card-body">
              <h6 className="text-muted">Closed Tickets</h6>
              <h2 className="fw-bold">{closedCount}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION CARDS */}
      <div className="row">
        <div className="col-md-4">
          <div
            className="card shadow-sm h-100"
            style={{ borderRadius: "12px", border: "1px solid #ddd", cursor: "pointer" }}
            onClick={() => navigate("/admin/users")}
          >
            <div className="card-body">
              <h5 className="fw-semibold">User Management</h5>
              <p className="text-muted mb-0">
                Create agents, block or unblock users.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card shadow-sm h-100"
            style={{ borderRadius: "12px", border: "1px solid #ddd", cursor: "pointer" }}
            onClick={() => navigate("/admin/tickets")}
          >
            <div className="card-body">
              <h5 className="fw-semibold">Ticket Monitoring</h5>
              <p className="text-muted mb-0">
                View and manage all system tickets.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card shadow-sm h-100"
            style={{ borderRadius: "12px", border: "1px solid #ddd", cursor: "pointer" }}
            onClick={() => navigate("/admin/audit-logs")}
          >
            <div className="card-body">
              <h5 className="fw-semibold">Audit Logs</h5>
              <p className="text-muted mb-0">
                Review system activity and security events.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
