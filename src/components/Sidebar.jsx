import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, FileStack, Settings, LogOut, Clock } from 'lucide-react';
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
    { name: 'Pending', icon: <Clock size={18} />, path: '/pending-approvals' },
    { name: 'Settings', icon: <Settings size={18} />, path: '/settings' },
  ].filter(item => {
    if (userRole === "INTERN") {
      return !['Departments', 'Pending'].includes(item.name);
    }
    return true;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    
    toast.success("Logged out successfully");
    setTimeout(() => {
      window.location.href = "/auth";
    }, 1000);
  };

  return (
    <aside 
      className="w-64 h-screen text-slate-300/80 flex flex-col fixed left-0 top-0 z-40 select-none border-r border-white/5 font-sans"
      style={{
        background: "linear-gradient(180deg, #031212 0%, #063A3A 60%, #0D7A80 100%)"
      }}
    >
     
      <div className="h-16 flex items-center justify-center px-6 border-b border-white/5">
        <img
          src={AthenuraLogo}
          alt="Athenura"
          className="h-9 w-auto object-contain mt-1"
        />
      </div>

   
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                isActive
                  ? 'bg-white/10 text-white shadow-md backdrop-blur-md border border-white/10'
                  : 'hover:bg-white/5 hover:text-white text-slate-300/60'
              }`}
            >
              <div className={`transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                {item.icon}
              </div>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

   
      <div className="p-3 border-t border-white/5 bg-black/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 text-white hover:bg-rose-500/10 hover:text-rose-400 rounded-xl transition-all duration-200 text-xs font-bold uppercase tracking-wider cursor-pointer group"
        >
          <LogOut size={18} className="text-white group-hover:text-rose-400 transition-colors" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;