import { useEffect, useState } from "react";
import { getPendingContent } from "../../services/contentService";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../content/StatusBadge";
import ContentDetailsPage from "./ContentDetailsPage"; 

const PendingApprovalsPage = () => {
  const [contents, setContents] = useState([]);
  const navigate = useNavigate();
  const [selectedContentId, setSelectedContentId] = useState(null);

  useEffect(() => {
    fetchPendingContent();
  }, []);

  const fetchPendingContent = async () => {
    try {
      const response = await getPendingContent();
      setContents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full font-sans text-slate-800">
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">
        Pending Approvals
      </h1>

      {contents.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
          No pending approvals 
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200">
                  <th className="py-3.5 px-6 text-center">Title</th>
                  <th className="py-3.5 px-6 text-center">Scheduled Date</th>
                  <th className="py-3.5 px-6 text-center">Created By</th>
                  <th className="py-3.5 px-6 text-center">Department</th>
                  <th className="py-3.5 px-6 text-center">Team</th>
                  <th className="py-3.5 px-6 text-center">Status</th>
                  <th className="py-3.5 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100 text-slate-600 font-medium text-center">
                {contents.map((content) => (
                  <tr
                    key={content.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-4 px-6 text-slate-900 font-semibold">{content.title}</td>
                    <td className="py-4 px-6">{content.scheduledDate}</td>
                    <td className="py-4 px-6">{content.createdBy}</td>
                    <td className="py-4 px-6">{content.department}</td>
                    <td className="py-4 px-6">{content.team || "Individual"}</td>
                    <td className="py-4 px-6 flex justify-center items-center">
                      <StatusBadge status={content.status} />
                    </td>
                    <td className="py-4 px-6 text-center">
                     <button
                     onClick={() => setSelectedContentId(content.id)} 
                     className="text-indigo-600 hover:text-indigo-800 transition-colors underline-offset-4 hover:underline"
                     >
                     View Details
                     </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    {selectedContentId && (
  <ContentDetailsPage
    id={selectedContentId}
    onClose={() => setSelectedContentId(null)}
    onRefresh={fetchPendingContent}
  />
)}
    </div>
  );
};
export default PendingApprovalsPage;