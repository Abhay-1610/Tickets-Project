import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllTicketsQuery } from "../../features/admin/adminApi";
import { useSelector } from "react-redux";

function AgentCompletedTickets() {
  const navigate = useNavigate();
  const { data: tickets = [], isLoading } = useGetAllTicketsQuery();
  const agentId = useSelector((s) => s.auth.userId);

  // filters
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("desc");

  const completedTickets = useMemo(() => {
    return tickets
      .filter(
        (t) =>
          t.primaryAgentId === agentId &&
          t.status === "Closed" &&
          t.title.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) =>
        sort === "desc"
          ? new Date(b.closedAt) - new Date(a.closedAt)
          : new Date(a.closedAt) - new Date(b.closedAt)
      );
  }, [tickets, agentId, search, sort]);

  return (
    <div
      className="container-fluid px-4"
      style={{ backgroundColor: "#f5f2ed", minHeight: "100vh" }}
    >
      {/* HEADER */}
      <div className="pt-4 pb-3">
        <h2 className="fw-bold mb-1">Completed Tickets</h2>
        <p className="text-muted mb-0">
          Tickets successfully resolved and closed by you
        </p>
      </div>

      {/* FILTERS */}
      <div
        className="card mb-4 shadow-sm"
        style={{ borderRadius: "12px", border: "1px solid #ddd" }}
      >
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Search by title"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* LIST */}
      <div
        className="card shadow-sm"
        style={{ borderRadius: "12px", border: "1px solid #ddd" }}
      >
        <div className="card-body">
          <h5 className="fw-semibold mb-3">Closed Tickets</h5>

          {isLoading ? (
            <div className="text-muted">Loading tickets...</div>
          ) : completedTickets.length === 0 ? (
            <div className="text-muted fst-italic">
              No completed tickets found.
            </div>
          ) : (
            <>
              {/* HEADER ROW */}
              <div className="row fw-semibold text-muted border-bottom pb-2 mb-2">
                <div className="col-md-4">Title</div>
                <div className="col-md-3">Closed On</div>
                <div className="col-md-2">Status</div>
                <div className="col-md-3 text-end">Action</div>
              </div>

              {/* ROWS */}
              {completedTickets.map((t) => (
                <div
                  key={t.id}
                  className="row align-items-center py-2 border-bottom"
                >
                  <div className="col-md-4 fw-semibold">
                    {t.title}
                  </div>

                  <div className="col-md-3 text-muted">
                    {t.closedAt
                      ? new Date(t.closedAt).toLocaleDateString()
                      : "-"}
                  </div>

                  <div className="col-md-2">
                    <span className="badge bg-success">
                      Closed
                    </span>
                  </div>

                  <div className="col-md-3 d-flex justify-content-end">
                    <button
                      className="btn btn-outline-dark btn-sm"
                      onClick={() =>
                        navigate(`/agent/ticketchat/${t.id}`)
                      }
                    >
                      View Chat
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

export default AgentCompletedTickets;
