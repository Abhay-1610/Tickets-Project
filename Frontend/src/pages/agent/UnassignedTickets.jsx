import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetAllTicketsQuery,
  useAssignTicketMutation,
  useUpdateTicketStatusMutation, // ✅ MISSING BEFORE
} from "../../features/admin/adminApi";

function AgentUnassignedTickets() {
  const navigate = useNavigate();

  // fetch all tickets
  const { data: tickets = [], isLoading } = useGetAllTicketsQuery();

  // mutations
  const [assignTicket, { isLoading: isAssigning }] =
    useAssignTicketMutation();
  const [updateStatus] = useUpdateTicketStatusMutation();

  // search filter
  const [search, setSearch] = useState("");

  // unassigned = only OPEN tickets
  const unassignedTickets = tickets.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.customerEmail.toLowerCase().includes(search.toLowerCase());

    return t.status === "Open" && matchesSearch;
  });

  // assign + move to InProgress
  const handleAssign = async (ticketId) => {
    try {
      // 1️⃣ assign agent
      await assignTicket(ticketId).unwrap();

      // 2️⃣ update status
      await updateStatus({
        ticketId,
        status: "InProgress",
      }).unwrap();
    } catch (err) {
      console.error("Handle ticket failed", err);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB");

  return (
    <div
      className="container-fluid px-4"
      style={{ backgroundColor: "#f5f2ed", minHeight: "100vh" }}
    >
      {/* HEADER */}
      <div className="pt-4 pb-3">
        <h2 className="fw-bold text-dark mb-1">
          Unassigned Tickets
        </h2>
        <p className="text-muted mb-0">
          Tickets waiting for an agent to take ownership
        </p>
      </div>

      {/* TABLE */}
      <div
        className="card shadow-sm"
        style={{ borderRadius: "12px", border: "1px solid #ddd" }}
      >
        <div className="card-body">
          <h5 className="fw-semibold mb-3">
            Available Tickets
          </h5>

          {/* SEARCH */}
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Search by title or customer email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-muted">Loading tickets...</div>
          ) : unassignedTickets.length === 0 ? (
            <div className="text-muted fst-italic">
              No unassigned tickets available.
            </div>
          ) : (
            <>
              {/* TABLE HEADER */}
              <div className="row fw-semibold text-muted border-bottom pb-2 mb-2">
                <div className="col-md-3">Title</div>
                <div className="col-md-3">Customer</div>
                <div className="col-md-2">Status</div>
                <div className="col-md-2">Created</div>
                <div className="col-md-2 text-end">
                  Actions
                </div>
              </div>

              {/* ROWS */}
              {unassignedTickets.map((t) => (
                <div
                  key={t.id}
                  className="row align-items-center py-2 border-bottom"
                >
                  <div className="col-md-3 fw-semibold">
                    {t.title}
                  </div>

                  <div className="col-md-3 text-muted">
                    {t.customerEmail}
                  </div>

                  <div className="col-md-2">
                    <span className="badge bg-success">
                      {t.status}
                    </span>
                  </div>

                  <div className="col-md-2 text-muted">
                    {formatDate(t.createdAt)}
                  </div>

                  <div className="col-md-2 d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-outline-dark btn-sm"
                      onClick={() =>
                        navigate(`/agent/ticketdetails/${t.id}`)
                      }
                    >
                      View
                    </button>

                    <button
                      className="btn btn-dark btn-sm"
                      disabled={isAssigning}
                      onClick={() => handleAssign(t.id)}
                    >
                      Handle
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

export default AgentUnassignedTickets;
