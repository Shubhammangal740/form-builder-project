export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://form-builder-backend-wnlq.onrender.com/api";

export const FIELD_TYPES = {
  TEXT: "text",
  TEXTAREA: "textarea",
  NUMBER: "number",
  EMAIL: "email",
  CHECKBOX: "checkbox",
  RADIO: "radio",
  DROPDOWN: "dropdown",
};

export const THEME = {
  colors: {
    primary: "#4f46e5",
    primaryHover: "#4338ca",
    background: "#f9fafb",
    surface: "#ffffff",
    text: "#111827",
    textSecondary: "#6b7280",
    border: "#e5e7eb",
    danger: "#ef4444",
  },
  spacing: {
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  borderRadius: {
    md: "0.375rem",
    lg: "0.5rem",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
};
