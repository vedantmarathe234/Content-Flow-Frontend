import React, { useState } from "react";
import { loginUser } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

  const response = await loginUser(formData);

  localStorage.setItem(
    "token",
    response.data.token
  );

  localStorage.setItem(
  "role",
  response.data.role
);

  toast.success("Login Successful");

  if (response.data.role === "ADMIN") {

  navigate("/admin/dashboard");

}

else {

  navigate("/user/dashboard");

}

} catch (error) {

  console.log(error);

  toast.error("Invalid Credentials");
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <div className="text-center mb-8">

          <div className="w-14 h-14 bg-blue-600 rounded-xl mx-auto flex items-center justify-center text-white text-2xl font-bold">
            C
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mt-4">
            Welcome Back
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Login to your account
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <div>
            <label className="text-sm font-medium text-slate-600">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-2 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-2 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-between items-center text-sm">

            <label className="flex items-center gap-2 text-slate-500">
              <input type="checkbox" />
              Remember Me
            </label>

            <Link
              to="/forgot-password"
              className="text-blue-600 font-medium"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all"
          >
            Login
          </button>

          <p className="text-center text-sm text-slate-500">

            Don&apos;t have an account?

            <Link
              to="/register"
              className="text-blue-600 font-semibold ml-1"
            >
              Register
            </Link>

          </p>

        </form>
      </div>
    </div>
  );
};

export default Login;