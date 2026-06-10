import { useEffect, useState } from "react";
import { getContentById, updateContent } from "../../services/contentService";
import { toast } from "react-hot-toast";
import { X, FileText, Link2, UploadCloud, Calendar, Layers } from "lucide-react";

const EditContentModal = ({ id, onClose, onRefresh }) => {
  const [content, setContent] = useState(null);
  const [file, setFile] = useState(null);

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
    }
  };

  if (!content) {
    return (
      <div className="fixed inset-0 z-[120] bg-black/40 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white p-4 rounded-xl shadow-xl flex items-center gap-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-xs font-medium text-slate-600">Loading details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[120] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      {/* कार्डची रुंदी max-w-2xl वरून कमी करून max-w-md (Compact) केली आहे */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header - पॅडिंग आणि साईझ कमी केली */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900">Edit Content</h2>
            <p className="text-[11px] text-slate-500">Update content fields below</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
          >
            <X size={14} />
          </button>
        </div>

        {/* Form Body - स्पेसिंग कमी (space-y-3.5) आणि लहान पॅडिंग (p-5) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-3.5">
          
          {/* Title */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <FileText size={12} /> Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium text-slate-800 transition-all"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <FileText size={12} /> Description
            </label>
            <textarea
              rows={3} // रो ची संख्या कमी केली जेणेकरून जागा वाचेल
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs leading-normal text-slate-700 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar size={12} /> Scheduled Date
            </label>
            <input
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium text-slate-800 transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Layers size={12} /> Upload Provider
            </label>
            <select
              value={formData.uploadProvider}
              onChange={(e) => setFormData({ ...formData, uploadProvider: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium text-slate-800 transition-all"
            >
              <option value="DRIVE">Google Drive</option>
              <option value="CLOUDNARY"> Upload Media</option>
            </select>
          </div>

      
          <div className="pt-1">
            {formData.uploadProvider === "DRIVE" ? (
              <div className="bg-blue-50/40 border border-blue-100/70 p-3 rounded-xl">
                <label className="block text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Link2 size={12} /> Google Drive Link
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={formData.googleDriveLink}
                  onChange={(e) => setFormData({ ...formData, googleDriveLink: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-800 transition-all"
                  required={formData.uploadProvider === "DRIVE"}
                />
              </div>
            ) : (
              <div className="bg-indigo-50/40 border border-indigo-100/70 p-3 rounded-xl">
                <label className="block text-[11px] font-bold text-indigo-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <UploadCloud size={12} /> Upload New File
                </label>
                <div className="relative flex items-center justify-center bg-white border border-dashed border-slate-300 rounded-lg p-3 hover:bg-slate-50 transition-all group cursor-pointer">
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-700 group-hover:text-blue-600 transition-colors truncate max-w-[250px]">
                      {file ? file.name : "Select a file"}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "Leave empty to keep current"}
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
              className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
            >
              Update
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditContentModal;