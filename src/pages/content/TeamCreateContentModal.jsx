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
  const [isProcessing, setIsProcessing] = useState(false);
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
    
    setIsProcessing(true);
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
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-l-[4px] border-l-amber-500 border-slate-100">
        
        <div className="px-6 py-4 border-b border-slate-100 bg-[#063A3A]/5 flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-[#063A3A]">Create New Content</h2>
            <p className="text-[10px] font-bold text-[#0D7A80] uppercase tracking-wider mt-0.5">TEAM: {teamName || "Loading..."}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-700 transition-colors text-lg font-light cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Title</label>
            <input 
              type="text" 
              placeholder="Enter team content title..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none hover:border-[#0D7A80]/50 focus:ring-2 focus:ring-[#0D7A80]/20 focus:border-[#0D7A80] transition-all text-sm font-medium placeholder-slate-400" 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
            <textarea 
              rows={3} 
              placeholder="Write a brief description of the team content..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none hover:border-[#0D7A80]/50 focus:ring-2 focus:ring-[#0D7A80]/20 focus:border-[#0D7A80] transition-all text-sm font-medium placeholder-slate-400" 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
            />
          </div>

          <div className="relative" ref={menuRef}>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Media Source</label>
            
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl hover:border-[#0D7A80]/50 focus-within:ring-2 focus-within:ring-[#0D7A80]/20 focus-within:border-[#0D7A80] transition-all duration-200 overflow-hidden">
              {formData.uploadProvider === "DRIVE" ? (
                <input
                  type="text"
                  placeholder="Paste shared Google Drive link..."
                  className="w-full bg-transparent px-3 py-2 outline-none text-sm text-slate-700 font-medium placeholder-slate-400"
                  value={formData.googleDriveLink}
                  onChange={(e) => setFormData({ ...formData, googleDriveLink: e.target.value })}
                />
              ) : (
                <div className="w-full px-3 py-2 text-sm text-slate-400 font-medium truncate select-none bg-slate-50">
                  {file ? <span className="text-slate-700 font-semibold">{file.name}</span> : "No file selected yet"}
                </div>
              )}
              
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="px-3.5 py-2 text-slate-400 hover:text-[#063A3A] transition-colors border-l border-slate-200 bg-slate-50 text-[10px] cursor-pointer"
              >
                ▼
              </button>
            </div>

            {showMenu && (
              <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-1.5 animate-in slide-in-from-top-2">
                <button 
                  type="button" 
                  className="w-full text-left px-4 py-2 hover:bg-[#0D7A80]/5 hover:text-[#063A3A] font-bold transition-colors text-xs uppercase tracking-wider text-slate-600" 
                  onClick={() => { setFormData({...formData, uploadProvider: "DRIVE"}); setShowMenu(false); }}
                >
                  Google Drive
                </button>
                <button 
                  type="button" 
                  className="w-full text-left px-4 py-2 hover:bg-[#0D7A80]/5 hover:text-[#063A3A] font-bold transition-colors text-xs uppercase tracking-wider text-slate-600" 
                  onClick={() => { setFormData({...formData, uploadProvider: "CLOUDNARY"}); fileInputRef.current?.click(); setShowMenu(false); }}
                >
                  Upload Media
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Schedule Date</label>
            <input 
              type="date" 
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none hover:border-[#0D7A80]/50 focus:ring-2 focus:ring-[#0D7A80]/20 focus:border-[#0D7A80] transition-all text-sm font-medium text-slate-700" 
              value={formData.scheduledDate} 
              onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})} 
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isProcessing}
              className="flex-1 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isProcessing}
              className={`flex-1 py-2 text-white rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#063A3A] hover:bg-[#0D7A80]'}`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : "Create"}
            </button>
          </div>
        </form>

        <input 
          ref={fileInputRef} 
          type="file" 
          className="hidden" 
          onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} 
        />
      </div>
    </div>
  );
};

export default TeamCreateContentModal;