import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllTicketsQuery } from "../../features/admin/adminApi";

function AdminTickets() {
  const navigate = useNavigate();
  const { data: tickets = [], isLoading } = useGetAllTicketsQuery();

  // UI state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sort, setSort] = useState("desc");

  /* =========================
     FILTER + SORT
  ========================= */
  const filteredTickets = useMemo(() => {
    return tickets
      .filter((t) => {
        const q = search.toLowerCase();

        const matchesSearch =
          t.title.toLowerCase().includes(q) ||
          t.customerEmail.toLowerCase().includes(q);

        const matchesStatus =
          statusFilter === "All" || t.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) =>
        sort === "desc"
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt)
      );
  }, [tickets, search, statusFilter, sort]);

  const formatDateTime = (date) =>
    new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const statusBadge = (status) => {
    switch (status) {
      case "Closed":
        return "bg-success";
      case "InProgress":
        return "bg-warning text-dark";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div
      className="container-fluid px-4"
      style={{ backgroundColor: "#f5f2ed", minHeight: "100vh" }}
    >
      {/* HEADER */}
      <div className="pt-4 pb-2">
        <h2 className="fw-bold mb-1">Ticket Monitoring</h2>        
      </div>

      {/* FILTERS */}
      <div
        className="card mb-4 shadow-sm"
        style={{ borderRadius: 12, border: "1px solid #ddd" }}
      >
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <input
                className="form-control"
                placeholder="Search by title or customer email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="InProgress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="col-md-2">
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
      <p className="text-danger mb-2">
          NOTE : Click on a ticket row to view details.
        </p>

      {/* TABLE */}
      <div
        className="card shadow-sm"
        style={{ borderRadius: 12, border: "1px solid #ddd" }}
      >
        <div className="card-body p-0">
          {isLoading ? (
            <div className="p-4 text-muted">Loading tickets...</div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-4 text-muted fst-italic">
              No tickets match the filters.
            </div>
          ) : (
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Customer</th>
                  <th>Handled By</th>
                  <th>Created</th>
                  <th>Closed</th>
                  <th className="text-end">Chat</th>
                </tr>
              </thead>

              <tbody>
                {filteredTickets.map((t) => (
                  <tr
                    key={t.id}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(`/admin/tickets/${t.id}`)
                    }
                  >
                    <td className="fw-semibold">{t.id}</td>

                    <td className="fw-semibold">{t.title}</td>

                    <td>
                      <span className={`badge ${statusBadge(t.status)}`}>
                        {t.status}
                      </span>
                    </td>

                    <td className="text-muted">
                      {t.customerEmail}
                    </td>

                    <td>
  {!t.primaryAgentId ? (
    <span className="badge bg-secondary">
      Unassigned
    </span>
  ) : (
    <>
      <div className="fw-semibold">
        {t.primaryAgentEmail} (Primary)
      </div>

      {t.secondaryAgentEmails?.length > 0 && (
        <div className="small text-muted">
          {t.secondaryAgentEmails.join(", ")}
        </div>
      )}
    </>
  )}
</td>


                    <td className="text-muted">
                      {formatDateTime(t.createdAt)}
                    </td>

                    <td className="text-muted">
                      {t.closedAt ? formatDateTime(t.closedAt) : "-"}
                    </td>

           


                    {/* CHAT BUTTON */}
                    <td className="text-end">
{t.status === "InProgress" && (
  <button
    className="btn btn-sm btn-outline-dark"
    onClick={(e) => {
      e.stopPropagation();
      navigate(`/admin/tickets/${t.id}/assign-secondary`);
    }}
  >
    Add Secondary Agent
  </button>
)}

                      <button
                        className="btn btn-outline-dark btn-sm"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent row click
                          navigate(`/admin/tickets/${t.id}/chat`);
                        }}
                      >
                        View Chat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminTickets;
