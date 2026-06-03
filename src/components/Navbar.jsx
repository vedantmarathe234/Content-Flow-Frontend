import React, { useEffect, useState } from "react";
import { Search, Bell, ChevronDown } from 'lucide-react';
import { getNotifications, markAsRead } from "../services/notificationService";

import { useNavigate } from "react-router-dom";

const Navbar = () => {

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const unreadCount =
    notifications.filter(n => !n.read).length;



const handleNotificationClick = async (notification) => {
  try {
    setShowNotifications(false);

    await markAsRead(notification.id);

    if (notification.contentId) {
      navigate(`/content/view/${notification.contentId}`);
    }
  } catch (error) {
    console.error(error);
  }
};
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
        <div className="relative">

  <button
    onClick={() =>
      setShowNotifications(!showNotifications)
    }
  >
    <Bell size={22} />
  </button>

  {unreadCount > 0 && (
    <span
      className="
      absolute
      -top-2
      -right-2
      bg-red-500
      text-white
      text-xs
      rounded-full
      h-5
      w-5
      flex
      items-center
      justify-center
      "
    >
      {unreadCount}
    </span>
  )}

  {showNotifications && (
    <div
      className="
        absolute
        right-0
        top-8
        w-80
        bg-white
        rounded-xl
        shadow-xl
        border
        z-50
      "
    >
      <div className="p-4 border-b font-semibold">
        Notifications
      </div>

      {notifications.length === 0 ? (
        <div className="p-4 text-slate-500">
          No notifications
        </div>
      ) : (
        notifications.map(notification => (
  <div
  key={notification.id}
  onClick={() =>
    handleNotificationClick(notification)
  }
  className="
    p-4
    border-b
    hover:bg-slate-50
    cursor-pointer
  "
>
    <p className="text-sm">
      {notification.message}
    </p>

    <p className="text-xs text-slate-400 mt-1">
      {new Date(notification.createdAt).toLocaleString()}
    </p>
  </div>
))
      )}
    </div>
  )}

</div>
        
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