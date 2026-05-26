import React, { useState } from "react";

import { resetPassword } from "../services/authService";

import {
  useLocation,
  useNavigate,
  Link
} from "react-router-dom";

import toast from "react-hot-toast";

const ResetPassword = () => {

  const navigate = useNavigate();

  const location = useLocation();

  const token =
    new URLSearchParams(location.search)
      .get("token");

  const [formData, setFormData] = useState({
    newPassword: ""
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleResetPassword = async (e) => {

    e.preventDefault();

    try {

      await resetPassword({
        resetToken: token,
        newPassword: formData.newPassword
      });

      toast.success(
        "Password Reset Successful"
      );

      setTimeout(() => {

        navigate("/login");

      }, 1500);

    } catch (error) {

      console.log(error);

      toast.error(
        "Invalid or Expired Token"
      );

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

            Reset Password

          </h1>

          <p className="text-slate-500 text-sm mt-1">

            Create your new password

          </p>

        </div>

        <form
          onSubmit={handleResetPassword}
          className="space-y-5"
        >

          <div>

            <label className="text-sm font-medium text-slate-600">

              New Password

            </label>

            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full mt-2 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all"
          >

            Reset Password

          </button>

          <div className="text-center">

            <Link
              to="/login"
              className="text-blue-600 text-sm font-medium"
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