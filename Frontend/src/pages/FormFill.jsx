import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormRenderer from "../components/FormRenderer";
import { getFormById, submitResponse } from "../services/api";

const FormFill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        const res = await getFormById(id);
        if (res.data?.success) {
          setForm(res.data.data);
          document.title = `${res.data.data.title} | FormBuilder`;
        } else {
          setError("Form not found or has been deleted.");
        }
      } catch (err) {
        if (err.response?.status === 404 || err.response?.status === 400) {
          setError("Form not found or has been deleted.");
        } else {
          setError(
            "We couldn't load this form right now. Please check your internet connection or try again later.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchForm();
    }
  }, [id]);

  const handleFormSubmit = async (answers) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const payload = { formId: id, answers };
      const res = await submitResponse(payload);

      if (res.data?.success) {
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "An error occurred while submitting your response. Please try again.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        className="public-form-container"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f1f5f9",
          padding: "1rem",
        }}
      >
        <div
          className="card text-center py-4"
          style={{
            width: "100%",
            maxWidth: "650px",
            padding: "4rem 2rem",
            borderRadius: "1rem",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
          }}
        >
          <div
            className="spinner"
            style={{
              width: "48px",
              height: "48px",
              border: "4px solid rgba(79, 70, 229, 0.1)",
              borderTopColor: "var(--primary)",
              borderRadius: "50%",
              animation:
                "spin 1s cubic-bezier(0.55, 0.085, 0.68, 0.53) infinite",
              margin: "0 auto 1.5rem auto",
            }}
          />
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "var(--text-main)",
              marginBottom: "0.5rem",
            }}
          >
            Loading Form...
          </h2>
          <p className="text-muted" style={{ fontSize: "1.125rem" }}>
            Preparing the questions for you.
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (error && !form) {
    return (
      <div
        className="public-form-container"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f1f5f9",
          padding: "1rem",
        }}
      >
        <div
          className="card py-4"
          style={{
            width: "100%",
            maxWidth: "600px",
            padding: "3rem",
            textAlign: "center",
            borderRadius: "1rem",
            borderTop: "6px solid var(--danger)",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              color: "var(--danger)",
              fontSize: "4rem",
              marginBottom: "1rem",
              opacity: 0.9,
            }}
          >
            &#9888;
          </div>
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: "800",
              marginBottom: "1rem",
              color: "var(--text-main)",
            }}
          >
            Form Unavailable
          </h2>
          <p
            className="text-muted mb-4"
            style={{ fontSize: "1.125rem", lineHeight: "1.6" }}
          >
            {error}
          </p>
          <button
            className="btn btn-outline"
            onClick={() => navigate("/")}
            style={{ padding: "0.75rem 2rem", fontWeight: "600" }}
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div
        className="public-form-container"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f1f5f9",
          padding: "1rem",
        }}
      >
        <div
          className="card py-4"
          style={{
            width: "100%",
            maxWidth: "600px",
            padding: "4rem 3rem",
            textAlign: "center",
            borderRadius: "1rem",
            borderTop: "6px solid var(--success)",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
            animation: "slideUp 0.5s ease-out",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.1)",
              color: "var(--success)",
              fontSize: "3rem",
              marginBottom: "1.5rem",
            }}
          >
            &#10003;
          </div>
          <h2
            style={{
              fontSize: "2.25rem",
              marginBottom: "1rem",
              color: "var(--text-main)",
              fontWeight: "800",
              letterSpacing: "-0.025em",
            }}
          >
            Response Recorded
          </h2>
          <p
            className="text-muted mb-4 text-lg"
            style={{
              fontSize: "1.125rem",
              lineHeight: "1.6",
              marginBottom: "2.5rem",
            }}
          >
            Thank you for participating! Your response to{" "}
            <strong>"{form?.title}"</strong> has been successfully submitted and
            stored.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
            style={{
              padding: "1rem 2rem",
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: "2rem",
              boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.3)",
            }}
          >
            Submit Another Response
          </button>
          <div
            style={{
              marginTop: "2rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid var(--border)",
              fontSize: "0.875rem",
              color: "var(--text-muted)",
            }}
          >
            Powered by <strong>FormBuilder</strong>
          </div>
        </div>
        <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </div>
    );
  }

  return (
    <div
      className="public-form-container"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        background: form?.design?.backgroundColor || "#f1f5f9",
        padding: "3rem 1rem",
        fontFamily: form?.design?.fontFamily || "Inter, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: form?.design?.formWidth || "750px",
          animation: "fadeIn 0.5s ease-out",
        }}
      >
        {/* Error notification banner on top of form */}
        {error && (
          <div
            className="mb-4"
            style={{
              backgroundColor: "#fef2f2",
              borderColor: "#fca5a5",
              color: "#b91c1c",
              padding: "1rem 1.5rem",
              borderRadius: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              boxShadow: "0 4px 6px -1px rgba(239, 68, 68, 0.1)",
              border: "1px solid #fca5a5",
            }}
          >
            <span style={{ fontSize: "1.25rem" }}>&#9888;</span>
            <div style={{ fontWeight: "500" }}>{error}</div>
          </div>
        )}

        <div
          className="card public-form-card"
          style={{
            padding: "3rem 4rem",
            borderTop: `8px solid ${form?.design?.primaryColor || "var(--primary)"}`,
            borderRadius: "1rem",
            boxShadow:
              "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
            background: "#ffffff",
            width: "100%",
          }}
        >
          <div
            className="form-header mb-4 pb-4"
            style={{
              borderBottom: "2px solid #f1f5f9",
              marginBottom: "2.5rem",
              textAlign: form?.design?.fieldAlignment || "left",
            }}
          >
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: "800",
                marginBottom: "1rem",
                color: "var(--text-main)",
                letterSpacing: "-0.025em",
                lineHeight: "1.2",
              }}
            >
              {form?.title || "Untitled Form"}
            </h1>
            {form?.description && (
              <p
                className="text-muted mt-2"
                style={{
                  fontSize: "1.125rem",
                  lineHeight: "1.7",
                  color: "#475569",
                }}
              >
                {form.description}
              </p>
            )}
            <div
              style={{
                marginTop: "1.5rem",
                fontSize: "0.875rem",
                color: "var(--danger)",
                fontWeight: "600",
              }}
            >
              * Indicates required question
            </div>
          </div>

          <FormRenderer
            fields={form?.fields || []}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
            design={form?.design}
          />
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "2rem",
            paddingBottom: "2rem",
            color: "#94a3b8",
            fontSize: "0.875rem",
            fontWeight: "500",
          }}
        >
          This content is created with <strong>FormBuilder</strong>. Report
          Abuse
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 640px) {
          .public-form-container { padding: 1rem 0; background: #ffffff; }
          .public-form-card { padding: 2rem 1.5rem !important; border-radius: 0 !important; box-shadow: none !important; border-top: 6px solid var(--primary) !important; }
        }
      `}</style>
    </div>
  );
};

export default FormFill;
