import React, { useState, useEffect } from 'react';
import { getPendingContent } from "../../services/contentService";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../content/StatusBadge";
import ContentDetailsPage from "./ContentDetailsPage"; 
import { FiArrowLeft } from "react-icons/fi";

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
      const sortedData = response.data.sort((a, b) => b.id - a.id);
      setContents(sortedData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full font-sans p-2 text-slate-800 animate-in fade-in duration-300">
      
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-[#063A3A]/5 rounded-full transition-colors cursor-pointer text-[#063A3A]"
          title="Go Back"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-[#063A3A] tracking-tight">Pending Contents</h1>
      </div>

      {contents.length === 0 ? (
        <div className="bg-white p-6 rounded-2xl shadow-sm border-y border-r border-slate-200/80 border-l-[4px] border-l-[#0D7A80] flex items-center justify-center min-h-[120px]">
          <p className="text-slate-500 font-medium">
            No pending approvals available at the moment.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border-y border-r border-slate-200/80 overflow-hidden" style={{ borderLeft: '4px solid #0D7A80' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#063A3A]/40 text-[#063A3A] text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                  <th className="py-4 px-6 text-center">Title</th>
                  <th className="py-4 px-6 text-center">Scheduled Date</th>
                  <th className="py-4 px-6 text-center">Created By</th>
                  <th className="py-4 px-6 text-center">Department</th>
                  <th className="py-4 px-6 text-center">Uploaded By</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100 text-slate-600 font-medium text-center">
                {contents.map((content) => (
                  <tr
                    key={content.id}
                    className="hover:bg-[#0D7A80]/10 transition-colors duration-150"
                  >
                    <td className="py-4 px-6 text-slate-900 font-semibold text-left max-w-xs truncate">{content.title}</td>
                    <td className="py-4 px-6 text-slate-500">{content.scheduledDate || "N/A"}</td>
                    <td className="py-4 px-6">{content.createdBy}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-[11px] font-bold text-[#0D7A80] bg-[#0D7A80]/5 px-2 py-1 rounded-md tracking-wider">
                        {content.department}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">{content.team || "Individual"}</td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center items-center">
                        <StatusBadge status={content.status} />
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => setSelectedContentId(content.id)} 
                        className="text-[#0D7A80] hover:text-[#063A3A] font-bold transition-colors cursor-pointer text-xs uppercase tracking-wider underline-offset-4 hover:underline"
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