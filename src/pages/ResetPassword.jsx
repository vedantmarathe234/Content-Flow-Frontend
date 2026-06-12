import React, { useState } from "react";
import { resetPassword } from "../services/authService";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();


  const token = new URLSearchParams(location.search).get("token");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "" 
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();


    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPassword({
        resetToken: token,
        newPassword: formData.newPassword
      });

      toast.success("Password Reset Successful");

      setTimeout(() => {
        navigate("/auth");
      }, 1500);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Invalid or Expired Token");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans text-slate-800 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#063A3A] rounded-2xl mx-auto flex items-center justify-center text-white text-2xl font-black shadow-md shadow-[#063A3A]/20">
            C
          </div>
          <h1 className="text-2xl font-bold text-[#063A3A] mt-4 tracking-tight">
            Reset Password
          </h1>
          <p className="text-[#0D7A80] text-xs font-bold uppercase tracking-wider mt-1.5">
            Create your new secure password
          </p>
        </div>

        
        <form onSubmit={handleResetPassword} className="space-y-5">
          
          
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter your new password"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm border border-slate-200 bg-slate-50 rounded-xl focus:outline-none hover:border-[#0D7A80]/50 focus:ring-2 focus:ring-[#0D7A80]/20 focus:border-[#0D7A80] transition-all"
              required
            />
          </div>

         
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Retype your new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm border border-slate-200 bg-slate-50 rounded-xl focus:outline-none hover:border-[#0D7A80]/50 focus:ring-2 focus:ring-[#0D7A80]/20 focus:border-[#0D7A80] transition-all"
              required
            />
          </div>

          
          <button
            type="submit"
            className="w-full bg-[#063A3A] hover:bg-[#0D7A80] text-white py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer mt-2"
          >
            Reset Password
          </button>

       
          <div className="text-center pt-2">
            <Link
              to="/auth"
              className="text-[#0D7A80] hover:text-[#063A3A] text-xs font-bold uppercase tracking-wider underline underline-offset-4 transition-colors"
            >
              Back To Login
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ResetPassword;