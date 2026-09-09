import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import AdminLogin from "./AdminLogin.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>

        {/* Formulaire client */}
        <Route path="/" element={<App />} />

        {/* Connexion administrateur */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* Dashboard protégé */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);