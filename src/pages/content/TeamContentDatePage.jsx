import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getContentByTeamId } from "../../services/contentService";
import StatusBadge from "./StatusBadge";
import { ArrowLeft } from "lucide-react";
import TeamCreateContentModal from "./TeamCreateContentModal";
import ContentDetailsPage from "./ContentDetailsPage"; 

const TeamContentDatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { teamId, date } = useParams();
  const teamName = location.state?.teamName || "";

  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState(null);

  useEffect(() => {
    fetchContent();
  }, [teamId, date]);

  const fetchContent = async () => {
    try {
      const response = await getContentByTeamId(teamId);
      const filtered = (response.data || []).filter(
        (item) => item.scheduledDate === date
      );
      setContents(filtered);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const isPastDate = date < today;
  const role = localStorage.getItem("role");
  const canCreateContent = role === "INTERN" || role === "TEAM_LEADER";

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="w-full font-sans text-slate-800 ">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Team {teamName} Content
            </h1>
            <p className="text-slate-500 mt-0.5">{date}</p>
          </div>
        </div>

        {canCreateContent && (
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={isPastDate}
            className={`py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 shadow-sm ${
              isPastDate
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : "bg-[#4f46e5] hover:bg-indigo-700 text-white"
            }`}
          >
            + Team Content
          </button>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200">
                <th className="py-3.5 px-6 text-center">Title</th>
                <th className="py-3.5 px-6 text-center">Scheduled Date</th>
                <th className="py-3.5 px-6 text-center">Department</th>
                <th className="py-3.5 px-6 text-center">Created By</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-center">Current Stage</th>
                <th className="py-3.5 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 text-slate-600 font-medium text-center">
              {contents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">
                    No content scheduled for this date.
                  </td>
                </tr>
              ) : (
                contents.map((content) => (
                  <tr key={content.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 text-slate-900 font-semibold text-center">{content.title}</td>
                    <td className="py-4 px-6 text-center">{content.scheduledDate}</td>
                    <td className="py-4 px-6 text-center">{content.department}</td>
                    <td className="py-4 px-6 text-center">{content.createdBy}</td>
                    <td className="py-4 px-6 flex justify-center items-center">
                      <StatusBadge status={content.status} />
                    </td>
                    <td className="py-4 px-6 text-center">{content.currentStage}</td>
                    <td className="py-4 px-6 text-center">
                     
                      <button
                      onClick={() => setSelectedContentId(content.id)} 
                      className="text-indigo-600 hover:text-indigo-800 transition-colors underline-offset-4 hover:underline"
                      >
                      View Details
                     </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
       {selectedContentId && (
  <ContentDetailsPage 
    id={selectedContentId} 
    onClose={() => setSelectedContentId(null)} 
    onRefresh={fetchContent} 
  />
)}
      <TeamCreateContentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onRefresh={fetchContent}
        selectedDate={date}
        teamId={teamId}
        teamName={teamName}
      />
    </div>
  );
};

export default TeamContentDatePage;