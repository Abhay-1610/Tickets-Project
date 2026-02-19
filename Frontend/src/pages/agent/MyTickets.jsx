import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllTicketsQuery } from "../../features/admin/adminApi";
import { useSelector } from "react-redux";

function AgentMyTickets() {
  const navigate = useNavigate();
  const { data: tickets = [], isLoading } =
    useGetAllTicketsQuery();

  const agentId = useSelector((s) => s.auth.userId);
  const [search, setSearch] = useState("");

  /* =========================
     FILTER + SORT
  ========================= */
  const myTickets = useMemo(() => {
    return tickets
      .filter((t) => {
        const matchesSearch =
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.customerEmail
            .toLowerCase()
            .includes(search.toLowerCase());

        const isPrimary =
          t.primaryAgentId === agentId;

        const isSecondary =
          t.secondaryAgentIds?.includes(agentId);

        return (
          (isPrimary || isSecondary) &&
          t.status !== "Closed" &&
          matchesSearch
        );
      })
      .sort((a, b) => {
        // Primary tickets first
        const aPrimary =
          a.primaryAgentId === agentId ? 1 : 0;
        const bPrimary =
          b.primaryAgentId === agentId ? 1 : 0;

        return bPrimary - aPrimary;
      });
  }, [tickets, agentId, search]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB");

  const getRoleBadge = (ticket) => {
    if (ticket.primaryAgentId === agentId) {
      return (
        <span className="badge bg-dark">
          Primary
        </span>
      );
    }

    if (
      ticket.secondaryAgentIds?.includes(agentId)
    ) {
      return (
        <span className="badge bg-secondary">
          Secondary
        </span>
      );
    }

    return null;
  };

  const statusBadge = (status) => {
    switch (status) {
      case "InProgress":
        return "bg-warning text-dark";
      case "Open":
        return "bg-secondary";
      default:
        return "bg-success";
    }
  };

  return (
    <div
      className="container-fluid px-4"
      style={{
        backgroundColor: "#f5f2ed",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <div className="pt-4 pb-3">
        <h2 className="fw-bold mb-1">
          My Assigned Tickets
        </h2>
        <p className="text-muted mb-0">
          Primary (Owner) and Secondary
          (Collaborator) tickets
        </p>
      </div>

      <div
        className="card shadow-sm"
        style={{
          borderRadius: 12,
          border: "1px solid #ddd",
        }}
      >
        <div className="card-body">
          {/* SEARCH */}
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Search by title or customer email"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          {isLoading ? (
            <div className="text-muted">
              Loading tickets...
            </div>
          ) : myTickets.length === 0 ? (
            <div className="text-muted fst-italic">
              No active tickets assigned.
            </div>
          ) : (
            <>
              {/* TABLE HEADER */}
              <div className="row fw-semibold text-muted border-bottom pb-2 mb-2">
                <div className="col-md-3">
                  Title
                </div>
                <div className="col-md-3">
                  Customer
                </div>
                <div className="col-md-2">
                  Status
                </div>
                <div className="col-md-2">
                  Role
                </div>
                <div className="col-md-2 text-end">
                  Actions
                </div>
              </div>

              {/* ROWS */}
              {myTickets.map((t) => (
                <div
                  key={t.id}
                  className="row align-items-center py-2 border-bottom"
                >
                  <div className="col-md-3">
  <div className="fw-semibold">
    {t.title}
  </div>

  {/* Collaborators */}
  {t.secondaryAgentEmails?.length > 0 && (
    <div className="small text-muted">
      <span className="fw-semibold">
        Collaborators:
      </span>{" "}
      {t.secondaryAgentEmails.join(", ")}
    </div>
  )}
</div>


                  <div className="col-md-3 text-muted">
                    {t.customerEmail}
                  </div>

                  <div className="col-md-2">
                    <span
                      className={`badge ${statusBadge(
                        t.status
                      )}`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <div className="col-md-2">
                    {getRoleBadge(t)}
                  </div>

                  <div className="col-md-2 d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() =>
                        navigate(
                          `/agent/ticketdetails/${t.id}`
                        )
                      }
                    >
                      Details
                    </button>

                    <button
                      className="btn btn-dark btn-sm"
                      onClick={() =>
                        navigate(
                          `/agent/ticketchat/${t.id}`
                        )
                      }
                    >
                      Chat
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

export default AgentMyTickets;
