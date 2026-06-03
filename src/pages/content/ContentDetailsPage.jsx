import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getAllContent,
  leaderApprove,
  leaderReject
} from "../../services/contentService";
import StatusBadge from "./StatusBadge";
import { toast } from "react-hot-toast";
import API from "../../services/api";


const ContentDetailsPage = () => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const isTeamLeader =
  localStorage.getItem("isTeamLeader") === "true";

 

  useEffect(() => {
    fetchContent();
  }, []);

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
  role === "INTERN" &&
  isTeamLeader &&
  content.status === "PENDING_LEADER";

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
  try {
    await leaderReject(content.id);

    toast.success("Content rejected");

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
  try {
    await API.put(`/content/${id}/reject`, {
      reason: "Rejected by Admin",
    });

    toast.success("Content rejected");
    fetchContent();
  } catch (error) {
    toast.error("Failed to reject content");
  }
};



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
                    Team
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

              <button
                onClick={() => window.open(content.mediaUrl, "_blank")}
                className="
          mt-2
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
{/* <p>Role: {role}</p>
<p>isTeamLeader: {String(isTeamLeader)}</p>
<p>Status: {content.status}</p>
<p>showLeaderApproval: {String(showLeaderApproval)}</p>
<p>showAdminApproval: {String(showAdminApproval)}</p> */}
  {showLeaderApproval && (
    <div className="flex gap-2 mt-3">
     <button
  onClick={handleLeaderApprove}
  className="px-4 py-2 bg-green-600 text-white rounded-lg"
>
  Approve
</button>

      <button
  onClick={handleLeaderReject}
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
      onClick={handleAdminReject}
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
      </div>
    
  );
};

export default ContentDetailsPage;
