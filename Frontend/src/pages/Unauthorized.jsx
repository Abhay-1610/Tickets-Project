import React from "react";
import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: "#FBF7F2",
        padding: "40px",
      }}
    >
      <div
        className="bg-white border border-danger rounded p-5 text-center"
        style={{ maxWidth: "440px", width: "100%" }}
      >
        {/* Icon-like header */}
        <div className="mb-3">
          <span
            className="badge bg-danger px-3 py-2"
            style={{ fontSize: "0.9rem" }}
          >
            ACCESS DENIED
          </span>
        </div>

        <h4 className="fw-bold text-danger mb-2">
          Unauthorized Access
        </h4>

        <p className="text-muted mb-4">
          You do not have sufficient permissions to view this page.
          <br />
          Please contact your administrator if you believe this is a mistake.
        </p>

        <div className="d-flex justify-content-center gap-3">
          
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
