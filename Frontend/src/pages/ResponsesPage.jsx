import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import ResponseTable from "../components/ResponseTable";
import { getResponsesByForm } from "../services/api";

const ResponsesPage = () => {
  useEffect(() => {
    document.title = "Form Responses | FormBuilder";
  }, []);
  const { id } = useParams();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResponses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getResponsesByForm(id);
      setResponses(res.data?.data || []);
    } catch (err) {
      if (err.response?.status === 404 || err.response?.status === 400) {
        setError("Form not found or has been deleted.");
      } else {
        setError(err.userMessage || "Failed to load responses.");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchResponses();
    }
  }, [id, fetchResponses]);

  const exportCSV = () => {
    if (!responses || responses.length === 0) return;

    let uniqueKeys = new Set();
    responses.forEach((res) => {
      if (res.answers) {
        Object.keys(res.answers).forEach((key) => uniqueKeys.add(key));
      }
    });

    const columns = Array.from(uniqueKeys);

    const headerRow = ["Submitted At", ...columns].join(",");

    const dataRows = responses.map((resp) => {
      const date = resp.submittedAt
        ? new Date(resp.submittedAt).toLocaleString()
        : "";
      const row = [`"${date}"`];

      columns.forEach((col) => {
        let val =
          resp.answers && resp.answers[col] !== undefined
            ? resp.answers[col]
            : "";
        if (Array.isArray(val)) val = val.join(", ");
        if (typeof val === "boolean") val = val ? "Yes" : "No";
        val = String(val).replace(/"/g, '""');
        row.push(`"${val}"`);
      });

      return row.join(",");
    });

    const csvData = [headerRow, ...dataRows].join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `form_${id}_responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="page-container"
      style={{ animation: "fadeIn 0.5s ease-out" }}
    >
      {/* Sticky Header */}
      <div
        style={{
          position: "sticky",
          top: "70px",
          zIndex: 40,
          background: "rgba(249, 250, 251, 0.9)",
          backdropFilter: "blur(10px)",
          paddingTop: "1.5rem",
          paddingBottom: "1rem",
          marginBottom: "2rem",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          className="page-header flex-between mb-0"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 1rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "0.5rem",
              }}
            >
              <Link
                to="/admin/forms"
                className="text-muted"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  transition: "all 0.2s",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--primary)";
                  e.currentTarget.style.borderColor = "var(--primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-muted)";
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              >
                &larr;
              </Link>
              <h2
                className="page-title"
                style={{
                  fontSize: "2rem",
                  fontWeight: "800",
                  color: "var(--text-main)",
                  letterSpacing: "-0.025em",
                  margin: 0,
                }}
              >
                Form Responses
              </h2>
            </div>
            <p
              className="text-muted mt-0 text-sm"
              style={{ marginLeft: "3rem" }}
            >
              Ref ID:{" "}
              <span
                style={{
                  fontWeight: 600,
                  color: "#64748b",
                  fontFamily: "monospace",
                  background: "#e2e8f0",
                  padding: "0.15rem 0.4rem",
                  borderRadius: "4px",
                }}
              >
                {id}
              </span>
            </p>
          </div>

          <div
            className="flex-start gap-2"
            style={{ display: "flex", gap: "0.75rem" }}
          >
            <button
              className="btn btn-outline"
              onClick={exportCSV}
              disabled={loading || error || responses.length === 0}
              style={{
                padding: "0.75rem 1.25rem",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "var(--surface)",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>&#11123;</span> Export CSV
            </button>
            <button
              className="btn btn-primary"
              onClick={() => window.open(`/form/${id}`, "_blank")}
              style={{
                padding: "0.75rem 1.25rem",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.3)",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>&#128279;</span> View Live
              Form
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        {/* Statistics Cards Array */}
        {!loading && !error && responses.length > 0 && (
          <div
            className="grid mb-4"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2.5rem",
            }}
          >
            <div
              className="card stat-card"
              style={{
                padding: "1.5rem",
                borderLeft: "4px solid var(--primary)",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                transition: "transform 0.2s",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
              }}
            >
              <div>
                <h4
                  className="text-muted text-sm text-uppercase mb-1"
                  style={{ letterSpacing: "0.05em", fontWeight: "700" }}
                >
                  Total Responses
                </h4>
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "800",
                    color: "var(--text-main)",
                    lineHeight: "1.2",
                  }}
                >
                  {responses.length}
                </div>
              </div>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(79, 70, 229, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--primary)",
                  fontSize: "1.5rem",
                }}
              >
                &#128202;
              </div>
            </div>

            <div
              className="card stat-card"
              style={{
                padding: "1.5rem",
                borderLeft: "4px solid #10b981",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                transition: "transform 0.2s",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
              }}
            >
              <div>
                <h4
                  className="text-muted text-sm text-uppercase mb-1"
                  style={{ letterSpacing: "0.05em", fontWeight: "700" }}
                >
                  Latest Submission
                </h4>
                <div
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    color: "var(--text-main)",
                    marginTop: "0.5rem",
                  }}
                >
                  {new Date(responses[0]?.submittedAt).toLocaleDateString(
                    undefined,
                    { month: "short", day: "numeric", year: "numeric" },
                  )}
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "#64748b",
                    marginTop: "0.25rem",
                  }}
                >
                  {new Date(responses[0]?.submittedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(16, 185, 129, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#10b981",
                  fontSize: "1.5rem",
                }}
              >
                &#9201;
              </div>
            </div>

            <div
              className="card stat-card"
              style={{
                padding: "1.5rem",
                borderLeft: "4px solid #f59e0b",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                transition: "transform 0.2s",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
              }}
            >
              <div>
                <h4
                  className="text-muted text-sm text-uppercase mb-1"
                  style={{ letterSpacing: "0.05em", fontWeight: "700" }}
                >
                  Completion Rate
                </h4>
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "800",
                    color: "var(--text-main)",
                    lineHeight: "1.2",
                  }}
                >
                  100%
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "#64748b",
                    marginTop: "0.25rem",
                  }}
                >
                  Estimated average
                </div>
              </div>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(245, 158, 11, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#f59e0b",
                  fontSize: "1.5rem",
                }}
              >
                &#10004;
              </div>
            </div>
          </div>
        )}

        {/* Main Table View */}
        <div style={{ paddingBottom: "4rem" }}>
          <ResponseTable
            responses={responses}
            loading={loading}
            error={error}
          />
        </div>
      </div>

      <style>{`
        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1) !important; cursor: default; }
        @media (max-width: 640px) {
          .page-header { flex-direction: column; align-items: flex-start; }
          .flex-start { width: 100%; justify-content: space-between; }
        }
      `}</style>
    </div>
  );
};

export default ResponsesPage;
