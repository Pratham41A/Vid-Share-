import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import {Login} from "../pages/Login.jsx";
import {Home} from "../pages/Home.jsx";
import {EditEvent} from "../pages/EditEvent.jsx";
import {ViewEvent} from "../pages/ViewEvent.jsx";

import {ProtectedRoute} from "./ProtectedRoute.jsx";
import {PublicRoute} from "./PublicRoute.jsx";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/event/view/:id"
          element={
            <ProtectedRoute>
              <ViewEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/event/edit/:id"
          element={
            <ProtectedRoute>
              <EditEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <Navigate to="/" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}