import { X, Trash2, Edit3, ExternalLink, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { getAllContent, leaderApprove, deleteContent } from "../../services/contentService";
import StatusBadge from "./StatusBadge";
import { toast } from "react-hot-toast";
import API from "../../services/api";
import { markNotificationsByContent } from "../../services/notificationService";
import EditContentModal from "./EditContentModal";
import MediaPreviewModal from "../../components/MediaPreviewModal";

const ContentDetailsPage = ({ id, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showLeaderRejectModal, setShowLeaderRejectModal] = useState(false);
  const [leaderRejectReason, setLeaderRejectReason] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMediaPreview, setShowMediaPreview] = useState(false);

  const role = localStorage.getItem("role");
  const currentUserId = localStorage.getItem("userId") ? Number(localStorage.getItem("userId")) : null;

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllContent();
      const foundContent = response.data.find((item) => Number(item.id) === Number(id));
      setContent(foundContent);
    } catch (error) { 
      console.error(error); 
      toast.error("Failed to fetch content details");
    } finally { 
      setLoading(false); 
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchContent();
      markNotificationsByContent(id).catch(console.error);
    }
  }, [id, fetchContent]);

  const handleLeaderApprove = async () => { 
    setIsProcessing(true);
    try { 
      await leaderApprove(id); 
      toast.success("Approved by Leader"); 
      fetchContent(); 
      onRefresh?.(); 
    } catch (e) { 
      toast.error("Failed to approve"); 
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdminApprove = async () => { 
    setIsProcessing(true);
    try { 
      await API.put(`/content/${id}/approve`); 
      toast.success("Approved by Admin"); 
      fetchContent(); 
      onRefresh?.(); 
    } catch (e) { 
      toast.error("Failed to approve"); 
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLeaderReject = async () => { 
    if (!leaderRejectReason.trim()) return toast.error("Enter reason"); 
    setIsProcessing(true);
    try {
      await API.put(`/content/${id}/leader-reject`, { reason: leaderRejectReason }); 
      toast.success("Rejected by Leader"); 
      setShowLeaderRejectModal(false); 
      setLeaderRejectReason(""); 
      fetchContent(); 
      onRefresh?.(); 
    } catch (e) {
      toast.error("Failed to reject");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdminReject = async () => { 
    if (!rejectReason.trim()) return toast.error("Enter reason"); 
    setIsProcessing(true);
    try {
      await API.put(`/content/${id}/reject`, { reason: rejectReason }); 
      toast.success("Rejected by Admin"); 
      setShowRejectModal(false); 
      setRejectReason(""); 
      fetchContent(); 
      onRefresh?.(); 
    } catch (e) {
      toast.error("Failed to reject");
    } finally {
      setIsProcessing(false);
    }
  };

const handleDownload = async () => {
  try {
    const response = await fetch(content.mediaUrl);

    if (!response.ok) {
      throw new Error("Download failed");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = content.title || "content";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
    toast.error("Failed to download content");
  }
};

  const handleDelete = async () => { 
    if (!canDelete) {
      toast.error("You cannot delete this content at this stage");
      return;
    }

  
    setIsProcessing(true);
    try {
      await deleteContent(id); 
      toast.success("Deleted successfully"); 
      setShowDeleteModal(false); 
      onClose(); 
      onRefresh?.(); 
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to delete content");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-[110]">Loading...</div>;
  if (!content) return null;

  const canEdit = content.createdById === currentUserId && content.status !== "APPROVED";
  const showLeaderApproval = content.status === "PENDING_LEADER" && content.teamLeaderId === currentUserId;
  const showAdminApproval = role === "ADMIN" && content.status === "PENDING";
  const isCreator = content.createdById === currentUserId && content.status !== "APPROVED";
  const isAdminAllowedToDelete = role === "ADMIN" && (content.status === "PENDING" || content.status === "REJECTED");
  const canDelete = isCreator || isAdminAllowedToDelete;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto scrollbar scrollbar-thumb-[#0D7A80]/40 p-6 border-l border-slate-100 animate-in slide-in-from-right duration-300">
      
        <div className="flex items-center justify-between mb-3 pb-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-[#063A3A]">Content Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full cursor-pointer text-slate-400 hover:text-slate-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-1">
          <div>
            <h1 className="text-lg font-bold text-[#063A3A]">Content Title: {content.title}</h1>
          </div>

          <div className="grid grid-cols-2 gap-4  p-4 rounded-xl bg-emerald-50  border border-emerald-200/60 ">
            <InfoItem label="Created By" value={content.createdBy} />
            <InfoItem label="Uploaded By" value={content.team} />
            <InfoItem label="Scheduled Date" value={content.scheduledDate} />
            <InfoItem label="Created At" value={new Date(content.createdAt).toLocaleString()} />
          </div>

          <div className=" p-4 rounded-xl border bg-amber-50  border-amber-200/60">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</p>
            <p className="text-slate-700 mt-1.5 text-sm font-medium leading-relaxed">{content.description}</p>
          </div>

          {content.rejectionReason && (
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Rejection Reason</p>
              <p className="text-red-700 mt-1 text-sm font-semibold">{content.rejectionReason}</p>
            </div>
          )}

          <div className="border-t border-slate-100 pt-3">
            <h3 className="font-bold text-base text-[#063A3A] mb-3">Approval Workflow</h3>
            <div className="grid grid-cols-2 gap-4 text-sm p-4 rounded-xl bg-[#063A3A]/5  border border-[#063A3A]-200/60 ">
              <InfoItem label="Current Stage" value={content.currentStage} />
              <InfoItem label="Department" value={content.department} />
              <InfoItem label="Leader Approval" value={content.approvedByLeader || "N/A"} />
              <InfoItem label="Admin Approval" value={content.approvedByAdmin || "N/A"} />
              <div className="col-span-2">
                <InfoItem label="Status" value={<StatusBadge status={content.status} />} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex gap-2">
            <button 
              onClick={() => setShowMediaPreview(true)} 
              className="flex-1 py-2.5 bg-[#063A3A] text-white rounded-xl flex items-center justify-center gap-2 font-bold text-sm hover:bg-[#0D7A80] transition-all shadow-sm cursor-pointer"
            >
              <ExternalLink size={16} /> View Content
            </button>

             <button
  onClick={handleDownload}
  className="flex-1 py-2.5 bg-green-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-green-700"
>
  Download
</button>
            {canEdit && (
              <button onClick={() => setShowEditModal(true)} className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl flex items-center justify-center gap-2 font-bold text-sm hover:bg-amber-600 transition-all shadow-sm cursor-pointer">
                <Edit3 size={16} /> Edit
              </button>
            )}
          </div>

          {(showLeaderApproval || showAdminApproval) && (
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={showLeaderApproval ? handleLeaderApprove : handleAdminApprove} 
                disabled={isProcessing}
                className={`py-2.5 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-1 transition-all shadow-sm cursor-pointer ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              >
                {isProcessing ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <CheckCircle size={16} />}
                {isProcessing ? "Processing..." : "Approve"}
              </button>
              <button 
                onClick={() => showLeaderApproval ? setShowLeaderRejectModal(true) : setShowRejectModal(true)} 
                disabled={isProcessing}
                className={`py-2.5 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-1 transition-all shadow-sm cursor-pointer ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
              >
                <XCircle size={16} /> Reject
              </button>
            </div>
          )}

          {canDelete && (
            <button 
              onClick={() => setShowDeleteModal(true)} 
              disabled={isProcessing}
              className={`w-full py-2.5 font-bold text-sm flex items-center justify-center gap-2 border rounded-xl transition-all cursor-pointer ${isProcessing ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'text-red-600 border-red-100 hover:bg-red-50'}`}
            >
              <Trash2 size={16} /> {isProcessing ? "Deleting..." : "Delete Content"}
            </button>
          )}
        </div>
      </div>

      {(showRejectModal || showLeaderRejectModal) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <h3 className="font-bold text-lg text-[#063A3A] mb-4">Reject Content</h3>
            <textarea 
              rows={4} 
              disabled={isProcessing}
              className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 mb-4 outline-none hover:border-red-500/50 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm font-medium placeholder-slate-400" 
              placeholder="Please input the concrete reason for rejection here..." 
              value={showLeaderRejectModal ? leaderRejectReason : rejectReason} 
              onChange={(e) => showLeaderRejectModal ? setLeaderRejectReason(e.target.value) : setRejectReason(e.target.value)} 
            />
            <div className="flex gap-2">
              <button 
                onClick={() => {setShowRejectModal(false); setShowLeaderRejectModal(false)}} 
                disabled={isProcessing}
                className="flex-1 py-2 border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={showLeaderRejectModal ? handleLeaderReject : handleAdminReject} 
                disabled={isProcessing}
                className="flex-1 py-2 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all cursor-pointer"
              >
                {isProcessing ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <h3 className="font-bold text-lg text-[#063A3A]">Delete Content</h3>
            <p className="my-4 text-slate-600 text-sm font-medium">Are you sure you want to permanently delete this content? This action cannot be undone.</p>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowDeleteModal(false)} 
                disabled={isProcessing}
                className="flex-1 py-2 border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete} 
                disabled={isProcessing}
                className="flex-1 py-2 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all cursor-pointer"
              >
                {isProcessing ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <EditContentModal
          id={id}
          onClose={() => setShowEditModal(false)}
          onRefresh={() => {
            fetchContent();
            onRefresh?.();
          }}
        />
      )}

      <MediaPreviewModal
        isOpen={showMediaPreview}
        onClose={() => setShowMediaPreview(false)}
        mediaUrl={content.mediaUrl}
        title={content.title}
      />
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
    <div className="text-slate-700 font-semibold text-sm">{value}</div>
  </div>
);

export default ContentDetailsPage;