import { useState } from "react";
import { registerUser } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  role: "INTERN",
  departmentName: "",
  secretKey: ""
});

 const handleChange = (e) => {

  const { name, value } = e.target;

  if (name === "role" && value === "ADMIN") {

    setFormData({
      ...formData,
      role: value,
      departmentName: ""
    });

    return;
  }

  setFormData({
    ...formData,
    [name]: value
  });
};

  const handleRegister = async (e) => {

  e.preventDefault();

  try {

    await registerUser(formData);

    toast.success(
      "Registration Successful"
    );

    navigate("/login");

  } catch (error) {

    console.log(error);

    toast.error("Registration Failed");
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
            Create Account
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Join ContentFlow
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="space-y-5"
        >

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />

{
  formData.role === "INTERN" && (

    <input
      type="text"
      name="departmentName"
      placeholder="Department Name"
      value={formData.departmentName}
      onChange={handleChange}
      className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
    />

  )
}

<input
  type="text"
  name="secretKey"
  placeholder="Secret Key"
  value={formData.secretKey}
  onChange={handleChange}
  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
/>

<select
  name="role"
  value={formData.role}
  onChange={handleChange}
  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
>

  <option value="INTERN">
    INTERN
  </option>

  <option value="ADMIN">
    ADMIN
  </option>

</select>



          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all"
          >
            Register
          </button>

          <p className="text-center text-sm text-slate-500">

            Already have an account?

            <Link
              to="/login"
              className="text-blue-600 font-semibold ml-1"
            >
              Login
            </Link>

          </p>

        </form>
      </div>
    </div>
  );
};

export default Register;