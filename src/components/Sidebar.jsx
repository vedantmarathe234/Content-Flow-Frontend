import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, UserRound, CheckCircle2, FileStack, Settings, LogOut, Clock } from 'lucide-react';
import AthenuraLogo from "../assets/white.png";

import toast from "react-hot-toast";

const Sidebar = () => {
  const location = useLocation();
  const userRole = localStorage.getItem("role");

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: userRole === "ADMIN" ? "/admin/dashboard" : "/user/dashboard" },
    { name: 'Departments', icon: <Building2 size={18} />, path: '/admin/create-department' },
    { name: 'Teams', icon: <Users size={18} />, path: userRole === "ADMIN" ? '/admin/teams' : '/user/teams' },
    { name: 'Content', icon: <FileStack size={18} />, path: '/content' },
{name: 'Pending Approvals', icon: <Clock size={18} />, path: '/pending-approvals' },
    { name: 'Settings', icon: <Settings size={18} />, path: '/settings' },
  ].filter(item => {
    if (userRole === "INTERN") {
      return !['Departments', 'Users / Interns', 'Pending Approvals'].includes(item.name);
    }
    return true;
  });

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-[#03191D] via-[#062C33] to-[#0A4A54] text-slate-400 flex flex-col fixed left-0 top-0 z-40">
      <div className="h-16 flex items-center gap-3 px-6 border-b border-white/10">
        
      <img
  src={AthenuraLogo}
  alt="Athenura"
  className="h-10 w-auto object-contain pl-7 mt-2"
/>
  
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link key={item.name} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium transition-all ${location.pathname === item.path ? 'bg-gradient-to-r from-[#0A5B63] to-[#1C7A85] text-white shadow-lg shadow-[#0A5B63]/30' : 'hover:bg-white/5 hover:text-white'}`}>
            {item.icon} {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <button onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("role"); toast.success("Logged out"); setTimeout(() => window.location.href = "/auth", 1200); }} className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-white/5
hover:text-white rounded-xl transition-all text-[13px] font-medium">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;