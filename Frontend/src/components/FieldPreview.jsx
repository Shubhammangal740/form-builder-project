import React, { memo } from "react";

const FieldPreview = memo(({ field, design }) => {
  const alignment = design?.fieldAlignment || "left";

  const renderInput = () => {
    switch (field.type) {
      case "textarea":
        return (
          <textarea
            className="form-input"
            placeholder="Enter your response..."
            readOnly
            rows="3"
            style={{
              background: "#f8fafc",
              color: "#94a3b8",
              borderStyle: "dashed",
              cursor: "default",
            }}
          />
        );

      case "dropdown":
        return (
          <select
            className="form-input"
            disabled
            style={{
              background: "#f8fafc",
              color: "#94a3b8",
              borderStyle: "dashed",
              cursor: "default",
              backgroundImage: "none",
            }}
          >
            <option value="">Select an option...</option>
            {field.options &&
              field.options.map((opt, idx) => (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              ))}
          </select>
        );

      case "radio":
        return (
          <div
            className="radio-group flex-col"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
              marginTop: "0.75rem",
              alignItems:
                alignment === "center"
                  ? "center"
                  : alignment === "right"
                    ? "flex-end"
                    : "flex-start",
            }}
          >
            {field.options && field.options.length > 0 ? (
              field.options.map((opt, idx) => (
                <label
                  key={idx}
                  className="w-max-content"
                  style={{
                    cursor: "default",
                    width: "max-content",
                    opacity: 0.7,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="radio"
                    disabled
                    name={`preview_${field.id}`}
                    style={{ width: "18px", height: "18px", cursor: "default" }}
                  />
                  <span className="text-sm ml-2" style={{ fontWeight: "500" }}>
                    {opt}
                  </span>
                </label>
              ))
            ) : (
              <span
                className="text-muted text-sm italic"
                style={{
                  padding: "0.5rem",
                  background: "#f1f5f9",
                  borderRadius: "4px",
                }}
              >
                No options configured yet
              </span>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div
            className="checkbox-group flex-col"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
              marginTop: "0.75rem",
              alignItems:
                alignment === "center"
                  ? "center"
                  : alignment === "right"
                    ? "flex-end"
                    : "flex-start",
            }}
          >
            {field.options && field.options.length > 0 ? (
              field.options.map((opt, idx) => (
                <label
                  key={idx}
                  className="w-max-content"
                  style={{
                    cursor: "default",
                    width: "max-content",
                    opacity: 0.7,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    disabled
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "4px",
                      cursor: "default",
                    }}
                  />
                  <span className="text-sm ml-2" style={{ fontWeight: "500" }}>
                    {opt}
                  </span>
                </label>
              ))
            ) : (
              <span
                className="text-muted text-sm italic"
                style={{
                  padding: "0.5rem",
                  background: "#f1f5f9",
                  borderRadius: "4px",
                }}
              >
                No options configured yet
              </span>
            )}
          </div>
        );

      case "number":
        return (
          <input
            type="number"
            className="form-input"
            placeholder="e.g. 100"
            readOnly
            style={{
              background: "#f8fafc",
              color: "#94a3b8",
              borderStyle: "dashed",
              cursor: "default",
            }}
          />
        );

      case "email":
        return (
          <input
            type="email"
            className="form-input"
            placeholder="example@domain.com"
            readOnly
            style={{
              background: "#f8fafc",
              color: "#94a3b8",
              borderStyle: "dashed",
              cursor: "default",
            }}
          />
        );

      case "text":
      default:
        return (
          <input
            type="text"
            className="form-input"
            placeholder="Short text answer..."
            readOnly
            style={{
              background: "#f8fafc",
              color: "#94a3b8",
              borderStyle: "dashed",
              cursor: "default",
            }}
          />
        );
    }
  };

  return (
    <div
      className="field-preview"
      style={{
        padding: "1.5rem",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        background: "var(--surface)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        transition: "all 0.2s ease",
        cursor: "default",
        textAlign: alignment,
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor =
          design?.primaryColor || "rgba(79, 70, 229, 0.3)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "var(--border)")
      }
    >
      <div
        className="form-group mb-0"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems:
            alignment === "center"
              ? "center"
              : alignment === "right"
                ? "flex-end"
                : "flex-start",
        }}
      >
        <label
          className="form-label"
          style={{
            fontSize: "1rem",
            fontWeight: "600",
            marginBottom: "0.75rem",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
            color: "var(--text-main)",
            justifyContent:
              alignment === "center"
                ? "center"
                : alignment === "right"
                  ? "flex-end"
                  : "flex-start",
            width: "100%",
          }}
        >
          {field.label || (
            <span style={{ color: "#cbd5e1", fontStyle: "italic" }}>
              Untitled Field
            </span>
          )}
          {field.required && (
            <span
              className="badge"
              style={{
                background: "rgba(239,68,68,0.1)",
                color: "var(--danger)",
                padding: "0.15rem 0.5rem",
                fontSize: "0.65rem",
                borderRadius: "4px",
                fontWeight: "bold",
                marginLeft: alignment === "left" ? "auto" : "0",
              }}
            >
              REQUIRED
            </span>
          )}
        </label>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems:
              alignment === "center"
                ? "center"
                : alignment === "right"
                  ? "flex-end"
                  : "flex-start",
          }}
        >
          {renderInput()}
        </div>
      </div>
    </div>
  );
});

export default FieldPreview;
