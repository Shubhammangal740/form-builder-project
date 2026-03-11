import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FieldBuilder from "../components/FieldBuilder";
import FieldPreview from "../components/FieldPreview";
import { createForm } from "../services/api";

const CreateForm = () => {
  useEffect(() => {
    document.title = "Create Form | FormBuilder";
  }, []);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState([]);
  const [designSettings, setDesignSettings] = useState({
    primaryColor: "#4f46e5",
    backgroundColor: "#ffffff",
    fontFamily: "Inter",
    fieldAlignment: "left",
    formWidth: "600px",
    buttonColor: "#4f46e5",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleDesignChange = (key, value) => {
    setDesignSettings((prev) => ({ ...prev, [key]: value }));
  };

  const generateId = () =>
    `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const handleAddField = () => {
    const newField = {
      id: generateId(),
      label: "",
      type: "text",
      required: false,
      options: [],
    };
    setFields([...fields, newField]);
    setError("");
    setSuccess("");

    // Auto-scroll to newly added field
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  const handleUpdateField = (id, updatedField) => {
    setFields(fields.map((f) => (f.id === id ? updatedField : f)));
    setError("");
    setSuccess("");
  };

  const handleRemoveField = (id) => {
    setFields(fields.filter((f) => f.id !== id));
    setError("");
    setSuccess("");
  };

  const clearMessages = () => {
    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 5000);
  };

  const handleSaveForm = async () => {
    setError("");
    setSuccess("");

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Form title is required to save the form.");
      clearMessages();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (fields.length === 0) {
      setError("Please add at least one field to your form.");
      clearMessages();
      return;
    }

    const invalidField = fields.find((f) => !f.label.trim());
    if (invalidField) {
      setError("All form fields must have a label. Please check your fields.");
      clearMessages();
      return;
    }

    const needsOptionsTypes = ["dropdown", "radio", "checkbox"];
    const invalidOptionsField = fields.find(
      (f) =>
        needsOptionsTypes.includes(f.type) &&
        (!f.options || f.options.length === 0),
    );

    if (invalidOptionsField) {
      setError(
        `Field "${invalidOptionsField.label || "Untitled"}" requires at least one option.`,
      );
      clearMessages();
      return;
    }

    setIsSaving(true);

    const formData = {
      title: trimmedTitle,
      description: description.trim(),
      design: designSettings,
      fields: fields.map((f) => ({
        label: f.label.trim(),
        type: f.type,
        required: f.required,
        ...(["dropdown", "radio", "checkbox"].includes(f.type) &&
        f.options?.length > 0
          ? { options: f.options }
          : {}),
      })),
    };

    try {
      const res = await createForm(formData);
      if (res.data?.success) {
        setSuccess("Form created successfully!");
        clearMessages();
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => navigate("/admin/forms"), 1500);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to save form. Please try again.";
      setError(msg);
      clearMessages();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="page-container"
      style={{ animation: "fadeIn 0.5s ease-out" }}
    >
      {/* Sticky Top Header for Save Action */}
      <div
        style={{
          position: "sticky",
          top: "70px",
          zIndex: 50,
          background: "rgba(249, 250, 251, 0.9)",
          backdropFilter: "blur(10px)",
          paddingTop: "1rem",
          paddingBottom: "1rem",
          marginBottom: "1.5rem",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          className="page-header flex-between mb-0"
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}
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
              Create New Form
            </h2>
            <p className="text-muted mt-2 text-sm">
              Design and configure a new dynamic form.
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleSaveForm}
            disabled={isSaving}
            style={{
              padding: "0.75rem 2rem",
              fontSize: "1rem",
              fontWeight: "bold",
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.3)",
            }}
          >
            {isSaving ? (
              <>
                <span className="spinner-small" /> Saving...
              </>
            ) : (
              <>&#128190; Save Form</>
            )}
          </button>
        </div>
      </div>

      <div style={{ padding: "0 1rem", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Floating Notifications */}
        {error && (
          <div
            className="card mb-4"
            style={{
              backgroundColor: "#fef2f2",
              borderColor: "#fca5a5",
              color: "#b91c1c",
              padding: "1rem 1.5rem",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              animation: "slideDown 0.3s ease-out",
              boxShadow: "0 4px 6px -1px rgba(239, 68, 68, 0.1)",
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>&#9888;</span>
            <div>
              <strong>Hold on!</strong> {error}
            </div>
          </div>
        )}

        {success && (
          <div
            className="card mb-4"
            style={{
              backgroundColor: "#ecfdf5",
              borderColor: "#6ee7b7",
              color: "#047857",
              padding: "1rem 1.5rem",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              animation: "slideDown 0.3s ease-out",
              boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.1)",
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>&#10003;</span>
            <div>
              <strong>Success!</strong> {success}
            </div>
          </div>
        )}

        <div
          className="grid grid-2"
          style={{
            alignItems: "start",
            gridTemplateColumns: "minmax(300px, 1fr) minmax(350px, 1.25fr)",
            gap: "2rem",
          }}
        >
          {/* Editor sidebar */}
          <div className="form-builder-sidebar">
            {/* Form Details Card */}
            <div
              className="card mb-4"
              style={{
                padding: "2rem",
                borderTop: "4px solid var(--primary)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "rgba(79,70,229,0.1)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  1
                </div>
                <h3
                  style={{ fontSize: "1.25rem", fontWeight: "700", margin: 0 }}
                >
                  Form Details
                </h3>
              </div>

              <div className="form-group">
                <label
                  className="form-label text-sm"
                  style={{ fontWeight: "600" }}
                >
                  Form Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Customer Feedback Survey"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  style={{ fontSize: "1rem", padding: "0.75rem 1rem" }}
                />
              </div>

              <div className="form-group mb-0">
                <label
                  className="form-label text-sm"
                  style={{ fontWeight: "600" }}
                >
                  Description (Optional)
                </label>
                <textarea
                  className="form-input"
                  placeholder="Explain the purpose of this form..."
                  rows="3"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setSuccess("");
                  }}
                  style={{ resize: "vertical" }}
                />
              </div>
            </div>

            {/* Design Settings Card */}
            <div
              className="card mb-4"
              style={{
                padding: "2rem",
                borderTop: "4px solid #10b981",
                borderRadius: "var(--radius-lg)",
                marginTop: "1.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "rgba(16, 185, 129, 0.1)",
                    color: "#10b981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  2
                </div>
                <h3
                  style={{ fontSize: "1.25rem", fontWeight: "700", margin: 0 }}
                >
                  Form Design Settings
                </h3>
              </div>

              <div className="grid grid-2" style={{ gap: "1.25rem" }}>
                <div className="form-group mb-0">
                  <label
                    className="form-label text-sm"
                    style={{ fontWeight: "600" }}
                  >
                    Primary Color
                  </label>
                  <input
                    type="color"
                    className="form-input"
                    value={designSettings.primaryColor}
                    onChange={(e) =>
                      handleDesignChange("primaryColor", e.target.value)
                    }
                    style={{
                      padding: "0.2rem 0.5rem",
                      height: "40px",
                      cursor: "pointer",
                    }}
                  />
                </div>
                <div className="form-group mb-0">
                  <label
                    className="form-label text-sm"
                    style={{ fontWeight: "600" }}
                  >
                    Background Color
                  </label>
                  <input
                    type="color"
                    className="form-input"
                    value={designSettings.backgroundColor}
                    onChange={(e) =>
                      handleDesignChange("backgroundColor", e.target.value)
                    }
                    style={{
                      padding: "0.2rem 0.5rem",
                      height: "40px",
                      cursor: "pointer",
                    }}
                  />
                </div>
                <div className="form-group mb-0">
                  <label
                    className="form-label text-sm"
                    style={{ fontWeight: "600" }}
                  >
                    Submit Button Color
                  </label>
                  <input
                    type="color"
                    className="form-input"
                    value={designSettings.buttonColor}
                    onChange={(e) =>
                      handleDesignChange("buttonColor", e.target.value)
                    }
                    style={{
                      padding: "0.2rem 0.5rem",
                      height: "40px",
                      cursor: "pointer",
                    }}
                  />
                </div>
                <div className="form-group mb-0">
                  <label
                    className="form-label text-sm"
                    style={{ fontWeight: "600" }}
                  >
                    Form Width
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={designSettings.formWidth}
                    onChange={(e) =>
                      handleDesignChange("formWidth", e.target.value)
                    }
                    placeholder="e.g. 600px, 100%"
                    title="Enter a valid CSS width (e.g., 600px or 100%)"
                  />
                </div>
                <div className="form-group mb-0">
                  <label
                    className="form-label text-sm"
                    style={{ fontWeight: "600" }}
                  >
                    Font Family
                  </label>
                  <select
                    className="form-input"
                    value={designSettings.fontFamily}
                    onChange={(e) =>
                      handleDesignChange("fontFamily", e.target.value)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <option value="Inter">Inter (Default)</option>
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="Georgia, sans-serif">Georgia</option>
                    <option value="'Times New Roman', serif">
                      Times New Roman
                    </option>
                    <option value="'Courier New', serif">Courier New</option>
                    <option value="'Trebuchet MS', monospace">
                      Trebuchet MS
                    </option>
                  </select>
                </div>
                <div className="form-group mb-0">
                  <label
                    className="form-label text-sm"
                    style={{ fontWeight: "600" }}
                  >
                    Field Alignment
                  </label>
                  <select
                    className="form-input"
                    value={designSettings.fieldAlignment}
                    onChange={(e) =>
                      handleDesignChange("fieldAlignment", e.target.value)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Fields List Wrapper */}
            <div style={{ marginTop: "2.5rem" }}>
              <div className="flex-between mb-4">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "rgba(79,70,229,0.1)",
                      color: "var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                    }}
                  >
                    3
                  </div>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "700",
                      margin: 0,
                    }}
                  >
                    Form Fields
                  </h3>
                </div>
                {fields.length > 0 && (
                  <span
                    className="badge"
                    style={{
                      background: "rgba(79, 70, 229, 0.1)",
                      color: "var(--primary)",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "2rem",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                    }}
                  >
                    {fields.length} Field{fields.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {fields.length === 0 ? (
                <div
                  className="card text-center py-4 mb-4"
                  style={{
                    padding: "3rem 2rem",
                    border: "2px dashed var(--border)",
                    background: "rgba(255,255,255,0.5)",
                    borderRadius: "var(--radius-lg)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "2.5rem",
                      opacity: 0.3,
                      marginBottom: "1rem",
                    }}
                  >
                    &#128203;
                  </div>
                  <h4
                    style={{
                      fontWeight: "600",
                      color: "var(--text-main)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    No fields configured
                  </h4>
                  <p
                    className="text-muted text-sm"
                    style={{ marginBottom: "1.5rem", lineHeight: "1.5" }}
                  >
                    Build your form by adding text inputs, multiple choice,
                    drop-downs, and more.
                  </p>
                  <button
                    className="btn btn-outline"
                    onClick={handleAddField}
                    style={{ borderStyle: "dashed" }}
                  >
                    + Start Adding Fields
                  </button>
                </div>
              ) : (
                <div
                  className="fields-container"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  {fields.map((field, index) => (
                    <div key={field.id} style={{ position: "relative" }}>
                      <FieldBuilder
                        field={field}
                        onUpdate={handleUpdateField}
                        onRemove={handleRemoveField}
                        index={index}
                      />
                    </div>
                  ))}
                </div>
              )}

              {fields.length > 0 && (
                <button
                  className="btn btn-outline w-full mb-4"
                  onClick={handleAddField}
                  style={{
                    padding: "1rem",
                    borderStyle: "dashed",
                    borderWidth: "2px",
                    background: "rgba(255,255,255,0.5)",
                    color: "var(--primary)",
                    borderColor: "rgba(79,70,229,0.3)",
                    fontWeight: "600",
                    fontSize: "1rem",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(79,70,229,0.05)";
                    e.currentTarget.style.borderColor = "var(--primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.5)";
                    e.currentTarget.style.borderColor = "rgba(79,70,229,0.3)";
                  }}
                >
                  &#10133; Add New Field
                </button>
              )}
            </div>
          </div>

          {/* Live Preview Side */}
          <div
            className="form-builder-preview sticky-preview"
            style={{ position: "sticky", top: "150px" }}
          >
            <div
              className="card bg-light"
              style={{
                border: "1px solid var(--border)",
                background: "#ffffff",
                borderRadius: "var(--radius-lg)",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background: "#f8fafc",
                  padding: "1rem 1.5rem",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: "700",
                    color: "#475569",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#10b981",
                    }}
                  ></span>{" "}
                  Live Preview
                </h3>
              </div>

              <div
                className="preview-container flex-col align-center"
                style={{
                  minHeight: "400px",
                  maxHeight: "calc(100vh - 250px)",
                  overflowY: "auto",
                  padding: "2rem",
                  scrollBehavior: "smooth",
                  background: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <div
                  className="preview-content-box w-full"
                  style={{
                    maxWidth: designSettings.formWidth || "600px",
                    background: designSettings.backgroundColor || "#ffffff",
                    fontFamily:
                      designSettings.fontFamily || "Inter, sans-serif",
                    padding: "2rem",
                    borderRadius: "12px",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    width: "100%",
                  }}
                >
                  <div
                    className="preview-header mb-4 mt-2"
                    style={{
                      paddingBottom: "1.5rem",
                      borderBottom:
                        fields.length > 0 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "2rem",
                        fontWeight: "800",
                        marginBottom: "0.75rem",
                        color: "var(--text-main)",
                        wordBreak: "break-word",
                        lineHeight: "1.2",
                        letterSpacing: "-0.025em",
                      }}
                    >
                      {title.trim() || (
                        <span style={{ color: "#cbd5e1" }}>Untitled Form</span>
                      )}
                    </h2>
                    <p
                      className="text-muted mt-2"
                      style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        lineHeight: "1.6",
                        fontSize: "1.125rem",
                      }}
                    >
                      {description.trim() || (
                        <span style={{ color: "#cbd5e1" }}>
                          No description provided...
                        </span>
                      )}
                    </p>
                  </div>

                  {fields.length === 0 ? (
                    <div
                      className="empty-state text-center py-4 mt-4"
                      style={{
                        borderRadius: "var(--radius-md)",
                        padding: "2.5rem 1.5rem",
                        opacity: 0.6,
                      }}
                    >
                      <div
                        style={{
                          width: "64px",
                          height: "64px",
                          margin: "0 auto 1rem auto",
                          borderRadius: "50%",
                          background: "#f1f5f9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.5rem",
                          color: "#94a3b8",
                        }}
                      >
                        &#128065;
                      </div>
                      <p className="text-muted text-sm">
                        Your form fields will appear exactly as they do here for
                        users filling the form.
                      </p>
                    </div>
                  ) : (
                    <div
                      className="preview-list"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.5rem",
                        paddingBottom: "2rem",
                      }}
                    >
                      {fields.map((field) => (
                        <FieldPreview
                          key={field.id}
                          field={field}
                          design={designSettings}
                        />
                      ))}
                      <button
                        className="btn btn-primary w-full"
                        disabled
                        style={{
                          opacity: 0.8,
                          padding: "0.875rem",
                          backgroundColor:
                            designSettings.buttonColor || "var(--primary)",
                          borderColor:
                            designSettings.buttonColor || "var(--primary)",
                        }}
                      >
                        Submit Form (Preview)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .spinner-small { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 1s linear infinite; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        @media (max-width: 900px) {
          .grid-2 { grid-template-columns: 1fr !important; }
          .sticky-preview { position: static !important; margin-top: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default CreateForm;
