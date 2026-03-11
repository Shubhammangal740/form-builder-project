import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

const globalStyles = `
  :root {
    --primary: #4f46e5;
    --primary-hover: #4338ca;
    --bg: #f9fafb;
    --surface: #ffffff;
    --text-main: #111827;
    --text-muted: #6b7280;
    --border: #e5e7eb;
    --danger: #ef4444;
    --success: #10b981;
    --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
    --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background-color: var(--bg);
    color: var(--text-main);
    font-family: var(--font-family);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  a { text-decoration: none; color: inherit; }
  
  /* Layouts */
  .admin-layout { min-height: 100vh; display: flex; flex-direction: column; }
  .admin-main { flex: 1; padding: 2rem; max-width: 1200px; margin: 0 auto; width: 100%; }
  
  .page-container { animation: fadeIn 0.4s ease-out; }
  .page-header { margin-bottom: 2rem; }
  .page-title { font-size: 1.875rem; font-weight: 700; color: var(--text-main); letter-spacing: -0.025em; }
  .flex-between { display: flex; justify-content: space-between; align-items: center; }
  .flex-start { display: flex; justify-content: flex-start; align-items: center; gap: 0.5rem; }

  /* Navbar */
  .navbar { background: var(--surface); border-bottom: 1px solid var(--border); padding: 1rem 2rem; position: sticky; top: 0; z-index: 10; box-shadow: var(--shadow-sm); }
  .navbar-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
  .navbar-logo { font-size: 1.25rem; font-weight: 800; color: var(--primary); letter-spacing: -0.025em;}
  .navbar-links { display: flex; gap: 1.5rem; }
  .nav-link { font-weight: 500; color: var(--text-muted); transition: color 0.2s, background 0.2s; padding: 0.5rem 0.75rem; border-radius: var(--radius-md); font-size: 0.875rem; }
  .nav-link:hover, .nav-link.active { color: var(--primary); background: rgba(79, 70, 229, 0.05); }

  /* Typography & Utilities */
  .text-muted { color: var(--text-muted); }
  .text-center { text-align: center; }
  .text-sm { font-size: 0.875rem; }
  .text-danger { color: var(--danger); }
  .mb-0 { margin-bottom: 0 !important; }
  .mb-2 { margin-bottom: 0.5rem; }
  .mb-4 { margin-bottom: 1rem; }
  .mt-2 { margin-top: 0.5rem; }
  .mt-4 { margin-top: 1rem; }
  .ml-2 { margin-left: 0.5rem; }
  .py-4 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
  .p-0 { padding: 0 !important; }
  .w-full { width: 100%; }
  .overflow-hidden { overflow: hidden; }

  /* Components */
  .card { background: var(--surface); border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm); border: 1px solid var(--border); transition: transform 0.2s ease, box-shadow 0.2s ease; }
  .card:hover { box-shadow: var(--shadow-md); }
  .bg-light { background: var(--bg); border: 1px dashed var(--border); box-shadow: none; }
  .bg-light:hover { box-shadow: none; transform: none; }
  
  .grid { display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
  .grid-2 { grid-template-columns: 1fr 2fr; }
  
  @media (max-width: 768px) {
    .grid-2 { grid-template-columns: 1fr; }
    .navbar-container { flex-direction: column; gap: 1rem; }
    .admin-main { padding: 1rem; }
  }

  /* Buttons */
  .btn { display: inline-flex; align-items: center; justify-content: center; padding: 0.6rem 1.25rem; font-weight: 500; border-radius: var(--radius-md); cursor: pointer; transition: all 0.2s ease; border: 1px solid transparent; font-size: 0.875rem; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-primary { background: var(--primary); color: white; }
  .btn-primary:hover:not(:disabled) { background: var(--primary-hover); transform: translateY(-1px); box-shadow: var(--shadow-md); }
  .btn-outline { background: transparent; border-color: var(--border); color: var(--text-main); }
  .btn-outline:hover:not(:disabled) { border-color: var(--primary); color: var(--primary); background: rgba(79, 70, 229, 0.05); }
  
  .btn-danger { background: rgba(239, 68, 68, 0.1); color: var(--danger); border-radius: 50%; width: 28px; height: 28px; padding: 0; line-height: 1; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .btn-danger:hover { background: var(--danger); color: white; transform: scale(1.1); }
  
  .btn-sm { padding: 0.35rem 0.75rem; font-size: 0.75rem; }

  /* Forms */
  .form-group { margin-bottom: 1.25rem; text-align: left; }
  .form-label { display: block; font-weight: 500; margin-bottom: 0.5rem; font-size: 0.875rem; color: var(--text-main); }
  .form-input { width: 100%; padding: 0.6rem 0.8rem; border: 1px solid var(--border); border-radius: var(--radius-md); font-family: inherit; font-size: 0.875rem; transition: border-color 0.2s, box-shadow 0.2s; background: var(--surface); color: var(--text-main); }
  .form-input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(79,70,229,0.15); }
  .form-input:disabled, .form-input[readOnly] { background: var(--bg); color: var(--text-muted); cursor: not-allowed; }

  /* Field Builder & Preview */
  .field-builder-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .preview-list { display: flex; flex-direction: column; gap: 1rem; }
  .field-preview { padding: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); animation: slideIn 0.3s ease-out; }
  .field-preview-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
  .empty-state { border: 1px dashed var(--border); border-radius: var(--radius-md); background: rgba(255,255,255,0.5); }

  /* Forms List */
  .form-card { display: flex; flex-direction: column; justify-content: space-between; }
  .form-card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
  .form-card h3 { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.25rem; line-height: 1.4; color: var(--text-main); }
  .badge { background: rgba(79, 70, 229, 0.1); padding: 0.25rem 0.6rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 600; color: var(--primary); white-space: nowrap; }
  .form-card-actions { display: flex; gap: 0.5rem; margin-top: auto; }

  /* Public Form */
  .public-form-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; background: var(--bg); }
  .public-form-card { width: 100%; max-width: 550px; }

  /* Tables */
  .table-responsive { overflow-x: auto; width: 100%; }
  .table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem; }
  .table th, .table td { padding: 1rem 1.5rem; border-bottom: 1px solid var(--border); white-space: nowrap; }
  .table th { background: #f3f4f6; font-weight: 600; color: var(--text-muted); text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; }
  .table tr:last-child td { border-bottom: none; }
  .table tbody tr { transition: background 0.2s; }
  .table tbody tr:hover { background: #f9fafb; }
  .table tbody tr:nth-child(even) { background: #fafbfc; }
  .table tbody tr:nth-child(even):hover { background: #f1f5f9; }

  /* Animations */
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Selection highlight */
  ::selection { background: rgba(79, 70, 229, 0.15); color: var(--text-main); }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
