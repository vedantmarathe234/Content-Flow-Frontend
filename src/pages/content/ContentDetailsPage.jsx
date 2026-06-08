import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getAllContent,
  leaderApprove,
  leaderReject,
  deleteContent
} from "../../services/contentService";
import StatusBadge from "./StatusBadge";
import { toast } from "react-hot-toast";
import API from "../../services/api";
import { markNotificationsByContent }
from "../../services/notificationService";



const ContentDetailsPage = () => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);
  const [showRejectModal, setShowRejectModal] =
  useState(false);

const [rejectReason, setRejectReason] =
  useState("");

  const [showLeaderRejectModal, setShowLeaderRejectModal] =
  useState(false);

const [leaderRejectReason, setLeaderRejectReason] =
  useState("");
  

  const [showDeleteModal, setShowDeleteModal] =
  useState(false);


  const { id } = useParams();
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
 const currentUserId =
  Number(localStorage.getItem("userId"));

 const canEdit =
  content?.createdById === currentUserId &&
  content?.status !== "APPROVED";
 
useEffect(() => {

  fetchContent();

  markNotificationsByContent(id)
    .then(() => {
      window.dispatchEvent(
        new Event("notificationsUpdated")
      );
    })
    .catch(console.error);

}, [id]);


  const fetchContent = async () => {
    try {
      const response = await getAllContent();

      const foundContent = response.data.find((item) => item.id === Number(id));

      setContent(foundContent);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!content) {
    return <div>Content not found</div>;
  }




 const showLeaderApproval =
  content.status === "PENDING_LEADER" &&
  content.teamLeaderId === currentUserId;

const showAdminApproval =
  role === "ADMIN" &&
  content.status === "PENDING";

  const handleLeaderApprove = async () => {
  try {
    await leaderApprove(content.id);

    toast.success("Approved Successfully");

    fetchContent();
  } catch (error) {
    console.log(error);
    console.log(error.response);

    toast.error("Failed to approve");
  }
};



const handleLeaderReject = async () => {

  if (!leaderRejectReason.trim()) {
    toast.error("Please enter rejection reason");
    return;
  }

  try {

    await API.put(
      `/content/${id}/leader-reject`,
      {
        reason: leaderRejectReason,
      }
    );

    toast.success("Content rejected");

    setShowLeaderRejectModal(false);
    setLeaderRejectReason("");

    fetchContent();

  } catch (error) {
    toast.error("Failed to reject");
  }
};

const handleAdminApprove = async () => {
  try {
    await API.put(`/content/${id}/approve`);
    toast.success("Content approved successfully");
    fetchContent();
  } catch (error) {
    toast.error("Failed to approve content");
  }
};

const handleAdminReject = async () => {

  if (!rejectReason.trim()) {
    toast.error("Please enter rejection reason");
    return;
  }

  try {

    await API.put(`/content/${id}/reject`, {
      reason: rejectReason,
    });

    toast.success("Content rejected");

    setShowRejectModal(false);
    setRejectReason("");

    fetchContent();

  } catch (error) {
    toast.error("Failed to reject content");
  }
};

const handleDelete = async () => {

  try {

    await deleteContent(id);

    toast.success(
      "Content deleted successfully"
    );

    navigate("/content");

  } catch (error) {


  toast.error(
    error.response?.data?.message ||
    "Failed to delete content"
  );
}
};

console.log("Status:", content.status);
console.log("Team Leader ID:", content.teamLeaderId);
console.log("Current User ID:", currentUserId);


  return (
    <div className="w-full font-sans text-slate-800">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 rounded-full"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-2xl font-bold">Content Details</h1>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-5">
          <div
            className="
            bg-white
            rounded-xl
            border
            border-slate-200
            shadow-sm
            p-6
            "
          >
            <h2 className="text-xl font-bold mb-4">{content.title}</h2>

            <div className="space-y-5">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">
                  Content ID
                </p>
                <p>{id}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">
                  Description
                </p>
                <p>{content.description}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">
                  Created By
                </p>
                <p>{content.createdBy}</p>
              </div>

              {content.team && (
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">
                    Uploaded by
                  </p>
                  <p>{content.team}</p>
                </div>
              )}

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">
                  Scheduled Date
                </p>
                <p>{content.scheduledDate}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">
                  Created At
                </p>

                <p>{new Date(content.createdAt).toLocaleString()}</p>
              </div>

              {content.rejectionReason && (
                <div>
                  <p className="text-xs font-bold text-red-400 uppercase">
                    Rejection Reason
                  </p>

                  <p className="text-red-600">{content.rejectionReason}</p>
                </div>
              )}

              <div className="flex gap-2 mt-2">

  <button
    onClick={() => window.open(content.mediaUrl, "_blank")}
    className="
      px-4
      py-2
      bg-blue-600
      text-white
      rounded-lg
      hover:bg-blue-700
    "
  >
    View Content
  </button>

  {canEdit && (
    <button
      onClick={() =>
        navigate(`/content/edit/${id}`)
      }
      className="
        px-4
        py-2
        bg-amber-500
        text-white
        rounded-lg
        hover:bg-amber-600
      "
    >
      Edit Content
    </button>
  )}

</div>


      
            </div>
          </div>
        </div>

        <div className="col-span-5">
          <div
            className="
      bg-white
      rounded-xl
      border
      border-slate-200
      shadow-sm
      p-6
    "
          >
            <h3 className="font-bold text-lg mb-4">Approval Workflow</h3>

            <div className="space-y-5">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">
                  Current Stage
                </p>

                <p>{content.currentStage}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">
                  Leader Approval
                </p>

                <p>{content.approvedByLeader}</p>
              </div>

              <div>
  <p className="text-xs font-bold text-slate-400 uppercase">
    Admin Approval
  </p>

  <p>{content.approvedByAdmin}</p>
</div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">
                  Department
                </p>

                <p>{content.department}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">
                  Status
                </p>
                <StatusBadge status={content.status} />
              </div>

              <div>
  <p className="text-xs font-bold text-slate-400 uppercase">
    Actions
  </p>

  <div className="mt-4">
  <button
    onClick={() =>
      setShowDeleteModal(true)
    }
    className="
      px-4
      py-2
      bg-red-600
      text-white
      rounded-lg
    "
  >
    Delete Content
  </button>
</div>

  {showLeaderApproval && (
    <div className="flex gap-2 mt-3">
     <button
  onClick={handleLeaderApprove}
  className="px-4 py-2 bg-green-600 text-white rounded-lg"
>
  Approve
</button>

   <button
  onClick={() => setShowLeaderRejectModal(true)}
  className="px-4 py-2 bg-red-600 text-white rounded-lg"
>
  Reject
</button>
    </div>
  )}
{showAdminApproval && (
  <div className="flex gap-2 mt-3">
    <button
      onClick={handleAdminApprove}
      className="px-4 py-2 bg-green-600 text-white rounded-lg"
    >
      Final Approve
    </button>

    <button
  onClick={() => setShowRejectModal(true)}
  className="px-4 py-2 bg-red-600 text-white rounded-lg"
>
  Reject
</button>
  </div>
)}
</div>
              </div>
            </div>
          </div>
        </div>

        {showRejectModal && (
  <div
    className="
    fixed
    inset-0
    bg-black/50
    flex
    items-center
    justify-center
    z-50
    "
  >
    <div
      className="
      bg-white
      rounded-xl
      p-6
      w-[500px]
      "
    >
      <h3 className="text-lg font-bold mb-4">
        Reject Content
      </h3>

      <textarea
        rows={5}
        placeholder="Enter rejection reason..."
        value={rejectReason}
        onChange={(e) =>
          setRejectReason(e.target.value)
        }
        className="
        w-full
        border
        rounded-lg
        p-3
        "
      />

      <div className="flex gap-3 mt-4">
        <button
          onClick={() =>
            setShowRejectModal(false)
          }
          className="
          flex-1
          border
          rounded-lg
          py-2
          "
        >
          Cancel
        </button>

        <button
          onClick={handleAdminReject}
          className="
          flex-1
          bg-red-600
          text-white
          rounded-lg
          py-2
          "
        >
          Reject
        </button>
      </div>
    </div>
  </div>
)}


{showLeaderRejectModal && (
  <div
    className="
    fixed inset-0
    bg-black/50
    flex items-center justify-center
    z-50
    "
  >
    <div
      className="
      bg-white
      rounded-xl
      p-6
      w-[500px]
      "
    >
      <h3 className="text-lg font-bold mb-4">
        Reject Content
      </h3>

      <textarea
        rows={5}
        value={leaderRejectReason}
        onChange={(e) =>
          setLeaderRejectReason(e.target.value)
        }
        placeholder="Enter rejection reason..."
        className="
        w-full
        border
        rounded-lg
        p-3
        "
      />

      <div className="flex gap-3 mt-4">
        <button
          onClick={() =>
            setShowLeaderRejectModal(false)
          }
          className="
          flex-1
          border
          rounded-lg
          py-2
          "
        >
          Cancel
        </button>

        <button
          onClick={handleLeaderReject}
          className="
          flex-1
          bg-red-600
          text-white
          rounded-lg
          py-2
          "
        >
          Reject
        </button>
      </div>
    </div>
  </div>
)}


{showDeleteModal && (
  <div
    className="
      fixed inset-0
      bg-black/50
      flex items-center
      justify-center
      z-50
    "
  >
    <div
      className="
        bg-white
        rounded-xl
        p-6
        w-[420px]
      "
    >
      <h3 className="text-lg font-bold">
        Delete Content
      </h3>

      <p className="mt-3 text-slate-600">
        Are you sure you want to delete this
        content?
      </p>

      <p className="text-red-600 mt-2">
        This action cannot be undone.
      </p>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() =>
            setShowDeleteModal(false)
          }
          className="
            flex-1
            border
            rounded-lg
            py-2
          "
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          className="
            flex-1
            bg-red-600
            text-white
            rounded-lg
            py-2
          "
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    
  );
};

export default ContentDetailsPage;
