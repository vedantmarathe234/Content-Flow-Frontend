import React, { useState } from "react";
import { forgotPassword } from "../services/authService";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ForgotPassword = () => {

  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {

    e.preventDefault();

    try {

     await forgotPassword(email);

      toast.success("Reset Link Sent");

    } catch (error) {

      console.log(error);

      toast.error("Failed To Send Reset Link");
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
            Forgot Password
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Reset your account password
          </p>
        </div>

        <form
          onSubmit={handleForgotPassword}
          className="space-y-5"
        >

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all"
          >
            Send Reset Link
          </button>

          <div className="text-center">

            <Link
              to="/auth"
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

export default ForgotPassword;