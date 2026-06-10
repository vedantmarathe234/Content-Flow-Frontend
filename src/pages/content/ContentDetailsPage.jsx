import { X, Trash2, Edit3, ExternalLink, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { getAllContent, leaderApprove, deleteContent } from "../../services/contentService";
import StatusBadge from "./StatusBadge";
import { toast } from "react-hot-toast";
import API from "../../services/api";
import { markNotificationsByContent } from "../../services/notificationService";
import EditContentModal from "./EditContentModal";

const ContentDetailsPage = ({ id, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showLeaderRejectModal, setShowLeaderRejectModal] = useState(false);
  const [leaderRejectReason, setLeaderRejectReason] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
    try { 
      await leaderApprove(id); 
      toast.success("Approved by Leader"); 
      fetchContent(); 
      onRefresh?.(); 
    } catch (e) { 
      toast.error("Failed to approve"); 
    } 
  };

  const handleAdminApprove = async () => { 
    try { 
      await API.put(`/content/${id}/approve`); 
      toast.success("Approved by Admin"); 
      fetchContent(); 
      onRefresh?.(); 
    } catch (e) { 
      toast.error("Failed to approve"); 
    } 
  };

  const handleLeaderReject = async () => { 
    if (!leaderRejectReason.trim()) return toast.error("Enter reason"); 
    try {
      await API.put(`/content/${id}/leader-reject`, { reason: leaderRejectReason }); 
      toast.success("Rejected by Leader"); 
      setShowLeaderRejectModal(false); 
      setLeaderRejectReason(""); 
      fetchContent(); 
      onRefresh?.(); 
    } catch (e) {
      toast.error("Failed to reject");
    }
  };

  const handleAdminReject = async () => { 
    if (!rejectReason.trim()) return toast.error("Enter reason"); 
    try {
      await API.put(`/content/${id}/reject`, { reason: rejectReason }); 
      toast.success("Rejected by Admin"); 
      setShowRejectModal(false); 
      setRejectReason(""); 
      fetchContent(); 
      onRefresh?.(); 
    } catch (e) {
      toast.error("Failed to reject");
    }
  };

const handleDelete = async () => { 
    if (!canDelete) {
      toast.error("You cannot delete this content at this stage");
      return;
    }

    try {
      await deleteContent(id); 
      toast.success("Deleted successfully"); 
      setShowDeleteModal(false); 
      onClose(); 
      onRefresh?.(); 
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to delete content");
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
      <div className="w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Content Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-bold">Content Title : {content.title}</h1>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InfoItem label="Created By" value={content.createdBy} />
            <InfoItem label="Uploaded By" value={content.team} />
            <InfoItem label="Scheduled Date" value={content.scheduledDate} />
            <InfoItem label="Created At" value={new Date(content.createdAt).toLocaleString()} />
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-xs font-bold text-slate-400 uppercase">Description</p>
            <p className="text-slate-700 mt-1">{content.description}</p>
          </div>

          {content.rejectionReason && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <p className="text-xs font-bold text-red-500 uppercase">Rejection Reason</p>
              <p className="text-red-700">{content.rejectionReason}</p>
            </div>
          )}

          <div className="border-t pt-4">
            <h3 className="font-bold text-lg mb-3">Approval Workflow</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <InfoItem label="Current Stage" value={content.currentStage} />
              <InfoItem label="Department" value={content.department} />
              <InfoItem label="Leader Approval" value={content.approvedByLeader || "N/A"} />
              <InfoItem label="Admin Approval" value={content.approvedByAdmin || "N/A"} />
              <InfoItem label="Status" value={<StatusBadge status={content.status} />} />
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <div className="flex gap-2">
            <button onClick={() => window.open(content.mediaUrl, "_blank")} className="flex-1 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2">
              <ExternalLink size={16} /> View Content
            </button>
            {canEdit && (
              <button onClick={() => setShowEditModal(true)} className="flex-1 py-2 bg-amber-500 text-white rounded-lg flex items-center justify-center gap-2">
                <Edit3 size={16} /> Edit
              </button>
            )}
          </div>

          {(showLeaderApproval || showAdminApproval) && (
            <div className="grid grid-cols-2 gap-2">
              <button onClick={showLeaderApproval ? handleLeaderApprove : handleAdminApprove} className="py-2 bg-green-600 text-white rounded-lg font-semibold flex items-center justify-center gap-1">
                <CheckCircle size={16} /> Approve
              </button>
              <button onClick={() => showLeaderApproval ? setShowLeaderRejectModal(true) : setShowRejectModal(true)} className="py-2 bg-red-600 text-white rounded-lg font-semibold flex items-center justify-center gap-1">
                <XCircle size={16} /> Reject
              </button>
            </div>
          )}

          {canDelete && (
            <button onClick={() => setShowDeleteModal(true)} className="w-full py-2 text-red-600 font-semibold flex items-center justify-center gap-2 border border-red-100 rounded-lg hover:bg-red-50 transition-all">
              <Trash2 size={16} /> Delete Content
            </button>
          )}
        </div>
      </div>

      
      {(showRejectModal || showLeaderRejectModal) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-bold text-lg mb-4">Reject Content</h3>
            <textarea 
              rows={4} 
              className="w-full border border-slate-200 rounded-lg p-3 mb-4 outline-none focus:ring-2 focus:ring-red-500/20" 
              placeholder="Reason..." 
              value={showLeaderRejectModal ? leaderRejectReason : rejectReason} 
              onChange={(e) => showLeaderRejectModal ? setLeaderRejectReason(e.target.value) : setRejectReason(e.target.value)} 
            />
            <div className="flex gap-2">
              <button onClick={() => {setShowRejectModal(false); setShowLeaderRejectModal(false)}} className="flex-1 py-2 border rounded-lg font-semibold">Cancel</button>
              <button onClick={showLeaderRejectModal ? handleLeaderReject : handleAdminReject} className="flex-1 py-2 bg-red-600 text-white rounded-lg font-semibold">Reject</button>
            </div>
          </div>
        </div>
      )}

      
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-bold text-lg">Delete Content</h3>
            <p className="my-4 text-slate-600">Are you sure you want to delete this content?</p>
            <div className="flex gap-2">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2 border rounded-lg font-semibold">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2 bg-red-600 text-white rounded-lg font-semibold">Delete</button>
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
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
    <div className="text-slate-700 font-medium">{value}</div>
  </div>
);

export default ContentDetailsPage;