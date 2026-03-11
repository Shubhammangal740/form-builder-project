import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getAllForms, deleteForm, duplicateForm } from "../services/api";

const FormsList = () => {
  useEffect(() => {
    document.title = "All Forms | FormBuilder";
  }, []);
  const [loading, setLoading] = useState(true);
  const [forms, setForms] = useState([]);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleCopyLink = async (formId) => {
    const url = `${window.location.origin}/form/${formId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(formId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedId(formId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const fetchForms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAllForms();
      setForms(res.data?.data || []);
    } catch (err) {
      setError(err.userMessage || "Failed to load forms.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const handleDelete = async (formId) => {
    if (!window.confirm("Are you sure you want to delete this form?")) return;
    try {
      await deleteForm(formId);
      setForms((prev) => prev.filter((f) => f._id !== formId));
    } catch (err) {
      showToast(err.userMessage || "Failed to delete form.");
    }
  };

  const handleDuplicate = async (formId) => {
    try {
      const res = await duplicateForm(formId);
      if (res.data?.data) {
        setForms((prev) => [res.data.data, ...prev]);
      }
    } catch (err) {
      showToast(err.userMessage || "Failed to duplicate form.");
    }
  };

  if (loading) {
    return (
      <div
        className="page-container flex-center"
        style={{
          minHeight: "50vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="spinner"
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid rgba(79, 70, 229, 0.2)",
            borderTopColor: "var(--primary)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1.5rem auto",
          }}
        />
        <p className="text-muted" style={{ fontWeight: 500 }}>
          Loading your forms...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="page-container"
        style={{ animation: "fadeIn 0.4s ease-out" }}
      >
        <div
          className="card text-center py-4"
          style={{
            backgroundColor: "#fef2f2",
            borderColor: "#fca5a5",
            padding: "3rem",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <div
            style={{ fontSize: "3rem", color: "#ef4444", marginBottom: "1rem" }}
          >
            &#9888;
          </div>
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#991b1b",
              marginBottom: "0.5rem",
            }}
          >
            Failed to Load Forms
          </h3>
          <p style={{ color: "#b91c1c", maxWidth: "500px", margin: "0 auto" }}>
            {error}
          </p>
          <button
            className="btn btn-outline mt-4"
            onClick={fetchForms}
            style={{ borderColor: "#ef4444", color: "#b91c1c" }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="page-container"
      style={{ animation: "fadeIn 0.4s ease-out" }}
    >
      {/* Toast notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "1.5rem",
            right: "1.5rem",
            zIndex: 1000,
            padding: "1rem 1.5rem",
            borderRadius: "var(--radius-lg)",
            background: toast.type === "error" ? "#fef2f2" : "#ecfdf5",
            color: toast.type === "error" ? "#b91c1c" : "#047857",
            border: `1px solid ${toast.type === "error" ? "#fca5a5" : "#6ee7b7"}`,
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
            animation: "slideDown 0.3s ease-out",
            fontWeight: 500,
            fontSize: "0.875rem",
            maxWidth: "400px",
          }}
        >
          <span style={{ marginRight: "0.5rem" }}>
            {toast.type === "error" ? "⚠" : "✓"}
          </span>
          {toast.message}
        </div>
      )}

      <div
        className="page-header flex-between mb-4"
        style={{ flexWrap: "wrap", gap: "1rem" }}
      >
        <div>
          <h2
            className="page-title"
            style={{
              fontSize: "2rem",
              fontWeight: "800",
              color: "var(--text-main)",
              letterSpacing: "-0.025em",
            }}
          >
            Forms List
          </h2>
          <p className="text-muted mt-2" style={{ fontSize: "1.125rem" }}>
            Manage your created forms and view collected responses.
          </p>
        </div>
        <Link
          to="/admin/create-form"
          className="btn btn-primary"
          style={{
            padding: "0.75rem 1.5rem",
            fontWeight: "600",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.2)",
          }}
        >
          <span style={{ fontSize: "1.25rem" }}>&#10133;</span> Create Form
        </Link>
      </div>

      {forms.length === 0 ? (
        <div
          className="card text-center py-4"
          style={{
            padding: "4rem 2rem",
            border: "2px dashed var(--border)",
            background: "transparent",
            boxShadow: "none",
          }}
        >
          <div
            style={{
              fontSize: "3rem",
              color: "var(--text-muted)",
              marginBottom: "1rem",
              opacity: 0.5,
            }}
          >
            &#128196;
          </div>
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "var(--text-main)",
              marginBottom: "0.5rem",
            }}
          >
            No forms found
          </h3>
          <p className="text-muted mb-4">
            You haven't created any forms yet. Start building one now.
          </p>
          <Link to="/admin/create-form" className="btn btn-primary">
            Create Your First Form
          </Link>
        </div>
      ) : (
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {forms.map((form) => (
            <div
              key={form._id}
              className="card form-card"
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                padding: "1.5rem",
                transition: "all 0.2s ease",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "4px",
                  height: "100%",
                  background: "var(--primary)",
                }}
              />

              <div
                className="form-card-header mb-2"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "1rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    color: "var(--text-main)",
                    lineHeight: "1.4",
                    margin: 0,
                  }}
                >
                  {form.title}
                </h3>
                <span
                  className="badge"
                  style={{
                    background: "rgba(79, 70, 229, 0.1)",
                    color: "var(--primary)",
                    padding: "0.35rem 0.75rem",
                    borderRadius: "2rem",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    whiteSpace: "nowrap",
                  }}
                >
                  {form.fields?.length || 0} Fields
                </span>
              </div>

              <p
                className="text-muted text-sm mt-2 mb-4"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  flex: 1,
                  lineHeight: "1.6",
                }}
              >
                {form.description || "No description provided."}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.5rem",
                  color: "var(--text-muted)",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                }}
              >
                <span style={{ opacity: 0.7 }}>&#128197;</span> Created on{" "}
                {new Date(form.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>

              <div
                className="form-card-actions"
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginTop: "auto",
                  borderTop: "1px solid var(--border)",
                  paddingTop: "1.25rem",
                  flexWrap: "wrap",
                }}
              >
                <Link
                  to={`/admin/responses/${form._id}`}
                  className="btn btn-outline"
                  style={{
                    padding: "0.6rem 0.5rem",
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontWeight: "600",
                    minWidth: "100px",
                  }}
                >
                  <span>&#128202;</span> Responses
                </Link>
                <button
                  className="btn btn-outline"
                  onClick={() => handleCopyLink(form._id)}
                  title="Copy Form Link"
                  style={{
                    padding: "0.6rem 0.5rem",
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontWeight: "600",
                    minWidth: "100px",
                    background:
                      copiedId === form._id
                        ? "rgba(16,185,129,0.1)"
                        : undefined,
                    borderColor: copiedId === form._id ? "#10b981" : undefined,
                    color: copiedId === form._id ? "#059669" : undefined,
                    transition: "all 0.2s",
                  }}
                >
                  <span>{copiedId === form._id ? "✓" : "📋"}</span>{" "}
                  {copiedId === form._id ? "Copied!" : "Copy Link"}
                </button>
                <Link
                  to={`/form/${form._id}`}
                  target="_blank"
                  className="btn btn-primary"
                  style={{
                    padding: "0.6rem 0.5rem",
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontWeight: "600",
                    minWidth: "100px",
                  }}
                >
                  <span>&#128279;</span> View Live
                </Link>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleDuplicate(form._id)}
                  title="Duplicate"
                  style={{
                    padding: "0.6rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  &#128203;
                </button>
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(form._id)}
                  title="Delete"
                  style={{ width: "32px", height: "32px", fontSize: "1.1rem" }}
                >
                  &times;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .form-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: rgba(79, 70, 229, 0.3); }
        @media (max-width: 640px) {
          .page-header { flex-direction: column; align-items: flex-start; }
          .form-card-actions { flex-direction: column; }
        }
      `}</style>
    </div>
  );
};

export default FormsList;
