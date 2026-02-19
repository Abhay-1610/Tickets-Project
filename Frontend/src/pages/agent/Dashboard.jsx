import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div
      className="container-fluid px-4"
      style={{ backgroundColor: "#f5f2ed", minHeight: "100vh" }}
    >
      {/* HEADER */}
      <div className="pt-4 pb-3">
        <h2 className="fw-bold text-dark mb-1">Agent Dashboard</h2>
        <p className="text-muted mb-0">
          Manage your workload and support tickets
        </p>
      </div>

      {/* NAVIGATION CARDS */}
      <div className="row g-4 mt-2">
       

        {/* UNASSIGNED */}
        <div className="col-md-4">
          <div
            className="card shadow-sm h-100"
            style={{
              borderRadius: "12px",
              border: "1px solid #ddd",
              cursor: "pointer",
            }}
            onClick={() => navigate("/agent/tickets/unassigned")}
          >
            <div className="card-body">
              <h5 className="fw-semibold">Unassigned Tickets</h5>
              <p className="text-muted mb-0">
                Pick new tickets to start working on.
              </p>
            </div>
          </div>
        </div>

         {/* MY TICKETS */}
        <div className="col-md-4">
          <div
            className="card shadow-sm h-100"
            style={{
              borderRadius: "12px",
              border: "1px solid #ddd",
              cursor: "pointer",
            }}
            onClick={() => navigate("/agent/tickets/my")}
          >
            <div className="card-body">
              <h5 className="fw-semibold">My Assigned Tickets</h5>
              <p className="text-muted mb-0">
                Tickets currently assigned to you.
              </p>
            </div>
          </div>
        </div>

        {/* COMPLETED */}
        <div className="col-md-4">
          <div
            className="card shadow-sm h-100"
            style={{
              borderRadius: "12px",
              border: "1px solid #ddd",
              cursor: "pointer",
            }}
            onClick={() => navigate("/agent/tickets/completed")}
          >
            <div className="card-body">
              <h5 className="fw-semibold">Completed Tickets</h5>
              <p className="text-muted mb-0">
                Tickets you have already resolved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

