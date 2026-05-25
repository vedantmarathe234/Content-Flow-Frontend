import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 z-30">
      <div className="flex items-center bg-slate-50 border border-slate-100 px-4 py-2 rounded-lg w-96">
        <Search className="w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search anything..." 
          className="bg-transparent border-none outline-none ml-3 text-sm text-slate-600 w-full placeholder-slate-400"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-all">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" 
            alt="Admin" 
            className="w-8 h-8 rounded-full object-cover border border-slate-200"
          />
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Admin</span>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-all" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;