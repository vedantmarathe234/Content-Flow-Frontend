import React, { useEffect, useState, useRef } from "react";
import { Search, Bell, ChevronDown, User, LogOut, Settings as SettingsIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getNotifications, markAsRead } from "../services/notificationService";
import API from "../services/api";
import ContentDetailsPage from "../pages/content/ContentDetailsPage";
import { connectNotifications } from "../services/websocket";

let triggerMobileContentOpen = null;

const Navbar = () => {
  const navigate = useNavigate();
  const notificationRef = useRef(null);
  const dropdownRef = useRef(null);
  const [selectedContentId, setSelectedContentId] = useState(null);
  const [user, setUser] = useState({ name: "Admin", profilePhotoUrl: "", email: "" });
  const [search, setSearch] = useState("");
  const [results, setResults] = useState({ users: [], teams: [], departments: [] });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

 
  const fetchUserData = async () => {
    try {
      const userRes = await API.get("/users/me");
      const computedPhotoUrl = userRes.data.profilePhotoUrl || userRes.data.profilePhoto || "";

      setUser({ 
        name: userRes.data.name || "Admin", 
        profilePhotoUrl: computedPhotoUrl,
        email: userRes.data.email || ""
      });

      if (computedPhotoUrl) {
        localStorage.setItem("profilePhotoUrl", computedPhotoUrl);
      }
    } catch (err) { 
      console.error("Error retrieving dashboard profile keys:", err); 
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchNotifications();
  }, []);

 
  useEffect(() => {
    const handleProfileSync = () => {
      const liveCachedPhoto = localStorage.getItem("profilePhotoUrl");
      if (liveCachedPhoto) {
        setUser((prev) => ({
          ...prev,
          profilePhotoUrl: liveCachedPhoto
        }));
      }
    };

    window.addEventListener("storage", handleProfileSync);
    window.addEventListener("profilePhotoUpdated", handleProfileSync);

    return () => {
      window.removeEventListener("storage", handleProfileSync);
      window.removeEventListener("profilePhotoUpdated", handleProfileSync);
    };
  }, []);

  const userId = localStorage.getItem("userId");

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
    if (!userId) return;

    connectNotifications(
      userId,
      (notification) => {
        setNotifications((prev) => [
          notification,
          ...prev
        ]);
        window.dispatchEvent(new Event("notificationsUpdated"));
      }
    );
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    triggerMobileContentOpen = (id) => {
      setSelectedContentId(id);
    };
    return () => { triggerMobileContentOpen = null; };
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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

const handleResultClick = (type, item) => {
  setSearch("");
  setResults({ users: [], teams: [], departments: [] });
  
  if (type === "user") {
    const currentPath = window.location.pathname;
    const prefix = currentPath.startsWith("/admin") ? "admin" : "user";

    navigate(`/${prefix}/department/${item.departmentId}`, { 
      state: { searchInternName: item.name } 
    });
  } else if (type === "team") {
    const currentPath = window.location.pathname;
    const targetRoute = currentPath.startsWith("/admin") ? "/admin/teams" : "/user/teams";

    navigate(targetRoute, { state: { selectedTeamId: item.id, selectedTeamName: item.name } });
  } else if (type === "department") {
    navigate(`/admin/department/${item.id}`);
  }
};
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <nav className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 z-30 font-sans">
        
        <div className="text-xl font-black tracking-tight text-[#063A3A] select-none">
          Contentflow
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="flex items-center bg-slate-50 border border-slate-200/60 px-4 py-2 rounded-xl w-80 xl:w-96 transition-all focus-within:ring-2 focus-within:ring-[#0D7A80]/10 focus-within:border-[#0D7A80]">
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
              <div className="absolute top-13 right-0 w-80 xl:w-96 bg-white border border-slate-100 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto p-4 animate-in fade-in slide-in-from-top-2 duration-150">
                {results.users.length > 0 && (
                  <div className="text-left mb-3">
                    <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Users</h4>
                    {results.users.map(u => (
                      <div 
                        key={u.id} 
                        onClick={() => handleResultClick("user", u)}
                        className="py-2 px-2.5 hover:bg-slate-50 rounded-lg cursor-pointer text-sm font-medium text-slate-700 transition-colors"
                      >
                        {u.name}
                      </div>
                    ))}
                  </div>
                )}
                {results.teams.length > 0 && (
                  <div className="text-left mb-3">
                    <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Teams</h4>
                    {results.teams.map(t => (
                      <div 
                        key={t.id} 
                        onClick={() => handleResultClick("team", t)}
                        className="py-2 px-2.5 hover:bg-[#0D7A80]/5 rounded-lg cursor-pointer text-sm font-medium text-slate-700 transition-colors"
                      >
                        {t.name}
                      </div>
                    ))}
                  </div>
                )}
                {results.departments.length > 0 && (
                  <div className="text-left">
                    <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Departments</h4>
                    {results.departments.map(d => (
                      <div 
                        key={d.id} 
                        onClick={() => handleResultClick("department", d)}
                        className="py-2 px-2.5 hover:bg-[#063A3A]/5 rounded-lg cursor-pointer text-sm font-medium text-slate-700 transition-colors"
                      >
                        {d.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

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
                <div className="px-5 py-4 text-left border-b border-slate-100 bg-slate-50/60">
                  <h3 className="font-bold text-base text-[#063A3A]">Notifications</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Stay updated with your team's activity</p>
                </div>

                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-sm font-medium text-slate-400">
                    No new notifications found.
                  </div>
                ) : (
                  <div className="max-h-[400px] overflow-y-auto p-2 divide-y divide-slate-50">
                   {notifications.map((notification) => {
  let dropdownMessage = notification.message || "";

  try {
    const currentUserName = localStorage.getItem("name");

    if (currentUserName && currentUserName.trim() !== "") {
      const trimmedName = currentUserName.trim();
      
      if (dropdownMessage.startsWith(`${trimmedName}'s content`)) {
        const remainingText = dropdownMessage.substring(`${trimmedName}'s content`.length);
        dropdownMessage = "Your content" + remainingText;
      } 
      else if (dropdownMessage.startsWith(trimmedName)) {
        dropdownMessage = "You" + dropdownMessage.substring(trimmedName.length);
      }
    }
  } catch (err) {
    console.error("Error parsing notification dropdown safely:", err);
    dropdownMessage = notification.message; 
  }

  return (
    <div
      key={notification.id}
      onClick={() => !notification.read && handleNotificationClick(notification)}
      className={`mx-1 my-1 p-3.5 rounded-xl border text-left transition-all ${
        notification.read
          ? "bg-slate-50/50 border-transparent opacity-60 cursor-default"
          : "bg-white hover:bg-[#063A3A]/[0.05] border-[#0D7A80]/10 hover:border-[#0D7A80]/30 hover:shadow-sm cursor-pointer"
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <p className={`text-sm leading-relaxed ${notification.read ? "text-slate-600 font-medium" : "text-slate-900 font-semibold"}`}>
          {dropdownMessage}
        </p>
        {!notification.read && (
          <div className="w-2 h-2 rounded-full bg-[#0D7A80] mt-1.5 flex-shrink-0" />
        )}
      </div>

      <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
        <p className="text-[11px] text-slate-400 font-medium">
          {new Date(notification.createdAt).toLocaleString()}
        </p>
        
        {notification.teamName ? (
          <span className="text-[9px] bg-[#0D7A80]/10 text-[#0D7A80] font-black px-1.5 py-0.5 rounded uppercase tracking-wide border border-[#0D7A80]/20">
            {notification.teamName}
          </span>
        ) : (
          <span className="text-[9px] bg-[#0D7A80]/10 text-[#0D7A80] font-black px-1.5 py-0.5 rounded uppercase tracking-wide border border-[#0D7A80]/20">
            Individual
          </span>
        )}

        {notification.departmentName && (
          <span className="text-[9px] bg-[#0D7A80]/10 text-[#0D7A80] font-black px-1.5 py-0.5 rounded uppercase tracking-wide border border-[#0D7A80]/20">
            {notification.departmentName}
          </span>
        )}
      </div>
    </div>
  );
})}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="relative" ref={dropdownRef}>
            <div 
              onClick={() => setShowDropdown(!showDropdown)} 
              className="flex items-center gap-3 cursor-pointer group border-l border-slate-100 pl-5 py-1 select-none"
            >
              {user.profilePhotoUrl ? (
                <img 
                  src={
                    user.profilePhotoUrl.startsWith("http") 
                      ? user.profilePhotoUrl 
                      : `http://localhost:8080/uploads/${user.profilePhotoUrl}`
                  } 
                  className="w-9 h-9 rounded-full object-cover border border-slate-200 flex-shrink-0" 
                  alt={user.name} 
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#063A3A]/5 text-[#063A3A] border border-slate-100 flex items-center justify-center font-bold text-sm uppercase group-hover:bg-[#063A3A]/10 transition-all flex-shrink-0">
                  {user.name?.charAt(0)}
                </div>
              )}
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-slate-700 group-hover:text-[#063A3A] transition-colors">{user.name}</span>
                <div className="px-1 text-slate-700 text-[10px] shrink-0 self-stretch flex items-center justify-center transition-colors">
                  ▼
                </div>
              </div>
            </div>

            {showDropdown && (
              <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl border-y border-r border-slate-200/80 border-l-[5px] border-l-[#063A3A] shadow-xl overflow-hidden z-50 p-2 animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="px-4 py-3 text-left border-b border-slate-100 flex flex-col gap-0.5">
                  <p className="text-sm font-bold text-[#063A3A] truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 font-medium truncate">{user.email || "No email assigned"}</p>
                </div>
                
                <div className="mt-1.5 space-y-0.5">
                  <button 
                    onClick={() => { setShowDropdown(false); navigate("/settings"); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-slate-700 hover:text-[#063A3A] text-sm font-bold transition-all cursor-pointer text-left"
                  >
                    <SettingsIcon size={16} className="text-slate-400" />
                    Settings
                  </button>
                  
                  <button 
                    onClick={() => { setShowDropdown(false); handleLogout(); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-rose-50 rounded-xl text-rose-600 text-sm font-bold transition-all cursor-pointer text-left"
                  >
                    <LogOut size={16} className="text-rose-400" />
                    Logout
                  </button>
                </div>
              </div>
            )}
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

export const MobileNotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const mobileRef = useRef(null);

  const fetchMobileAlerts = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchMobileAlerts();
    window.addEventListener("notificationsUpdated", fetchMobileAlerts);
    
    const clickAway = (e) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", clickAway);

    return () => {
      window.removeEventListener("notificationsUpdated", fetchMobileAlerts);
      document.removeEventListener("mousedown", clickAway);
    };
  }, []);

  const handleMobileAlertClick = async (notification) => {
    try {
      await markAsRead(notification.id);
      setNotifications((p) => p.map((n) => n.id === notification.id ? { ...n, read: true } : n));
      setShowNotifications(false);
      window.dispatchEvent(new Event("notificationsUpdated"));

      if (notification.contentId && triggerMobileContentOpen) {
        triggerMobileContentOpen(notification.contentId);
      }
    } catch (err) { console.error(err); }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={mobileRef}>
      <button
        type="button"
        onClick={() => setShowNotifications(!showNotifications)}
        className="p-2.5 text-slate-500 hover:text-[#063A3A] hover:bg-slate-50 rounded-xl transition-all relative cursor-pointer"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-[-45px] sm:right-0 top-12 w-[290px] sm:w-[350px] bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-[150] animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="px-4 py-3 text-left border-b border-slate-100 bg-slate-50/60">
            <h3 className="font-bold text-sm text-[#063A3A]">Notifications</h3>
          </div>

          {notifications.length === 0 ? (
            <div className="p-6 text-center text-xs font-medium text-slate-400">
              No new notifications found.
            </div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto p-1.5 divide-y divide-slate-50">
              {notifications.map((n) => {
  let mobileMessage = n.message || "";
  try {
    const currentUserName = localStorage.getItem("name");
    if (currentUserName && currentUserName.trim() !== "") {
      const trimmedName = currentUserName.trim();
      if (mobileMessage.startsWith(`${trimmedName}'s content`)) {
        mobileMessage = "Your content" + mobileMessage.substring(`${trimmedName}'s content`.length);
      } else if (mobileMessage.startsWith(trimmedName)) {
        mobileMessage = "You" + mobileMessage.substring(trimmedName.length);
      }
    }
  } catch (err) {
    console.error(err);
  }

  return (
    <div
      key={n.id}
      onClick={() => !n.read && handleMobileAlertClick(n)}
      className={`p-3 rounded-xl text-left transition-all my-0.5 ${
        n.read
          ? "bg-slate-50/40 opacity-60 cursor-default"
          : "bg-white hover:bg-[#063A3A]/[0.04] border border-[#0D7A80]/5 hover:border-[#0D7A80]/20 cursor-pointer"
      }`}
    >
      <div className="flex justify-between gap-1.5">
        <p className={`text-xs leading-normal ${n.read ? "text-slate-500" : "text-slate-800 font-semibold"}`}>
          {mobileMessage}
        </p>
      </div>
      
    
      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
        <p className="text-[9px] text-slate-400">
          {new Date(n.createdAt).toLocaleDateString()}
        </p>
        
        {n.teamName ? (
          <span className="text-[8px] bg-[#0D7A80]/10 text-[#0D7A80] font-black px-1.5 py-0.5 rounded uppercase tracking-wide border border-[#0D7A80]/20">
            {n.teamName}
          </span>
        ) : (
          <span className="text-[8px] bg-[#0D7A80]/10 text-[#0D7A80] font-black px-1.5 py-0.5 rounded uppercase tracking-wide border border-[#0D7A80]/20">
            Individual
          </span>
        )}

        {n.departmentName && (
          <span className="text-[8px] bg-[#0D7A80]/10 text-[#0D7A80] font-black px-1.5 py-0.5 rounded uppercase tracking-wide border border-[#0D7A80]/20">
            {n.departmentName}
          </span>
        )}
      </div>
    </div>
  );
})}
            </div>
          )}
        </div>
      )}
    </div>
  );
};