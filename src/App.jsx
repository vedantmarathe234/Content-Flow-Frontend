import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from "react-hot-toast";

// Components & Layouts
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import AuthPage from "./pages/AuthPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Settings from "./pages/Settings";
import UserDashboard from "./pages/user/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import CreateDepartment from "./pages/admin/CreateDepartment"; 
import DepartmentDetails from "./pages/admin/DepartmentDetails"; 
import TeamsPage from "./pages/admin/TeamsPage";
import ContentPage from "./pages/content/ContentPage";
import ContentDatePage from "./pages/content/ContentDatePage";
import PendingApprovalsPage from "./pages/content/PendingApprovalsPage";
import TeamCalendarPage from "./pages/content/TeamCalendarPage"; 
import TeamContentDatePage from "./pages/content/TeamContentDatePage";

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
      <Toaster position="top-center" toastOptions={{ duration: 3000, style: { background: "#111827", color: "#fff", borderRadius: "16px" } }} />
      
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        
          {/* Protected Routes */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/create-department" element={<CreateDepartment />}/>
            <Route path="/admin/department/:id" element={<DepartmentDetails />} />
            <Route path="/admin/teams" element={<TeamsPage />} />
            
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/teams" element={<TeamsPage />} />
            
            <Route path="/content" element={<ContentPage />} />
            <Route path="/content/date/:date" element={<ContentDatePage />} />
            <Route path="/team/:teamId/calendar" element={<TeamCalendarPage />} />
            <Route path="/team/:teamId/date/:date" element={<TeamContentDatePage />}
/>
            
            <Route path="/pending-approvals" element={<PendingApprovalsPage />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;