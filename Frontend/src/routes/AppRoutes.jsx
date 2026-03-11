import { Routes, Route, Navigate } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import Navbar from "../components/Navbar";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const CreateForm = lazy(() => import("../pages/CreateForm"));
const FormsList = lazy(() => import("../pages/FormsList"));
const ResponsesPage = lazy(() => import("../pages/ResponsesPage"));
const FormFill = lazy(() => import("../pages/FormFill"));

const PageLoader = () => (
  <div
    style={{
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        width: "40px",
        height: "40px",
        border: "3px solid rgba(79,70,229,0.2)",
        borderTopColor: "var(--primary)",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
    <p
      style={{
        marginTop: "1rem",
        color: "var(--text-muted)",
        fontWeight: 500,
        fontSize: "0.875rem",
      }}
    >
      Loading...
    </p>
  </div>
);

const AdminLayout = ({ children }) => (
  <div className="admin-layout">
    <Navbar />
    <main className="admin-main">
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </main>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/create-form"
        element={
          <AdminLayout>
            <CreateForm />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/forms"
        element={
          <AdminLayout>
            <FormsList />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/responses/:id"
        element={
          <AdminLayout>
            <ResponsesPage />
          </AdminLayout>
        }
      />

      {/* Public Route */}
      <Route
        path="/form/:id"
        element={
          <Suspense fallback={<PageLoader />}>
            <FormFill />
          </Suspense>
        }
      />

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AppRoutes;
