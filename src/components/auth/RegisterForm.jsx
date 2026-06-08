
import { registerUser } from "../../services/authService";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff, FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import API from "../../services/api";

const RegisterForm = ({ setIsLogin }) => {

  const [showPassword, setShowPassword] = useState(false);
//   const [emailError, setEmailError] = useState("");
  const [departments, setDepartments] = useState([]);

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
  if (
  formData.role === "INTERN" &&
  !formData.departmentName
) {
  toast.error("Please select a department");
  return;
}

  try {

    await registerUser(formData);

    toast.success(
      "Registration Successful"
    );

    setIsLogin(true);

  } catch {

    toast.error(
      "Registration Failed"
    );

  }

};

 useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await API.get("/departments/public");

        setDepartments(response.data);
      } catch (error) {
        console.error("Failed to fetch departments", error);

        toast.error("Unable to load departments");
      }
    };

    fetchDepartments();
  }, []);

  return (
    <motion.div
      key="register"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.35 }}
     className="w-full max-w-[380px] px-2"
    >

      <div className="">

       
      <div className="">
  <div className="flex justify-center">
    <img src="src/assets/Athenura.png" alt="Athenura" className="h-15 object-contain" />
  </div>

  <h1 className="text-[1.6rem]
    font-bold
    tracking-tight
    mb-4
    bg-gradient-to-r
    from-[#0A5B63]
    to-[#2F7E86]
    bg-clip-text
    text-transparent" >Create account</h1>
  
</div>

      </div>


     
      
                  <form onSubmit={handleRegister} className="space-y-1.5 flex-1">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        Full Name
                      </label>
      
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter full name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm outline-none transition-all
  focus:border-[#0A5B63] focus:bg-white focus:ring-4 focus:ring-[#0A5B63]/8 placeholder:text-slate-300"
                      />
                    </div>
      
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        Email
                      </label>
      
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm outline-none transition-all
  focus:border-[#0A5B63] focus:bg-white focus:ring-4 focus:ring-[#0A5B63]/8 placeholder:text-slate-300"
                      />
      
                      {/* {emailError && (
                        <p className="text-red-500 text-xs mt-1">{emailError}</p>
                      )} */}
                    </div>
      
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        Password
                      </label>
      
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm outline-none transition-all
  focus:border-[#0A5B63] focus:bg-white focus:ring-4 focus:ring-[#0A5B63]/8 placeholder:text-slate-300"
                        />
      
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>
      
                    <div
                      className={
                        formData.role === "ADMIN"
                          ? "grid grid-cols-1"
                          : "grid grid-cols-2 gap-4"
                      }
                    >
                     
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                          Role
                        </label>
      
                        <div className="relative">
                          <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full border border-slate-200 bg-slate-50 appearance-none rounded-xl px-4 py-2.5 text-sm outline-none transition-all
  focus:border-[#0A5B63] focus:bg-white focus:ring-4 focus:ring-[#0A5B63]/8 placeholder:text-slate-300"
                          >
                            <option value="INTERN">INTERN</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
      
                          <FiChevronDown
                            size={18}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                          />
                        </div>
                      </div>
      
                     
                      {formData.role === "INTERN" && (
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                            Department
                          </label>
      
                          <div className="relative">
                            <select
                              name="departmentName"
                              value={formData.departmentName}
                              onChange={handleChange}
                              className="w-full border border-slate-200 bg-slate-50 appearance-none rounded-xl px-4 py-2.5 text-sm outline-none transition-all
  focus:border-[#0A5B63] focus:bg-white focus:ring-4 focus:ring-[#0A5B63]/8 placeholder:text-slate-300"
                            >
                              <option value="">Select Department</option>
      
                              {departments.map((dept) => (
                                <option key={dept.id} value={dept.name}>
                                  {dept.name}
                                </option>
                              ))}
                            </select>
      
                            <FiChevronDown
                              size={18}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
      
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        {formData.role === "ADMIN"
                          ? "Admin Secret Key"
                          : "Department Key"}
                      </label>
      
                      <input
                        type="text"
                        name="secretKey"
                        placeholder={
                          formData.role === "ADMIN"
                            ? "Enter admin secret key"
                            : "Enter department key"
                        }
                        value={formData.secretKey}
                        onChange={handleChange}
                       className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm outline-none transition-all
  focus:border-[#0A5B63] focus:bg-white focus:ring-4 focus:ring-[#0A5B63]/8 placeholder:text-slate-300"
                      />
                    </div>
      
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl text-sm font-semibold text-white tracking-wide transition-all hover:opacity-90 active:scale-[0.99]"
style={{ background: "linear-gradient(135deg, #0A5B63 0%, #1A7A84 100%)", boxShadow: "0 4px 14px rgba(10,91,99,0.35)" }}
      >
                      Register →
                    </button>
                  </form>
              

  <p className="text-center text-xs text-slate-400 mt-2">
  Already have an account?{" "}

  <button
    type="button"
    onClick={() => setIsLogin(true)}
    className="text-[#0A5B63] font-semibold hover:underline"
  >
     Login
  </button>
</p>

    </motion.div>
  );
};

export default RegisterForm;