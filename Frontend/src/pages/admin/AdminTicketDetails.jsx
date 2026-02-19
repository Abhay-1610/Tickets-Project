import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetTicketByIdQuery } from "../../features/tickets/ticketsApi";

function AgentTicketDetails() {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const { data: ticket, isLoading, isError } =
    useGetTicketByIdQuery(ticketId);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB");

  if (isLoading) {
    return <div className="p-4 text-muted">Loading ticket details...</div>;
  }

  if (isError || !ticket) {
    return <div className="p-4 text-danger">Ticket not found</div>;
  }

  return (
    <div
      className="container-fluid px-4"
      style={{ backgroundColor: "#f5f2ed", minHeight: "100vh" }}
    >
      {/* HEADER */}
      <div className="pt-4 pb-3">
        <h2 className="fw-bold text-dark mb-1">Ticket Details</h2>
        <p className="text-muted mb-0">Ticket ID: {ticket.id}</p>
      </div>

      <div className="row">
        {/* LEFT */}
        <div className="col-md-8">
          <div
            className="card shadow-sm mb-4"
            style={{ borderRadius: "12px", border: "1px solid #ddd" }}
          >
            <div className="card-body">
              <h5 className="fw-semibold mb-3">{ticket.title}</h5>

              <div className="mb-3">
                <div className="text-muted small mb-1">Description</div>
                <div>{ticket.description}</div>
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className="text-muted small">Status</div>
                  <span className="badge bg-dark">{ticket.status}</span>
                </div>

                <div className="col-md-4">
                  <div className="text-muted small">Created On</div>
                  <div>{formatDate(ticket.createdAt)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="d-flex gap-2">
           <button
              className="btn btn-outline-dark"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </div>
        </div>

        {/* RIGHT: SCREENSHOT */}
        <div className="col-md-4">
          <div
            className="card shadow-sm"
            style={{
              borderRadius: "12px",
              border: "1px solid #ddd",
              height: "100%",
            }}
          >
            <div className="card-body d-flex flex-column">
              <h6 className="fw-semibold mb-3">Screenshot</h6>

              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  flex: 1,
                  minHeight: "260px",
                  border: "1px dashed #ccc",
                  borderRadius: "8px",
                  backgroundColor: "#fafafa",
                }}
              >
                {ticket.initialScreenshotUrl ? (
                  <img
                    src={ticket.initialScreenshotUrl}
                    alt="Ticket Screenshot"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "240px",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <span className="badge bg-secondary">
                    No screenshot attached
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentTicketDetails;
