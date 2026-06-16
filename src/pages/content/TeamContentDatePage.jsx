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
    return <div className="p-8 text-[#063A3A] font-semibold">Loading...</div>;
  }

  return (
    <div className="w-full font-sans text-slate-800 p-2 min-h-screen bg-slate-50/50">
      
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-[#063A3A]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#063A3A] tracking-tight">
              Team: {teamName} Content
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">{date}</p>
          </div>
        </div>

        {canCreateContent && (
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={isPastDate}
            className={`py-2 px-4 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
              isPastDate
                ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                : "bg-[#063A3A] hover:bg-[#0D7A80] text-white"
            }`}
          >
            <span className="text-lg font-light">+</span> Team Content
          </button>
        )}
      </div>

      {isPastDate && canCreateContent && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200/60 rounded-xl text-rose-700 text-xs font-semibold tracking-wide uppercase max-w-fit">
          ⚠️ You cannot create content for past dates.
        </div>
      )}

      
      <div className="bg-white rounded-2xl shadow-sm border-y border-r border-slate-200/80 border-l-[4px] border-l-[#0D7A80] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#063A3A]/40 text-[#063A3A] text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                <th className="py-4 px-6 text-center">Title</th>
                <th className="py-4 px-6 text-center">Scheduled Date</th>
                <th className="py-4 px-6 text-center">Department</th>
                <th className="py-4 px-6 text-center">Created By</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-center">Current Stage</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 text-slate-600 font-medium">
              {contents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500 font-medium">
                    No content scheduled for this date.
                  </td>
                </tr>
              ) : (
                contents.map((content) => (
                  <tr key={content.id} className="hover:bg-[#0D7A80]/10 transition-colors">
                    <td className="py-4 px-6 text-center">
                    <span className="text-xs font-bold text-[#0D7A80] bg-[#0D7A80]/5 px-2 py-1 rounded-md  tracking-wider">{content.title}</span></td>
                    <td className="py-4 px-6 text-center text-slate-500 text-xs">{content.scheduledDate}</td>
                    <td className="py-4 px-6 text-slate-900 font-semibold text-center">
                        {content.department}</td>
                    <td className="py-4 px-6 text-center">{content.createdBy}</td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center items-center">
                        <StatusBadge status={content.status} />
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-xs text-[#0D7A80] bg-[#0D7A80]/5 px-2.5 py-1 rounded-md font-semibold">
                        {content.currentStage}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => setSelectedContentId(content.id)} 
                        className="text-[#0D7A80] hover:text-[#063A3A] font-bold text-xs uppercase tracking-wider transition-colors underline-offset-4 hover:underline"
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