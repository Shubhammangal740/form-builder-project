import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  useEffect(() => {
    document.title = "Dashboard | FormBuilder";
  }, []);

  return (
    <div
      className="page-container"
      style={{ animation: "fadeIn 0.5s ease-out" }}
    >
      <div className="page-header mb-4">
        <h2
          className="page-title"
          style={{
            fontSize: "2.25rem",
            fontWeight: "800",
            color: "var(--text-main)",
            letterSpacing: "-0.025em",
          }}
        >
          Admin Dashboard
        </h2>
        <p
          className="text-muted mt-2"
          style={{ fontSize: "1.125rem", maxWidth: "600px", lineHeight: "1.6" }}
        >
          Welcome back to FormBuilder. Manage your forms, view responses, and
          gather insights efficiently.
        </p>
      </div>

      <div
        className="grid grid-3"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.5rem",
          marginTop: "2rem",
        }}
      >
        {/* Create Form Card */}
        <div
          className="card text-center"
          style={{
            padding: "2.5rem 2rem",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "rgba(79, 70, 229, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem auto",
            }}
          >
            <span style={{ fontSize: "2rem", color: "var(--primary)" }}>
              &#10133;
            </span>
          </div>
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "0.75rem",
              color: "var(--text-main)",
            }}
          >
            Create a New Form
          </h3>
          <p className="text-muted mb-4" style={{ lineHeight: "1.5", flex: 1 }}>
            Design a custom form from scratch using our drag-and-drop builder
            with multiple field types.
          </p>
          <Link
            to="/admin/create-form"
            className="btn btn-primary w-full"
            style={{ padding: "0.75rem", fontSize: "1rem", fontWeight: "600" }}
          >
            Get Started
          </Link>
        </div>

        {/* View Active Forms Card */}
        <div
          className="card text-center"
          style={{
            padding: "2.5rem 2rem",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "rgba(16, 185, 129, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem auto",
            }}
          >
            <span style={{ fontSize: "2rem", color: "var(--success)" }}>
              &#128193;
            </span>
          </div>
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "0.75rem",
              color: "var(--text-main)",
            }}
          >
            Manage Forms
          </h3>
          <p className="text-muted mb-4" style={{ lineHeight: "1.5", flex: 1 }}>
            View, edit, duplicate, or delete your existing active forms and
            surveys.
          </p>
          <Link
            to="/admin/forms"
            className="btn btn-outline w-full"
            style={{ padding: "0.75rem", fontSize: "1rem", fontWeight: "600" }}
          >
            View Forms
          </Link>
        </div>

        {/* Analytics Placeholder Card */}
        <div
          className="card text-center"
          style={{
            padding: "2.5rem 2rem",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "rgba(245, 158, 11, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem auto",
            }}
          >
            <span style={{ fontSize: "2rem", color: "#f59e0b" }}>
              &#128202;
            </span>
          </div>
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "0.75rem",
              color: "var(--text-main)",
            }}
          >
            Recent Activity
          </h3>
          <p className="text-muted mb-4" style={{ lineHeight: "1.5", flex: 1 }}>
            Quickly check the most recent responses submitted across all your
            active forms.
          </p>
          <Link
            to="/admin/forms"
            className="btn w-full"
            style={{
              padding: "0.75rem",
              fontSize: "1rem",
              fontWeight: "600",
              backgroundColor: "#f3f4f6",
              color: "var(--text-main)",
            }}
          >
            Go to Forms List
          </Link>
        </div>
      </div>

      <style>{`
        .card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
      `}</style>
    </div>
  );
};

export default Dashboard;
