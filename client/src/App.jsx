import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import Dashboard from "./pages/Dashboard";
import Departments from "./pages/Departments";
import EmployeeList from "./pages/EmployeeList";
import Leaves from "./pages/Leaves";
import Settings from "./pages/Settings";
import Login from "./pages/Login.jsx";
import { ModeToggle } from "./components/mode-toggle";
import Profile from "./pages/Profile";
import { Toaster } from "react-hot-toast"; // Import the Toaster component

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  // Check authentication status
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return !!token && !!user;
  };

  // Redirect logic for protected routes
  const ProtectedElement = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
  };

  // Hide sidebar and header on login page
  const showAppLayout = !isLoginPage && isAuthenticated();

  return (
    <div className="flex min-h-screen w-full">
      {/* Add Toaster component here - position it outside your main layout */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "calc(var(--radius) - 2px)",
          }
        }}
      />

      {showAppLayout && <AppSidebar />}

      <main className="flex-1 p-4 transition-all">
        {showAppLayout && (
          <div className="flex items-center justify-between mb-4">
            <SidebarTrigger />
            <ModeToggle />
          </div>
        )}

        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated() ? <Navigate to="/" replace /> : <Login />
            }
          />
          <Route
            path="/"
            element={
              <ProtectedElement>
                <Dashboard />
              </ProtectedElement>
            }
          />
          <Route
            path="/departments"
            element={
              <ProtectedElement>
                <Departments />
              </ProtectedElement>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedElement>
                <EmployeeList />
              </ProtectedElement>
            }
          />
          <Route
            path="/leaves"
            element={
              <ProtectedElement>
                <Leaves />
              </ProtectedElement>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedElement>
                <Settings />
              </ProtectedElement>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedElement>
                <Profile />
              </ProtectedElement>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
