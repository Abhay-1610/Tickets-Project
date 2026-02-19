import React, { useState, useMemo } from "react";
import { useGetAuditLogsQuery } from "../../features/admin/adminApi";

/*
  Audit Logs UI
  - Search: email / action / ticket title
  - Filter: role
  - Sort: time
*/

function AdminAuditLogs() {
  const { data: logs = [], isLoading } = useGetAuditLogsQuery();

  // UI state
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [sort, setSort] = useState("desc"); // desc = newest first

  /* =========================
     FILTER + SORT
  ========================= */
  const filteredLogs = useMemo(() => {
    return logs
      .filter((l) => {
        const q = search.toLowerCase();

        const matchesSearch =
          l.userEmail?.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q) ||
          l.ticketTitle?.toLowerCase().includes(q);

        const matchesRole =
          roleFilter === "All" || l.userRole === roleFilter;

        return matchesSearch && matchesRole;
      })
      .sort((a, b) =>
        sort === "desc"
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt)
      );
  }, [logs, search, roleFilter, sort]);

  return (
    <div
      className="container-fluid px-4"
      style={{ backgroundColor: "#f5f2ed", minHeight: "100vh" }}
    >
      {/* HEADER */}
      <div className="pt-4 pb-3">
        <h2 className="fw-bold mb-1">Audit Logs</h2>
        <p className="text-muted mb-0">
          System activity history (users, tickets, actions)
        </p>
      </div>

      {/* FILTERS */}
      <div
        className="card mb-4 shadow-sm"
        style={{ borderRadius: 12, border: "1px solid #ddd" }}
      >
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-5">
              <input
                className="form-control"
                placeholder="Search by user, action, or ticket"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="All">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Agent">Agent</option>
                <option value="Customer">Customer</option>
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

      {/* TABLE */}
      <div
        className="card shadow-sm"
        style={{ borderRadius: 12, border: "1px solid #ddd" }}
      >
        <div className="card-body">
          <h5 className="fw-semibold mb-3">Activity</h5>

          {isLoading ? (
            <div className="text-muted">Loading audit logs...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-muted fst-italic">
              No logs match the filters.
            </div>
          ) : (
            <>
              {/* HEADER ROW */}
              <div className="row fw-semibold text-muted border-bottom pb-2 mb-2">
                <div className="col-md-3">User</div>
                <div className="col-md-2">Role</div>
                <div className="col-md-3">Ticket</div>
                <div className="col-md-2">Action</div>
                <div className="col-md-2">Time</div>
              </div>

              {/* ROWS */}
              {filteredLogs.map((l) => (
                <div
                  key={l.id}
                  className="row align-items-center py-2 border-bottom"
                >
                  <div className="col-md-3 fw-semibold">
                    {l.userEmail ?? "System"}
                  </div>

                  <div className="col-md-2">
                    <span
                      className={`badge ${
                        l.userRole === "Admin"
                          ? "bg-dark"
                          : l.userRole === "Agent"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {l.userRole}
                    </span>
                  </div>

                  <div className="col-md-3 text-bold">
                    {l.ticketTitle
                      ? `#${l.ticketId} — ${l.ticketTitle}`
                      : "-"}
                  </div>

                  <div className="col-md-2">
                    {l.action}
                  </div>

                  <div className="col-md-2 text-muted">
                    {new Date(l.createdAt).toLocaleString()}
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

export default AdminAuditLogs;
