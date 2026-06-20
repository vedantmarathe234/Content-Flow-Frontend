import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation(); 

  useEffect(() => {
    const checkToken = () => {
      const activeToken = localStorage.getItem("token");
      setToken(activeToken);
      setIsChecking(false);
    };

    const timer = setTimeout(checkToken, 100);
    return () => clearTimeout(timer);
  }, []);

  if (isChecking) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-[#063A3A] font-semibold text-sm tracking-wide uppercase">
          Verifying secure session...
        </div>
      </div>
    );
  }

  if (!token) {
    const fullRedirectPath = location.pathname + location.search;
    localStorage.setItem("redirectTargetPath", fullRedirectPath);
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;