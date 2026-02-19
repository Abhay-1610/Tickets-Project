import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useGetTicketByIdQuery } from "../../features/tickets/ticketsApi";
import {
  useAssignSecondaryAgentMutation,
  useGetUsersQuery,
} from "../../features/admin/adminApi";

function AdminAssignSecondaryAgent() {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const { data: ticket, isLoading: ticketLoading } =
    useGetTicketByIdQuery(ticketId);

  const { data: users, isLoading: usersLoading } =
    useGetUsersQuery();

  const [assignSecondary, { isLoading: assigning }] =
    useAssignSecondaryAgentMutation();

  /* =========================
     DERIVED DATA
  ========================= */

  const agents = useMemo(() => {
    if (!users) return [];
    return users.filter((u) => u.role === "Agent");
  }, [users]);

  const assignedAgentIds = useMemo(() => {
    if (!ticket?.agents) return [];
    return ticket.agents.map((a) => a.agentId);
  }, [ticket]);

  const availableAgents = useMemo(() => {
    return agents
      .filter((a) => !assignedAgentIds.includes(a.userId))
      .filter((a) =>
        a.email.toLowerCase().includes(search.toLowerCase())
      );
  }, [agents, assignedAgentIds, search]);

  /* =========================
     ASSIGN HANDLER
  ========================= */

  const handleAssign = async (agentId) => {
    try {
      await assignSecondary({
        ticketId: Number(ticketId),
        agentId,
      }).unwrap();

      navigate(-1);
    } catch (err) {
      console.error("Assign failed", err);
    }
  };

  /* =========================
     STATES
  ========================= */

  if (ticketLoading || usersLoading) {
    return (
      <div className="p-4 text-muted">
        Loading assignment data...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-4 text-danger">
        Ticket not found
      </div>
    );
  }

  // 🔥 Restrict to InProgress only
  if (ticket.status !== "InProgress") {
    return (
      <div className="p-4 text-danger">
        Secondary agents can only be assigned when ticket is In Progress.
      </div>
    );
  }

  /* =========================
     UI
  ========================= */

  return (
    <div
      className="container-fluid px-4"
      style={{ backgroundColor: "#f5f2ed", minHeight: "100vh" }}
    >
      <div className="pt-4 pb-3">
        <h2 className="fw-bold mb-1">
          Assign Secondary Agent
        </h2>
        <p className="text-muted mb-0">
          Ticket #{ticket.id} — {ticket.title}
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
              type="text"
              className="form-control"
              placeholder="Search agent by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* LIST */}
          {availableAgents.length === 0 ? (
            <div className="text-muted text-center py-4">
              No available agents found
            </div>
          ) : (
            <div className="list-group">
              {availableAgents.map((agent) => (
                <div
                  key={agent.userId}
                  className="list-group-item d-flex justify-content-between align-items-center"
                  style={{ borderRadius: 8 }}
                >
                  <div>
                    <div className="fw-semibold">
                      {agent.email}
                    </div>
                    <div className="small text-muted">
                      Agent
                    </div>
                  </div>

                  <button
                    className="btn btn-sm btn-outline-success"
                    disabled={assigning}
                    onClick={() =>
                      handleAssign(agent.userId)
                    }
                  >
                    Assign
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card-footer bg-light d-flex justify-content-between">
          <button
            className="btn btn-outline-dark btn-sm"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminAssignSecondaryAgent;
