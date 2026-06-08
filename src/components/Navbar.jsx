import React, { useEffect, useState } from "react";
import { Search, Bell, ChevronDown } from 'lucide-react';
import { getNotifications, markAsRead, markAllNotificationsAsRead } from "../services/notificationService";

import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const Navbar = () => {

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
useEffect(() => {

  fetchNotifications();

  const handleNotificationsUpdated = () => {
    console.log("NOTIFICATION EVENT RECEIVED");
    fetchNotifications();
  };



  window.addEventListener(
    "notificationsUpdated",
    handleNotificationsUpdated
  );

  return () => {
    window.removeEventListener(
      "notificationsUpdated",
      handleNotificationsUpdated
    );
  };

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

const handleBellClick = async () => {

  setShowNotifications(!showNotifications);
};

const handleNotificationClick = async (notification) => {
  try {
    await markAsRead(notification.id);

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notification.id
          ? { ...n, read: true }
          : n
      )
    );

    setShowNotifications(false);

    if (notification.contentId) {
      navigate(`/content/view/${notification.contentId}`);
    }

  } catch (error) {
    console.error(error);
  }
};

const notificationRef = useRef(null);

useEffect(() => {

  const handleClickOutside = (event) => {

    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setShowNotifications(false);
    }
  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };

}, []);

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
       <div
  className="relative"
  ref={notificationRef}
>

<button
  onClick={handleBellClick}
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
top-12
w-[380px]
bg-white
rounded-2xl
border
border-slate-200
shadow-2xl
overflow-hidden
z-50
      "
    >
      <div className="px-5 py-4 border-b bg-slate-50">
  <h3 className="font-bold text-lg">
    Notifications
  </h3>

  <p className="text-sm text-slate-500">
    Recent activity
  </p>
</div>

     {notifications.length === 0 ? (
  <div className="p-6 text-center text-slate-500">
    No notifications
  </div>
) : (
  <div className="max-h-[500px] overflow-y-auto p-2">
    {notifications.map((notification) => (
      <div
        key={notification.id}
        onClick={() =>
          !notification.read &&
          handleNotificationClick(notification)
        }
        className={`
          mx-2
          my-2
          p-4
          rounded-xl
          border
          transition-all
          ${
            notification.read
              ? "bg-slate-50 border-slate-200 opacity-70"
              : "bg-white border-blue-100 hover:border-blue-300 hover:shadow-md cursor-pointer"
          }
        `}
      >
        <div className="flex justify-between items-start">
          <p className="font-medium text-slate-800 text-sm leading-6">
            {notification.message}
          </p>

          {!notification.read && (
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 ml-3 flex-shrink-0" />
          )}
        </div>

        <div className="flex justify-between items-center mt-3">
          <p className="text-xs text-slate-500">
            {new Date(
              notification.createdAt
            ).toLocaleString()}
          </p>

          {notification.read && (
            <span className="text-[11px] text-slate-400 font-medium">
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