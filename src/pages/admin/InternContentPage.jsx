import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllContent } from "../../services/contentService";
import StatusBadge from "../content/StatusBadge";
import { ArrowLeft } from "lucide-react";
import ContentDetailsPage from "../content/ContentDetailsPage";

const InternContentPage = () => {
  const { internId } = useParams();
  const navigate = useNavigate();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContentId, setSelectedContentId] = useState(null);
  const [internName, setInternName] = useState("Intern");

  useEffect(() => {
    fetchInternContent();
  }, [internId]);

  const fetchInternContent = async () => {
    try {
      setLoading(true);
      const response = await getAllContent();
      const data = response.data || [];
      
      const filtered = data.filter((item) => {
        return String(item.createdById) === String(internId);
      });

      const sorted = filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

      if (sorted.length > 0) {
        setInternName(sorted[0].createdBy);
      }
      
      setContents(sorted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full font-sans text-slate-800 p-2 min-h-screen bg-slate-50/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-[#063A3A]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#063A3A] tracking-tight">{internName}'s Content</h1>
            <p className="text-sm text-slate-500 mt-0.5">Content overview for this intern</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border-y border-r border-slate-200/80 border-l-[4px] border-l-[#0D7A80] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#063A3A]/40 text-[#063A3A] text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                <th className="py-4 px-6 text-center">Profile</th>
                <th className="py-4 px-6 text-center">Created By</th>
                <th className="py-4 px-6 text-center">Department</th>
                <th className="py-4 px-6 text-center">Scheduled Date</th>
                <th className="py-4 px-6 text-center">Title</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-center">Current Stage</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 text-slate-600 font-medium">
              {loading ? (
                <tr><td colSpan="8" className="p-8 text-center text-slate-400 font-semibold">Loading...</td></tr>
              ) : contents.length === 0 ? (
                <tr><td colSpan="8" className="p-8 text-center text-slate-500 font-medium">No content found for this intern.</td></tr>
              ) : (
                contents.map((content) => (
                  <tr key={content.id} className="hover:bg-[#0D7A80]/10 transition-colors">
                    <td className="py-4 px-6 text-center">
                      {content.profilePhotoUrl ? (
                        <img src={`http://localhost:8080/uploads/${content.profilePhotoUrl}`} alt={content.createdBy} className="w-10 h-10 rounded-full object-cover border mx-auto" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#063A3A]/5 text-[#063A3A] flex items-center justify-center font-semibold mx-auto">
                          {content.createdBy?.charAt(0) || 'U'}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">{content.createdBy || 'N/A'}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-[11px] text-[#0D7A80] bg-[#0D7A80]/5 px-2 py-1 rounded-md tracking-wider">
                        {content.department}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-slate-500 text-xs">{content.scheduledDate}</td>
                    <td className="py-4 px-6 text-slate-900 font-semibold text-center">{content.title}</td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center items-center">
                        <StatusBadge status={content.status} />
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-xs bg-[#0D7A80]/5 text-[#0D7A80] px-2.5 py-1 rounded-md font-semibold">
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
          onRefresh={fetchInternContent}
        />
      )}
    </div>
  );
};

export default InternContentPage;