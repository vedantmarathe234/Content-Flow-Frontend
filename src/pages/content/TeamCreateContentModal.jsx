import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { createContent } from "../../services/contentService";

const TeamCreateContentModal = ({ isOpen, onClose, onRefresh, selectedDate, teamId, teamName }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contentType: "TEAM",
    teamId: teamId || null,
    uploadProvider: "DRIVE",
    googleDriveLink: "",
    scheduledDate: selectedDate || "",
  });

  const [file, setFile] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, teamId: teamId }));
  }, [teamId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return toast.error("Title is required");
    if (!formData.description.trim()) return toast.error("Description is required");
    
    const multipartData = new FormData();
    if (file) multipartData.append("file", file);
    multipartData.append("data", new Blob([JSON.stringify(formData)], { type: "application/json" }));

    try {
      await createContent(multipartData);
      toast.success("Team content created successfully");
      onRefresh();
      onClose();
    } catch (error) {
      toast.error("Failed to create content");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Create New Content</h2>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">TEAM: {teamName || "Loading..."}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors text-xl font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Title</label>
            <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all text-sm" 
              value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
            <textarea rows={3} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all text-sm" 
              value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="relative" ref={menuRef}>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Media Source</label>
            
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-emerald-500/40 focus-within:border-emerald-500 transition-all duration-200">
              {formData.uploadProvider === "DRIVE" ? (
                <input
                  type="text"
                  placeholder="Paste Google Drive link..."
                  className="w-full bg-transparent px-3 py-2 outline-none text-sm text-slate-700"
                  value={formData.googleDriveLink}
                  onChange={(e) => setFormData({ ...formData, googleDriveLink: e.target.value })}
                />
              ) : (
                <div className="w-full px-3 py-2 text-sm text-slate-700 truncate select-none">
                  {file ? file.name : "No file selected"}
                </div>
              )}
              
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="px-3 py-2 text-slate-400 hover:text-emerald-600 transition-colors  border-slate-200"
              >
                ▼
              </button>
            </div>

            {showMenu && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-100 rounded-lg shadow-xl z-50 py-1 animate-in slide-in-from-top-2">
                <button type="button" className="w-full text-left px-4 py-2 hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-sm text-slate-700" onClick={() => { setFormData({...formData, uploadProvider: "DRIVE"}); setShowMenu(false); }}>Google Drive</button>
                <button type="button" className="w-full text-left px-4 py-2 hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-sm text-slate-700" onClick={() => { setFormData({...formData, uploadProvider: "CLOUDNARY"}); fileInputRef.current?.click(); setShowMenu(false); }}>Upload Media</button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Schedule Date</label>
            <input type="date" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all text-sm" 
              value={formData.scheduledDate} onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})} />
          </div>

          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">Create</button>
          </div>
        </form>

        <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
      </div>
    </div>
  );
};

export default TeamCreateContentModal;