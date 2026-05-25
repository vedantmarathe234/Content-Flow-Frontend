import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Building2, Users, UserRound, 
  CheckCircle2, FileStack, Settings, LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
    { name: 'Departments', icon: <Building2 size={18} />, path: '/departments' },
    { name: 'Teams', icon: <Users size={18} />, path: '/teams' },
    { name: 'Users / Interns', icon: <UserRound size={18} />, path: '/users' },
    { name: 'Pending Approvals', icon: <CheckCircle2 size={18} />, path: '/approvals' },
    { name: 'All Content', icon: <FileStack size={18} />, path: '/content' },
    { name: 'Settings', icon: <Settings size={18} />, path: '/settings' },
  ];

  return (
    <aside className="w-64 h-screen bg-[#0f172a] text-slate-400 flex flex-col fixed left-0 top-0 z-40">
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          C
        </div>
        <span className="text-white font-bold text-lg tracking-tight">ContentFlow</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30 font-semibold' 
                  : 'hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-[13px] font-medium">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;