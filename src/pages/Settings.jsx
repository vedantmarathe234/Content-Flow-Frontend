import { useRef, useState, useEffect } from "react";
import API from "../services/api";
import { toast } from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  X,
  FileText,
  Link2,
  UploadCloud,
  Calendar,
  Layers,
  Pencil,
} from "lucide-react";

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
        const currentPhoto = res.data.profilePhotoUrl || "";
        setAvatar(currentPhoto);

        if (currentPhoto) {
          localStorage.setItem("profilePhotoUrl", currentPhoto);
        }
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
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("All password fields are required");
      return;
    }
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

  const handleUpload = () => {
    if (isEditing) fileRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setTempAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setSaving(true);
    try {
      let finalAvatarUrl = avatar;

      if (tempAvatarFile) {
        const formData = new FormData();
        formData.append("file", tempAvatarFile);
        const res = await API.post("/users/upload-profile", formData);
        finalAvatarUrl = res.data.url;
      }

      await API.put("/users/update", {
        name: name,
        profilePhotoUrl: finalAvatarUrl,
      });

      setAvatar(finalAvatarUrl);
      setTempAvatarFile(null);
      setPreviewUrl(null);

      localStorage.setItem("profilePhotoUrl", finalAvatarUrl || "");
      localStorage.setItem("name", name);

      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("profilePhotoUpdated"));

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

      localStorage.setItem("profilePhotoUrl", "");
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("profilePhotoUpdated"));

      toast.success("Profile photo removed");
    } catch (err) {
      toast.error("Failed to remove photo");
    }
  };

  return (
    <div className="w-full mx-auto p-2 font-sans text-slate-800 animate-in fade-in duration-300">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-[#063A3A]/5 rounded-full transition-colors cursor-pointer text-[#063A3A]"
              title="Go Back"
            >
              <FiArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-[#063A3A] tracking-tight">
                Account Settings
              </h1>
            </div>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#063A3A] hover:bg-[#0D7A80] text-white font-bold py-2 px-5 rounded-xl text-sm transition-all shadow-sm cursor-pointer"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="bg-[#0D7A80]/90 hover:bg-[#0D7A80] text-white font-bold py-2 px-5 rounded-xl text-sm transition-all shadow-sm cursor-pointer"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border-y border-r border-slate-200/80 border-l-[4px] border-l-[#0D7A80] flex flex-col items-center justify-center text-center self-start lg:sticky lg:top-6">
            <div className="relative mb-4 group">
              <div
                className={`w-40 h-40 rounded-full bg-slate-100 border-2 overflow-hidden flex items-center justify-center transition-all ${isEditing ? "cursor-pointer border-dashed border-[#0D7A80] hover:opacity-80" : "border-slate-200"}`}
                onClick={handleUpload}
              >
                {previewUrl || avatar ? (
                  <img
                    src={
                      previewUrl ||
                      `http://localhost:8080/uploads/${avatar}?t=${Date.now()}`
                    }
                    className="w-full h-full object-cover"
                    alt="Profile Avatar"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-black text-[#063A3A]">
                    {name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
              {isEditing && (
                <div
                  onClick={handleUpload}
                  className="absolute bottom-1 right-1 bg-[#0D7A80] text-white p-2 rounded-full cursor-pointer hover:bg-[#0D7A80] hover:scale-105 shadow-md transition-all"
                >
                  <Pencil size={16} />
                </div>
              )}
              <input
                type="file"
                ref={fileRef}
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {isEditing && avatar && (
              <button
                onClick={handleRemovePhoto}
                className="mb-3 text-xs text-rose-600 hover:text-rose-800 font-bold transition-colors cursor-pointer"
              >
                Remove Photo
              </button>
            )}
            <h2 className="font-bold text-lg text-slate-800">
              {name || "User Name"}
            </h2>
            <p className="text-sm font-medium text-slate-400 mt-0.5 break-all">
              {email || "Email address"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border-y border-r border-slate-200/80 border-l-[4px] border-l-[#0D7A80]">
              <h3 className="font-bold text-base text-[#063A3A] mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    disabled={!isEditing}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-medium rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none hover:border-[#0D7A80]/50 focus:ring-2 focus:ring-[#0D7A80]/20 focus:border-[#0D7A80] disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="type"
                    value={email}
                    disabled
                    placeholder="your-email@domain.com"
                    className="w-full px-3 py-2 text-sm font-medium rounded-xl border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border-y border-r border-slate-200/80 border-l-[4px] border-l-[#0D7A80] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-base text-[#063A3A]">
                  Security & Privacy
                </h3>
                <p className="text-sm font-medium text-slate-400 mt-0.5">
                  Manage credentials and secure your digital account
                </p>
              </div>
              <button
                onClick={handleResetPassword}
                className="px-5 py-2 bg-[#0D7A80] text-white font-bold text-sm rounded-xl hover:bg-[#063A3A] transition-all shadow-sm cursor-pointer self-start sm:self-auto"
              >
                Reset Password
              </button>
            </div>

            {showChangePassword && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border-y border-r border-slate-200/80 border-l-[4px] border-l-[#063A3A] animate-in fade-in slide-in-from-top-4 duration-200">
                <h3 className="font-bold text-base text-[#063A3A] mb-4">
                  Change Password
                </h3>

                <div className="max-w-md space-y-4">
                  <div>
                    <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      placeholder="Enter existing account password..."
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 text-sm border border-slate-200 bg-slate-50 rounded-xl focus:outline-none hover:border-[#0D7A80]/50 focus:ring-2 focus:ring-[#0D7A80]/20 focus:border-[#0D7A80] transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="Create a strong new password..."
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 text-sm border border-slate-200 bg-slate-50 rounded-xl focus:outline-none hover:border-[#0D7A80]/50 focus:ring-2 focus:ring-[#0D7A80]/20 focus:border-[#0D7A80] transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Retype your new password to match..."
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 text-sm border border-slate-200 bg-slate-50 rounded-xl focus:outline-none hover:border-[#0D7A80]/50 focus:ring-2 focus:ring-[#0D7A80]/20 focus:border-[#0D7A80] transition-all"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSavePassword}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-sm transition-all cursor-pointer"
                    >
                      Save Password
                    </button>

                    <button
                      onClick={() => {
                        setShowChangePassword(false);
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer"
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
