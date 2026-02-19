import React, { useState } from "react";
import {
  useGetUsersQuery,
  useCreateAgentMutation,
  useBlockUserMutation,
  useUnblockUserMutation,
} from "../../features/admin/adminApi";

function AdminUsers() {
  const { data: users = [], isLoading } = useGetUsersQuery();
  const [createAgent] = useCreateAgentMutation();
  const [blockUser] = useBlockUserMutation();
  const [unblockUser] = useUnblockUserMutation();

  // create agent form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const handleCreate = async () => {
    if (!email || !password) return;
    await createAgent({ email, password });
    setEmail("");
    setPassword("");
  };

  // filtered users
  const filteredUsers = users.filter((u) => {
    const matchEmail = u.email
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchRole =
      roleFilter === "All" || u.role === roleFilter;

    return matchEmail && matchRole;
  });

  return (
    <div
      className="container-fluid px-4"
      style={{ backgroundColor: "#f5f2ed", minHeight: "100vh" }}
    >
      {/* HEADER */}
      <div className="pt-4 pb-3">
        <h2 className="fw-bold text-dark mb-1">
          User Management
        </h2>
        <p className="text-muted mb-0">
          Create agents and manage all system users
        </p>
      </div>

      {/* CREATE AGENT */}
      <div
        className="card mb-4 shadow-sm"
        style={{ borderRadius: "12px", border: "1px solid #ddd" }}
      >
        <div className="card-body">
          <h5 className="fw-semibold mb-3">
            Create Agent
          </h5>

          <div className="row g-3">
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Agent Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <div className="col-md-4">
              <input
                type="password"
                className="form-control"
                placeholder="Temporary Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
            </div>

            <div className="col-md-4 d-grid">
              <button
                className="btn btn-dark"
                onClick={handleCreate}
              >
                Create Agent
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* USERS TABLE */}
      <div
        className="card shadow-sm"
        style={{ borderRadius: "12px", border: "1px solid #ddd" }}
      >
        <div className="card-body">
          <h5 className="fw-semibold mb-3">
            All Users
          </h5>

          {/* FILTERS */}
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Search by email"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value)
                }
              >
                <option value="All">All Roles</option>
                <option value="Agent">Agent</option>
                <option value="Customer">Customer</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-muted">
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-muted fst-italic">
              No users match the filters.
            </div>
          ) : (
            <>
              {/* TABLE HEADER */}
              <div className="row fw-semibold text-muted border-bottom pb-2 mb-2">
                <div className="col-md-4">Email</div>
                <div className="col-md-2">Role</div>
                <div className="col-md-2">Status</div>
                <div className="col-md-4 text-end">
                  Actions
                </div>
              </div>

              {/* ROWS */}
              {filteredUsers.map((u) => (
                <div
                  key={u.userId}
                  className="row align-items-center py-2 border-bottom"
                >
                  <div className="col-md-4 fw-semibold">
                    {u.email}
                  </div>

                  <div className="col-md-2 text-muted">
                    {u.role}
                  </div>

                  <div className="col-md-2">
                    <span
                      className={`badge ${
                        u.isBlocked
                          ? "bg-danger"
                          : "bg-success"
                      }`}
                    >
                      {u.isBlocked
                        ? "Blocked"
                        : "Active"}
                    </span>
                  </div>

                  <div className="col-md-4 d-flex justify-content-end">
                    {u.isBlocked ? (
                      <button
                        className="btn btn-outline-dark btn-sm"
                        onClick={() =>
                          unblockUser(u.userId)
                        }
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        className="btn btn-dark btn-sm"
                        onClick={() =>
                          blockUser(u.userId)
                        }
                      >
                        Block
                      </button>
                    )}
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

export default AdminUsers;
