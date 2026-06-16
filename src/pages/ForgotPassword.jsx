import React, { useState } from "react";
import { forgotPassword } from "../services/authService";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      toast.success("Reset Link Sent Successfully");
      setEmail(""); 
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed To Send Reset Link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans text-slate-800 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        
        
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#063A3A] rounded-2xl mx-auto flex items-center justify-center text-white text-2xl font-black shadow-md shadow-[#063A3A]/20">
            C
          </div>
          <h1 className="text-2xl font-bold text-[#063A3A] mt-4 tracking-tight">
            Forgot Password
          </h1>
          <p className="text-[#0D7A80] text-xs font-bold uppercase tracking-wider mt-1.5">
            Reset your account password
          </p>
        </div>

       
        <form onSubmit={handleForgotPassword} className="space-y-5">
          
        
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-slate-200 bg-slate-50 rounded-xl focus:outline-none hover:border-[#0D7A80]/50 focus:ring-2 focus:ring-[#0D7A80]/20 focus:border-[#0D7A80] transition-all placeholder-slate-400"
              required
              disabled={loading}
            />
          </div>

       
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#063A3A] hover:bg-[#0D7A80] disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer mt-2"
          >
            {loading ? "Sending Link..." : "Send Reset Link"}
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

export default ForgotPassword;