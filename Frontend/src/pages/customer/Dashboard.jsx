import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetMyTicketsQuery } from "../../features/tickets/ticketsApi";

function Dashboard() {
  const navigate = useNavigate();
  const { data: tickets = [], isLoading } = useGetMyTicketsQuery();

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB"); // DD/MM/YYYY
  };

  return (
    <div
      className="container-fluid px-4"
      style={{ backgroundColor: "#f5f2ed", minHeight: "100vh" }}
    >
      {/* PAGE HEADER */}
      <div className="pt-4 pb-3">
        <h2 className="fw-bold text-dark mb-1">Customer Dashboard</h2>
        <p className="text-muted mb-0">
          Overview of your support activity
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
              Create a new support ticket
            </h5>
            <p className="text-muted mb-0">
              Need help? Start a conversation with our support team.
            </p>
          </div>

          <button
            className="btn btn-dark px-4"
            onClick={() => navigate("/customer/tickets/create")}
          >
            + Create Ticket
          </button>
        </div>
      </div>

      {/* ALL TICKETS */}
      <div
        className="card shadow-sm"
        style={{ borderRadius: "12px", border: "1px solid #ddd" }}
      >
        <div className="card-body">
          <h5 className="fw-semibold text-dark mb-3">My Tickets</h5>

          {isLoading ? (
            <div className="text-muted">Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="text-muted fst-italic">
              You haven’t created any tickets yet.
            </div>
          ) : (
            <>
              {/* TABLE HEADER */}
              <div className="row fw-semibold text-muted border-bottom pb-2 mb-2">
                <div className="col-md-5">Title</div>
                <div className="col-md-2">Status</div>
                <div className="col-md-2">Created At</div>
                <div className="col-md-3 text-end">Actions</div>
              </div>

              {/* TABLE ROWS */}
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="row align-items-center py-2 border-bottom"
                >
                  {/* TITLE */}
                  <div className="col-md-5 fw-semibold text-dark">
                    {ticket.title}
                  </div>

                  {/* STATUS */}
                  <div className="col-md-2">
                    <span className="badge bg-success">
                      {ticket.status}
                    </span>
                  </div>

                  {/* DATE */}
                  <div className="col-md-2 text-muted">
                    {formatDate(ticket.createdAt)}
                  </div>

                  {/* ACTIONS */}
                  <div className="col-md-3 d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-dark btn-sm"
                      onClick={() =>
                        navigate(`/customer/ticketchat/${ticket.id}`)
                      }
                    >
                      Go to Chat
                    </button>

                    <button
                      className="btn btn-outline-dark btn-sm"
                      onClick={() =>
                        navigate(`/customer/ticketdetails/${ticket.id}`)
                      }
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
