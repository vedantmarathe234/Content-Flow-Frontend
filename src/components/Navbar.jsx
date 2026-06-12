import React, { useEffect, useState, useRef } from "react";
import { Search, Bell, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getNotifications, markAsRead } from "../services/notificationService";
import API from "../services/api";
import ContentDetailsPage from "../pages/content/ContentDetailsPage";

const Navbar = () => {
  const navigate = useNavigate();
  const notificationRef = useRef(null);
  const [selectedContentId, setSelectedContentId] = useState(null);
  
  const [user, setUser] = useState({ name: "Admin", profilePhotoUrl: "" });
  const [search, setSearch] = useState("");
  const [results, setResults] = useState({ users: [], teams: [], departments: [] });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await API.get("/users/me");
        setUser({ name: userRes.data.name || "Admin", profilePhotoUrl: userRes.data.profilePhotoUrl || "" });
        fetchNotifications();
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      setNotifications(response.data || []);
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    const handleNotificationsUpdated = () => {
      fetchNotifications();
    };

    window.addEventListener("notificationsUpdated", handleNotificationsUpdated);
    return () => {
      window.removeEventListener("notificationsUpdated", handleNotificationsUpdated);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);
    if (!value.trim()) { setResults({ users: [], teams: [], departments: [] }); return; }
    try {
      const res = await API.get(`/search?query=${value}`);
      setResults(res.data || { users: [], teams: [], departments: [] });
    } catch (err) { console.error(err); }
  };

  const handleNotificationClick = async (notification) => {
    try {
      await markAsRead(notification.id);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, read: true } : n
        )
      );

      setShowNotifications(false);

      if (notification.contentId) {
        setSelectedContentId(notification.contentId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <nav className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 z-30 font-sans">
        
        
        <div className="relative">
          <div className="flex items-center bg-slate-50 border border-slate-200/60 px-4 py-2 rounded-xl w-96 transition-all focus-within:ring-2 focus-within:ring-[#0D7A80]/10 focus-within:border-[#0D7A80]">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={search} 
              onChange={handleSearch} 
              placeholder="Search anything..." 
              className="bg-transparent outline-none ml-3 text-sm w-full text-slate-800 placeholder-slate-400" 
            />
          </div>
          
          
          {search && (results.users.length > 0 || results.teams.length > 0 || results.departments.length > 0) && (
            <div className="absolute top-13 left-0 w-96 bg-white border border-slate-100 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto p-4 animate-in fade-in slide-in-from-top-2 duration-150">
              {results.users.length > 0 && (
                <div className="mb-3">
                  <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Users</h4>
                  {results.users.map(u => <div key={u.id} className="py-2 px-2.5 hover:bg-slate-50 rounded-lg cursor-pointer text-sm font-medium text-slate-700 transition-colors">{u.name}</div>)}
                </div>
              )}
              {results.teams.length > 0 && (
                <div className="mb-3">
                  <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Teams</h4>
                  {results.teams.map(t => <div key={t.id} className="py-2 px-2.5 hover:bg-[#0D7A80]/5 rounded-lg cursor-pointer text-sm font-medium text-slate-700 transition-colors">{t.name}</div>)}
                </div>
              )}
              {results.departments.length > 0 && (
                <div>
                  <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Departments</h4>
                  {results.departments.map(d => <div key={d.id} className="py-2 px-2.5 hover:bg-[#063A3A]/5 rounded-lg cursor-pointer text-sm font-medium text-slate-700 transition-colors">{d.name}</div>)}
                </div>
              )}
            </div>
          )}
        </div>

  
        <div className="flex items-center gap-6">
          
         
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-500 hover:text-[#063A3A] hover:bg-slate-50 rounded-full transition-all relative cursor-pointer"
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

           
            {showNotifications && (
              <div className="absolute right-0 top-12 w-[380px] bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60">
                  <h3 className="font-bold text-base text-[#063A3A]">Notifications</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Stay updated with your team's activity</p>
                </div>

                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-sm font-medium text-slate-400">
                    No new notifications found.
                  </div>
                ) : (
                  <div className="max-h-[400px] overflow-y-auto p-2 divide-y divide-slate-50">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => !notification.read && handleNotificationClick(notification)}
                        className={`mx-1 my-1 p-3.5 rounded-xl border transition-all ${
                          notification.read
                            ? "bg-slate-50/50 border-transparent opacity-60"
                            : "bg-white hover:bg-[#063A3A]/[0.05] border-[#0D7A80]/10 hover:border-[#0D7A80]/30 hover:shadow-sm cursor-pointer"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <p className={`text-sm leading-relaxed ${notification.read ? "text-slate-600 font-medium" : "text-slate-900 font-semibold"}`}>
                            {notification.message}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-[#0D7A80] mt-1.5 flex-shrink-0" />
                          )}
                        </div>

                        <div className="flex justify-between items-center mt-2.5">
                          <p className="text-[11px] text-slate-400 font-medium">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                          {notification.read && (
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              Read
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

       
          <div 
            onClick={() => navigate("/settings")} 
            className="flex items-center gap-3 cursor-pointer group border-l border-slate-100 pl-5 py-1"
          >
            {user.profilePhotoUrl ? (
              <img 
                src={`http://localhost:8080/uploads/${user.profilePhotoUrl}`} 
                className="w-9 h-9 rounded-full object-cover border border-slate-200 group-hover:border-[#0D7A80] transition-colors" 
                alt={user.name} 
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#063A3A]/5 text-[#063A3A] border border-slate-100 flex items-center justify-center font-bold text-sm uppercase group-hover:bg-[#063A3A]/10 transition-all">
                {user.name?.charAt(0)}
              </div>
            )}
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-slate-700 group-hover:text-[#063A3A] transition-colors">{user.name}</span>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#063A3A] transition-colors" />
            </div>
          </div>

        </div>
      </nav>

    
      {selectedContentId && (
        <ContentDetailsPage
          id={selectedContentId}
          onClose={() => setSelectedContentId(null)}
          onRefresh={fetchNotifications}
        />
      )}
    </>
  );
};

export default Navbar;