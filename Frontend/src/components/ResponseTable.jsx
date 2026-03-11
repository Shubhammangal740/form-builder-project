import React, { memo } from "react";

const ResponseTable = memo(({ responses, loading, error }) => {
  if (loading) {
    return (
      <div
        className="card text-center py-4"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "300px",
          background: "var(--surface)",
          borderRadius: "var(--radius-lg)",
        }}
      >
        <div
          className="spinner"
          style={{
            width: "48px",
            height: "48px",
            border: "3px solid rgba(79, 70, 229, 0.1)",
            borderTopColor: "var(--primary)",
            borderRadius: "50%",
            animation: "spin 1s cubic-bezier(0.55, 0.085, 0.68, 0.53) infinite",
            marginBottom: "1.5rem",
          }}
        />
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            color: "var(--text-main)",
            marginBottom: "0.5rem",
          }}
        >
          Loading Responses
        </h3>
        <p className="text-muted" style={{ maxWidth: "400px" }}>
          Please wait while we gather the latest submission data...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
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
          Failed to Load Data
        </h3>
        <p style={{ color: "#b91c1c", maxWidth: "500px", margin: "0 auto" }}>
          {error}
        </p>
        <button
          className="btn btn-outline mt-4"
          onClick={() => window.location.reload()}
          style={{ borderColor: "#ef4444", color: "#b91c1c" }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!responses || responses.length === 0) {
    return (
      <div
        className="card text-center text-muted"
        style={{
          padding: "5rem 2rem",
          border: "2px dashed var(--border)",
          background: "rgba(249, 250, 251, 0.5)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "none",
        }}
      >
        <div
          style={{
            fontSize: "3.5rem",
            opacity: 0.3,
            marginBottom: "1rem",
            color: "var(--primary)",
          }}
        >
          &#128196;
        </div>
        <h3
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "var(--text-main)",
            marginBottom: "0.75rem",
          }}
        >
          No responses yet
        </h3>
        <p
          className="text-muted"
          style={{
            maxWidth: "400px",
            margin: "0 auto 1.5rem auto",
            lineHeight: "1.6",
          }}
        >
          This form hasn't received any submissions. Share your public link to
          start collecting data.
        </p>
      </div>
    );
  }

  // Extract unique columns dynamically based on the available responses' answers
  let uniqueKeys = new Set();
  responses.forEach((res) => {
    if (res.answers) {
      Object.keys(res.answers).forEach((key) => uniqueKeys.add(key));
    }
  });

  const columns = Array.from(uniqueKeys);

  const renderCellContent = (value) => {
    if (value === undefined || value === null || value === "")
      return <span style={{ color: "#cbd5e1", fontStyle: "italic" }}>-</span>;
    if (Array.isArray(value)) {
      return (
        <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
          {value.map((v, i) => (
            <span
              key={i}
              style={{
                background: "#f1f5f9",
                padding: "0.15rem 0.5rem",
                borderRadius: "4px",
                fontSize: "0.75rem",
                color: "#475569",
                fontWeight: "500",
                whiteSpace: "nowrap",
              }}
            >
              {v}
            </span>
          ))}
        </div>
      );
    }
    if (typeof value === "boolean") {
      return value ? (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            color: "#10b981",
            fontWeight: "600",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#10b981",
            }}
          />{" "}
          Yes
        </span>
      ) : (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            color: "#ef4444",
            fontWeight: "500",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#ef4444",
            }}
          />{" "}
          No
        </span>
      );
    }
    return <span style={{ color: "var(--text-main)" }}>{String(value)}</span>;
  };

  return (
    <div
      className="card p-0 overflow-hidden"
      style={{
        borderRadius: "var(--radius-lg)",
        boxShadow:
          "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.02)",
        border: "1px solid var(--border)",
      }}
    >
      <div
        className="table-responsive custom-scrollbar"
        style={{ overflowX: "auto", maxHeight: "600px", overflowY: "auto" }}
      >
        <table
          className="table"
          style={{
            minWidth: minWidthForTable(columns.length),
            borderCollapse: "collapse",
            width: "100%",
          }}
        >
          <thead
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              background: "#f8fafc",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <tr>
              <th
                style={{
                  width: "60px",
                  textAlign: "center",
                  padding: "1rem",
                  color: "#64748b",
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  borderBottom: "2px solid var(--border)",
                }}
              >
                ID
              </th>
              {columns.map((col) => (
                <th
                  key={col}
                  style={{
                    padding: "1rem 1.5rem",
                    color: "#64748b",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderBottom: "2px solid var(--border)",
                    textAlign: "left",
                    minWidth: "150px",
                  }}
                >
                  {col}
                </th>
              ))}
              <th
                style={{
                  width: "180px",
                  padding: "1rem 1.5rem",
                  color: "#64748b",
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  borderBottom: "2px solid var(--border)",
                  textAlign: "left",
                }}
              >
                Date Submitted
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {responses.map((resp, idx) => (
              <tr
                key={resp._id || resp.id || idx}
                className="hover-row"
                style={{
                  transition: "all 0.2s ease",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <td
                  style={{
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#94a3b8",
                    padding: "1rem",
                    fontSize: "0.875rem",
                  }}
                >
                  #{idx + 1}
                </td>
                {columns.map((col) => (
                  <td
                    key={col}
                    style={{
                      padding: "1rem 1.5rem",
                      fontSize: "0.875rem",
                      maxWidth: "300px",
                      verticalAlign: "middle",
                    }}
                  >
                    {renderCellContent(resp.answers ? resp.answers[col] : null)}
                  </td>
                ))}
                <td
                  style={{
                    color: "#64748b",
                    padding: "1rem 1.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    whiteSpace: "nowrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ opacity: 0.5 }}>&#128197;</span>
                    {resp.submittedAt
                      ? new Date(resp.submittedAt).toLocaleString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Unknown Date"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          padding: "1rem 1.5rem",
          background: "#f8fafc",
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span className="text-sm text-muted font-medium">
          Showing {responses.length} response{responses.length !== 1 ? "s" : ""}
        </span>
      </div>

      <style>{`
        .hover-row:hover { background-color: #f8fafc; cursor: default; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; border: 2px solid #f1f5f9; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
});

const minWidthForTable = (colCount) => {
  if (colCount <= 3) return "100%";
  return `${colCount * 200}px`;
};

export default ResponseTable;
