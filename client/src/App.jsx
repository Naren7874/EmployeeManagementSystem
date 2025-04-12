import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import Dashboard from "./pages/Dashboard";
import Departments from "./pages/Departments";
import EmployeeList from "./pages/EmployeeList";
import Leaves from "./pages/Leaves";
import Settings from "./pages/Settings";
import Login from "./pages/Login.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { ModeToggle } from "./components/mode-toggle";
import Profile from "./pages/Profile";

function App() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <div className="flex min-h-screen w-full">
      {!isLogin && <AppSidebar />}

      <main className="flex-1 p-4 transition-all">
        {!isLogin && (
          <div className="flex items-center justify-between mb-4">
            <SidebarTrigger />
            <ModeToggle />
          </div>
        )}

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/departments"
            element={
              <PrivateRoute>
                <Departments />
              </PrivateRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <PrivateRoute>
                <EmployeeList />
              </PrivateRoute>
            }
          />
          <Route
            path="/leaves"
            element={
              <PrivateRoute>
                <Leaves />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile/>
            </PrivateRoute>
          } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
