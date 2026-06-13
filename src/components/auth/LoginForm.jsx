import { useState } from "react";
import { loginUser } from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff, FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";

const LoginForm = ({ setIsLogin }) => {

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const response =
        await loginUser(formData);

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "role",
        response.data.role
      );

      localStorage.setItem(
  "userId",
  response.data.id
);

localStorage.setItem(
  "name",
  response.data.name
);

localStorage.setItem(
  "email",
  response.data.email
);

      

      toast.success("Login Successful");

      navigate(
        response.data.role === "ADMIN"
          ? "/admin/dashboard"
          : "/user/dashboard"
      );

    } catch {
      toast.error("Invalid Credentials");
    }
  };


return (
  <motion.div
    key="login"
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -30 }}
    transition={{ duration: 0.35 }}
    className="w-full max-w-[380px] px-2"
  >
    
    <div className="flex justify-center mb-8">
      <img src="src/assets/Athenura.png" alt="Athenura" className="h-20 object-contain" />
    </div>

    
    <div className="mb-7">
      <h1 className="text-[1.6rem] font-black tracking-tight mb-2 bg-gradient-to-r from-[#063A3A] to-[#0D7A80] bg-clip-text text-transparent">Sign in</h1>
      <p className="text-sm text-slate-400 mt-1">Welcome back — enter your credentials to continue.</p>
    </div>

    <form onSubmit={handleLogin} className="space-y-4">
     
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</label>
        <input
          type="email"
          name="email"
          placeholder="you@company.com"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm outline-none transition-all
            focus:border-[#0A5B63] focus:bg-white focus:ring-4 focus:ring-[#0A5B63]/8 placeholder:text-slate-300"
        />
      </div>

     
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
          <Link to="/forgot-password" className="text-xs text-[#0A5B63] font-medium hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm outline-none pr-11 transition-all
              focus:border-[#0A5B63] focus:bg-white focus:ring-4 focus:ring-[#0A5B63]/8 placeholder:text-slate-300"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
          </button>
        </div>
      </div>

    
      <label className="flex items-center gap-2.5 cursor-pointer group">
        <input type="checkbox" className="w-3.5 h-3.5 accent-[#0A5B63] rounded" />
        <span className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors">Remember me for 30 days</span>
      </label>

      
      <button
        type="submit"
        className="w-full mt-2 py-2.5 rounded-xl text-sm font-semibold text-white tracking-wide transition-all
          hover:opacity-90 active:scale-[0.99]"
        style={{ background: "linear-gradient(135deg, #0A5B63 0%, #1A7A84 100%)", boxShadow: "0 4px 14px rgba(10,91,99,0.35)" }}
      >
        Continue →
      </button>
    </form>

    <p className="text-center text-xs text-slate-400 mt-6">
      Don't have an account?{" "}
      <button type="button" onClick={() => setIsLogin(false)} className="text-[#0A5B63] font-semibold hover:underline">
        Create one
      </button>
    </p>
  </motion.div>
);
};

export default LoginForm;