import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import { Menu, X } from "lucide-react";
import logoImg from './assets/Athenura.png';
import Sidebar from './components/Sidebar';
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar, { MobileNotificationBell } from './components/Navbar';
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

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans w-full relative">
<div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 px-4 flex items-center justify-between z-[140]">
  <img src={logoImg} alt="Athenura" className="h-7 object-contain" />
  
  <div className="flex items-center gap-1">
    <MobileNotificationBell />
    <button 
      type="button"
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      className="p-2.5 text-[#063A3A] hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
    >
      {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
    </button>
  </div>
</div>
    
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[120] transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

     <aside 
  className={`fixed top-0 bottom-0 left-0 w-64 bg-[#063A3A] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
    isSidebarOpen 
      ? "translate-x-0 z-[130]" 
      : "-translate-x-full lg:translate-x-0"
  } ${

    !isSidebarOpen ? "z-10" : ""
  }`}
>
  <Sidebar onClose={() => setIsSidebarOpen(false)} />
</aside>

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 w-full transition-all duration-300">
        <div className="hidden lg:block z-10">
          <Navbar />
        </div>
        
      
        <div className="h-16 lg:hidden shrink-0" />

        <main className="flex-1 pt-4 lg:pt-20 p-4 sm:p-6 md:p-8 overflow-y-auto w-full max-w-full">
          <div className="max-w-[1400px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000, style: { background: "#111827", color: "#fff", borderRadius: "16px" } }} />
      
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
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
            <Route path="/team/:teamId/date/:date" element={<TeamContentDatePage />} />
            
            <Route path="/pending-approvals" element={<PendingApprovalsPage />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;