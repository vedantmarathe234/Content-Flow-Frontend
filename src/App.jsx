import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import UserDashboard from "./pages/user/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import CreateDepartment from "./pages/admin/CreateDepartment"; 
import DepartmentDetails from "./pages/admin/DepartmentDetails"; 
import TeamsPage from "./pages/admin/TeamsPage";
import ContentPage from "./pages/content/ContentPage";
import ContentDatePage from "./pages/content/ContentDatePage";
import ContentDetailsPage from "./pages/content/ContentDetailsPage";
import PendingApprovalsPage from "./pages/content/PendingApprovalsPage";

const MainLayout = () => (
  <div className="min-h-screen bg-slate-50 flex">
    <Sidebar />
    <div className="flex-1 flex flex-col pl-64">
      <Navbar />
      <main className="flex-1 pt-20 p-8 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  </div>
);

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "rgba(17,24,39,0.9)",
            backdropFilter: "blur(10px)",
            color: "#fff",
            padding: "16px 24px",
            fontSize: "16px",
            borderRadius: "16px",
            minWidth: "340px",
            textAlign: "center",
            border: "1px solid rgba(255,255,255,0.1)",
            zIndex: 99999, 
          },
          success: { iconTheme: { primary: "#2563eb", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
      
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/create-department" element={<CreateDepartment />}/>
            <Route path="/admin/department/:id" element={<DepartmentDetails />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/departments" element={<h1>Departments Page</h1>} />
              <Route path="/admin/teams" element={<TeamsPage />} />
              <Route path="/user/teams" element={<TeamsPage />} />
            <Route path="/teams" element={<h1>Teams Page</h1>} />
            <Route path="/users" element={<h1>Users Page</h1>} />
            <Route path="/approvals" element={<h1>Approvals Page</h1>} />
            <Route
  path="/content"
  element={<ContentPage />}
/>
<Route
  path="/content/date/:date"
  element={<ContentDatePage />}
/>
<Route
  path="/content/view/:id"
  element={<ContentDetailsPage />}
/>
<Route
  path="/pending-approvals"
  element={<PendingApprovalsPage />}
/>
            <Route path="/settings" element={<h1>Settings Page</h1>} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;