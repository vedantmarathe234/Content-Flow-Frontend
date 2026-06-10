import { useRef, useState, useEffect } from "react";
import API from "../services/api";
import { toast } from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  
  const [tempAvatarFile, setTempAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  });
  
  const fileRef = useRef();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await API.get("/users/me");
        setName(res.data.name || "");
        setEmail(res.data.email || "");
        setAvatar(res.data.profilePhotoUrl || "");
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUserData();
  }, []);

 
 const handleResetPassword = () => {
  setShowChangePassword(true);
};

const handlePasswordChange = (e) => {
  setPasswordData({
    ...passwordData,
    [e.target.name]: e.target.value,
  });
};

const handleSavePassword = async () => {
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  try {
    await API.post("/auth/change-password", {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });

    toast.success("Password changed successfully");

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowChangePassword(false);
  } catch (err) {
    toast.error("Failed to change password");
  }
};

  const handleUpload = () => { if (isEditing) fileRef.current.click(); };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setTempAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let finalAvatarUrl = avatar;

      if (tempAvatarFile) {
        const formData = new FormData();
        formData.append("file", tempAvatarFile);
        const res = await API.post("/users/upload-profile", formData);
        finalAvatarUrl = res.data.url;
      }

      await API.put("/users/update", { name: name, profilePhotoUrl: finalAvatarUrl });
      
      setAvatar(finalAvatarUrl);
      setTempAvatarFile(null);
      setPreviewUrl(null);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) { 
      toast.error("Update failed!"); 
    } finally { 
      setSaving(false); 
    }
  };
  const handleRemovePhoto = async () => {
  try {
    await API.put("/users/remove-profile");

    setAvatar("");
    setPreviewUrl(null);
    setTempAvatarFile(null);

    toast.success("Profile photo removed");
  } catch (err) {
    toast.error("Failed to remove photo");
  }
};

  return (
    <div >
      <div className="flex-1">
        <div className="flex items-center justify-between mb-8">
  <div className="flex items-center gap-4">
    <button
      onClick={() => navigate(-1)}
      className="p-2 hover:bg-slate-100 rounded-full transition-colors"
    >
      <FiArrowLeft size={20} />
    </button>

    <div>
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
        Account Settings
      </h1>
      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1">
        Manage your account details and preferences
      </p>
    </div>
  </div>

  {!isEditing ? (
    <button
      onClick={() => setIsEditing(true)}
      className="bg-[#4f46e5] hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-all shadow-sm"
    >
      Edit Profile
    </button>
  ) : (
    <button
      onClick={handleSave}
      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-all shadow-sm"
    >
      {saving ? "Saving..." : "Save Changes"}
    </button>
  )}
</div>
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center justify-center text-center self-start lg:sticky lg:top-6">
            <div className="relative mb-4">
              <div className="w-40 h-40 rounded-full bg-gray-200 overflow-hidden cursor-pointer" onClick={handleUpload}>
                {previewUrl || avatar ? (
    <img
    src={previewUrl || `http://localhost:8080/uploads/${avatar}?t=${Date.now()}`}
    className="w-full h-full object-cover"
    alt="Profile"
    />
    ) : (
  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-600">
    {name?.charAt(0)?.toUpperCase()}
  </div>
        )}
              </div>
              {isEditing && (
                <div onClick={handleUpload} className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:scale-110 transition">
                  ✏️
                </div>
              )}
              <input type="file" ref={fileRef} hidden accept="image/*" onChange={handleFileChange} />
            </div>
            {isEditing && avatar && (
           <button
           onClick={handleRemovePhoto}
           className="mb-3 text-xs text-red-600 hover:text-red-800 font-semibold"
           >
          Remove Photo
          </button>
           )}
            <h2 className="font-semibold text-lg">{name || "User"}</h2>
            <p className="text-sm text-gray-500">{email || "Loading..."}</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="font-semibold text-lg mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-semibold">Full Name</label>
                  <input 
                    value={name} 
                    disabled={!isEditing} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full mt-1 px-3 py-2 rounded-lg border bg-gray-50" 
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-semibold">Email</label>
                  <input 
                    value={email} 
                    disabled 
                    className="w-full mt-1 px-3 py-2 rounded-lg border bg-gray-100 cursor-not-allowed" 
                  />
                </div>
              </div>
            </div>

           
            <div className="bg-white p-6 rounded-2xl shadow-md flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-800">Security</h3>
                <p className="text-sm text-gray-500">Manage your account security</p>
              </div>
              <button 
                onClick={handleResetPassword} 
                className="px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
              >
                Reset Password
              </button>
            </div>
            {showChangePassword && (
  <div className="bg-white p-6 rounded-2xl shadow-md">
    <h3 className="font-semibold text-lg mb-4">
      Change Password
    </h3>

    <div className="space-y-4">
      <input
        type="password"
        name="currentPassword"
        placeholder="Current Password"
        value={passwordData.currentPassword}
        onChange={handlePasswordChange}
        className="w-full px-3 py-2 border rounded-lg"
      />

      <input
        type="password"
        name="newPassword"
        placeholder="New Password"
        value={passwordData.newPassword}
        onChange={handlePasswordChange}
        className="w-full px-3 py-2 border rounded-lg"
      />

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm New Password"
        value={passwordData.confirmPassword}
        onChange={handlePasswordChange}
        className="w-full px-3 py-2 border rounded-lg"
      />

      <div className="flex gap-3">
        <button
          onClick={handleSavePassword}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          Save Password
        </button>

        <button
          onClick={() => setShowChangePassword(false)}
          className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;