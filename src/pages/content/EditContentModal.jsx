import { useEffect, useState } from "react";
import { getContentById, updateContent } from "../../services/contentService";
import { toast } from "react-hot-toast";
import { X, FileText, Link2, UploadCloud, Calendar, Layers } from "lucide-react";

const EditContentModal = ({ id, onClose, onRefresh }) => {
  const [content, setContent] = useState(null);
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    uploadProvider: "DRIVE",
    googleDriveLink: "",
    scheduledDate: ""
  });

  useEffect(() => {
    fetchContent();
  }, [id]);

  const fetchContent = async () => {
    try {
      const response = await getContentById(id);
      const data = response.data;
      setContent(data);

      setFormData({
        title: data.title,
        description: data.description,
        uploadProvider: data.uploadProvider,
        googleDriveLink: data.uploadProvider === "DRIVE" ? data.mediaUrl : "",
        scheduledDate: data.scheduledDate
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load content details");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const multipartData = new FormData();

    if (file) {
      multipartData.append("file", file);
    }

    multipartData.append(
      "data",
      new Blob(
        [
          JSON.stringify({
            title: formData.title,
            description: formData.description,
            uploadProvider: formData.uploadProvider,
            googleDriveLink: formData.googleDriveLink,
            scheduledDate: formData.scheduledDate
          })
        ],
        { type: "application/json" }
      )
    );

    try {
      await updateContent(id, multipartData);
      toast.success("Content updated successfully");
      onRefresh?.();
      onClose?.();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update content"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (!content) {
    return (
      <div className="fixed inset-0 z-[120] bg-black/40 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white p-4 rounded-xl shadow-xl flex items-center gap-3 border border-slate-100">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0D7A80]"></div>
          <span className="text-xs font-medium text-slate-600">Loading details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[120] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-100 animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-[#063A3A]/5">
          <div>
            <h2 className="text-base font-bold text-[#063A3A]">Edit Content</h2>
            <p className="text-[11px] font-medium text-[#0D7A80]">Update content fields below</p>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-7 h-7 rounded-full bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-3.5">
          
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <FileText size={12} className="text-slate-400" /> Title
            </label>
            <input
              type="text"
              placeholder="Enter your content title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-200 bg-slate-50 rounded-lg focus:outline-none hover:border-[#0D7A80]/50 focus:ring-2 focus:ring-[#0D7A80]/20 focus:border-[#0D7A80] text-xs font-medium text-slate-800 transition-all placeholder-slate-400"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <FileText size={12} className="text-slate-400" /> Description
            </label>
            <textarea
              rows={3}
              placeholder="Provide a detailed description of the content here..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-200 bg-slate-50 rounded-lg focus:outline-none hover:border-[#0D7A80]/50 focus:ring-2 focus:ring-[#0D7A80]/20 focus:border-[#0D7A80] text-xs leading-normal text-slate-700 transition-all placeholder-slate-400"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar size={12} className="text-slate-400" /> Scheduled Date
            </label>
            <input
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-200 bg-slate-50 rounded-lg focus:outline-none hover:border-[#0D7A80]/50 focus:ring-2 focus:ring-[#0D7A80]/20 focus:border-[#0D7A80] text-xs font-medium text-slate-800 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Layers size={12} className="text-slate-400" /> Upload Provider
            </label>
            <select
              value={formData.uploadProvider}
              onChange={(e) => setFormData({ ...formData, uploadProvider: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-200 bg-slate-50 rounded-lg focus:outline-none hover:border-[#0D7A80]/50 focus:ring-2 focus:ring-[#0D7A80]/20 focus:border-[#0D7A80] text-xs font-medium text-slate-800 transition-all cursor-pointer"
            >
              <option value="DRIVE">Google Drive</option>
              <option value="CLOUDNARY">Upload Media</option>
            </select>
          </div>

          <div className="pt-1">
            {formData.uploadProvider === "DRIVE" ? (
              <div className="bg-[#0D7A80]/5 border border-[#0D7A80]/20 p-3 rounded-xl animate-in fade-in duration-200">
                <label className="block text-[11px] font-bold text-[#063A3A] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Link2 size={12} /> Google Drive Link
                </label>
                <input
                  type="url"
                  placeholder="Paste your shared Google Drive URL here..."
                  value={formData.googleDriveLink}
                  onChange={(e) => setFormData({ ...formData, googleDriveLink: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none hover:border-[#0D7A80]/50 focus:ring-2 focus:ring-[#0D7A80]/20 focus:border-[#0D7A80] text-xs text-slate-800 transition-all placeholder-slate-400"
                  required={formData.uploadProvider === "DRIVE"}
                />
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl animate-in fade-in duration-200">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <UploadCloud size={12} /> Upload New File
                </label>
                <div className="relative flex items-center justify-center bg-white border border-dashed border-slate-300 rounded-lg p-3 hover:border-[#0D7A80]/50 hover:bg-slate-50/50 transition-all group cursor-pointer">
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-700 group-hover:text-[#063A3A] transition-colors truncate max-w-[250px]">
                      {file ? file.name : "Select or drop a new file"}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "Leave empty to retain existing file"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className={`px-4 py-1.5 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-2 ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#063A3A] hover:bg-[#0D7A80]'}`}
            >
              {isProcessing ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : "Update"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditContentModal;