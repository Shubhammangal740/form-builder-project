import React, { useState } from "react";

const FormRenderer = ({ fields, onSubmit, isSubmitting, design }) => {
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const alignment = design?.fieldAlignment || "left";

  const validateFieldValue = (field, value) => {
    if (value === undefined || value === null || value === "") return null;
    if (Array.isArray(value) && value.length === 0) return null;

    switch (field.type) {
      case "email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          return "Please enter a valid email address (e.g. user@example.com)";
        }
        break;
      }
      case "number": {
        if (isNaN(value) || value.toString().trim() === "") {
          return "Please enter a valid number";
        }
        break;
      }
      case "dropdown": {
        if (
          field.options &&
          field.options.length > 0 &&
          !field.options.includes(value)
        ) {
          return "Please select a valid option from the list";
        }
        break;
      }
      case "radio": {
        if (
          field.options &&
          field.options.length > 0 &&
          !field.options.includes(value)
        ) {
          return "Please select a valid option";
        }
        break;
      }
      case "checkbox": {
        if (Array.isArray(value) && field.options && field.options.length > 0) {
          const invalid = value.filter((v) => !field.options.includes(v));
          if (invalid.length > 0) {
            return "One or more selected options are invalid";
          }
        }
        break;
      }
      case "text":
      case "textarea": {
        if (typeof value === "string" && value.trim().length > 5000) {
          return "Response is too long (max 5000 characters)";
        }
        break;
      }
      default:
        break;
    }
    return null;
  };

  const handleChange = (label, value) => {
    setAnswers((prev) => ({ ...prev, [label]: value }));
    const field = fields.find((f) => f.label === label);
    if (field) {
      const typeError = validateFieldValue(field, value);
      if (typeError) {
        setErrors((prev) => ({ ...prev, [label]: typeError }));
      } else if (errors[label]) {
        setErrors((prev) => ({ ...prev, [label]: null }));
      }
    } else if (errors[label]) {
      setErrors((prev) => ({ ...prev, [label]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    fields.forEach((field) => {
      const val = answers[field.label];

      // Required field check
      if (field.required) {
        if (val === undefined || val === null || val === "") {
          newErrors[field.label] = "Please reply to this required field";
          isValid = false;
          return;
        } else if (Array.isArray(val) && val.length === 0) {
          newErrors[field.label] = "Please select at least one option";
          isValid = false;
          return;
        }
      }

      // Field-type validation (only if value is present)
      const typeError = validateFieldValue(field, val);
      if (typeError) {
        newErrors[field.label] = typeError;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (validateForm()) {
      const cleanAnswers = Object.entries(answers).reduce((acc, [key, val]) => {
        acc[key] = typeof val === "string" ? val.trim() : val;
        return acc;
      }, {});

      if (onSubmit) {
        onSubmit(cleanAnswers);
      }
    } else {
      // Find first error and scroll to it
      setTimeout(() => {
        const firstError = document.querySelector(".error-message");
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  };

  if (!fields || fields.length === 0) {
    return (
      <p
        className="text-muted text-center py-4 empty-state"
        style={{ padding: "3rem", fontSize: "1.125rem" }}
      >
        This form currently has no questions available.
      </p>
    );
  }

  const renderInput = (field) => {
    const value = answers[field.label] || "";
    const hasError = !!errors[field.label];

    const baseStyle = {
      borderColor: hasError ? "var(--danger)" : undefined,
      background: hasError ? "rgba(239, 68, 68, 0.02)" : "var(--surface)",
      transition: "all 0.2s",
      padding: "0.75rem 1rem",
      fontSize: "1rem",
    };

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            className={`form-input`}
            placeholder="Type your response here..."
            rows="4"
            value={value}
            onChange={(e) => handleChange(field.label, e.target.value)}
            style={{ ...baseStyle, resize: "vertical" }}
          />
        );

      case "dropdown":
        return (
          <select
            className={`form-input`}
            value={value}
            onChange={(e) => handleChange(field.label, e.target.value)}
            style={{ ...baseStyle, cursor: "pointer" }}
          >
            <option value="" disabled hidden>
              Choose an option
            </option>
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
            className="radio-group"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              marginTop: "0.75rem",
              padding: "0.5rem",
            }}
          >
            {field.options && field.options.length > 0 ? (
              field.options.map((opt, idx) => (
                <label
                  key={idx}
                  className="flex-start w-max-content"
                  style={{
                    cursor: "pointer",
                    width: "max-content",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f8fafc")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <input
                    type="radio"
                    name={`radio_${field.label}`}
                    value={opt}
                    checked={value === opt}
                    onChange={(e) => handleChange(field.label, e.target.value)}
                    style={{
                      width: "20px",
                      height: "20px",
                      accentColor: "var(--primary)",
                      cursor: "pointer",
                    }}
                  />
                  <span
                    className="text-sm ml-2"
                    style={{ fontSize: "1rem", color: "var(--text-main)" }}
                  >
                    {opt}
                  </span>
                </label>
              ))
            ) : (
              <span className="text-muted text-sm italic">
                No options available
              </span>
            )}
          </div>
        );

      case "checkbox": {
        const checkValues = Array.isArray(value) ? value : [];
        const handleCheckboxChange = (opt, isChecked) => {
          if (isChecked) {
            handleChange(field.label, [...checkValues, opt]);
          } else {
            handleChange(
              field.label,
              checkValues.filter((v) => v !== opt),
            );
          }
        };

        return (
          <div
            className="checkbox-group"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              marginTop: "0.75rem",
              padding: "0.5rem",
            }}
          >
            {field.options && field.options.length > 0 ? (
              field.options.map((opt, idx) => (
                <label
                  key={idx}
                  className="flex-start w-max-content"
                  style={{
                    cursor: "pointer",
                    width: "max-content",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f8fafc")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <input
                    type="checkbox"
                    value={opt}
                    checked={checkValues.includes(opt)}
                    onChange={(e) =>
                      handleCheckboxChange(opt, e.target.checked)
                    }
                    style={{
                      width: "20px",
                      height: "20px",
                      accentColor: "var(--primary)",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  />
                  <span
                    className="text-sm ml-2"
                    style={{ fontSize: "1rem", color: "var(--text-main)" }}
                  >
                    {opt}
                  </span>
                </label>
              ))
            ) : (
              <span className="text-muted text-sm italic">
                No options available
              </span>
            )}
          </div>
        );
      }

      case "number":
        return (
          <input
            type="number"
            className={`form-input`}
            placeholder="e.g. 100"
            value={value}
            onChange={(e) => handleChange(field.label, e.target.value)}
            style={baseStyle}
          />
        );

      case "email":
        return (
          <input
            type="email"
            className={`form-input`}
            placeholder="example@domain.com"
            value={value}
            onChange={(e) => handleChange(field.label, e.target.value)}
            style={baseStyle}
          />
        );

      case "text":
      default:
        return (
          <input
            type="text"
            className={`form-input`}
            placeholder="Enter a short answer"
            value={value}
            onChange={(e) => handleChange(field.label, e.target.value)}
            style={baseStyle}
          />
        );
    }
  };

  return (
    <form className="form-renderer" onSubmit={handleSubmit} noValidate>
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {fields.map((field, index) => (
          <div
            key={field._id || field.id || field.label}
            className="card form-item-container"
            style={{
              padding: "2rem",
              border: errors[field.label]
                ? "1px solid var(--danger)"
                : "1px solid var(--border)",
              background: "var(--surface)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
              borderRadius: "var(--radius-lg)",
              textAlign: alignment,
            }}
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
                  fontSize: "1.125rem",
                  fontWeight: "bold",
                  marginBottom: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  color: "var(--text-main)",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  justifyContent:
                    alignment === "center"
                      ? "center"
                      : alignment === "right"
                        ? "flex-end"
                        : "flex-start",
                  width: "100%",
                }}
              >
                <span
                  style={{
                    color: design?.primaryColor || "var(--primary)",
                    opacity: 0.5,
                    marginRight: "0.5rem",
                  }}
                >
                  {index + 1}.
                </span>{" "}
                {field.label || "Untitled Question"}
                {field.required && (
                  <span
                    className="badge"
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      color: "var(--danger)",
                      padding: "0.2rem 0.6rem",
                      fontSize: "0.7rem",
                      borderRadius: "4px",
                      fontWeight: "bold",
                      marginLeft: alignment === "left" ? "auto" : "0",
                    }}
                  >
                    REQUIRED
                  </span>
                )}
              </label>

              <div style={{ paddingLeft: "0.5rem" }}>
                {renderInput(field)}

                {errors[field.label] && (
                  <div
                    className="error-message flex-start mt-3"
                    style={{
                      color: "var(--danger)",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      animation: "fadeIn 0.2s",
                      padding: "0.5rem",
                      background: "rgba(239, 68, 68, 0.05)",
                      borderRadius: "4px",
                    }}
                  >
                    <span style={{ fontSize: "1rem", marginRight: "0.25rem" }}>
                      &#9888;
                    </span>{" "}
                    {errors[field.label]}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="submit-actions mt-4 pt-4"
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <button
          type="submit"
          className="btn btn-primary"
          style={{
            padding: "1rem 3rem",
            fontSize: "1.125rem",
            fontWeight: "bold",
            opacity: isSubmitting ? 0.8 : 1,
            cursor: isSubmitting ? "not-allowed" : "pointer",
            boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.3)",
            borderRadius: "2rem",
            backgroundColor: design?.buttonColor || "var(--primary)",
            borderColor: design?.buttonColor || "var(--primary)",
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span
                className="spinner-small"
                style={{
                  display: "inline-block",
                  width: "16px",
                  height: "16px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "white",
                  borderBottomColor: "white",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  marginRight: "0.5rem",
                }}
              />{" "}
              Submitting Response...
            </>
          ) : (
            <>&#10003; Submit My Response</>
          )}
        </button>
      </div>

      <style>{`
        .form-item-container { transition: box-shadow 0.2s ease, transform 0.2s ease; }
        .form-item-container:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
        .form-input:focus { box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) !important; border-color: var(--primary) !important; background-color: var(--surface) !important; }
      `}</style>
    </form>
  );
};

export default FormRenderer;
