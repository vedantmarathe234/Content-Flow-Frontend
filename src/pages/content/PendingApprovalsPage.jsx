import { useEffect, useState } from "react";
import { getPendingContent } from "../../services/contentService";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../content/StatusBadge";



const PendingApprovalsPage = () => {
  const [contents, setContents] = useState([]);
  const navigate = useNavigate();

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
    <div>
  <h1 className="text-3xl font-bold mb-6">
    Pending Approvals
  </h1>

  {contents.length === 0 ? (
    <div className="bg-white rounded-xl shadow p-8 text-center">
      No pending approvals 🎉
    </div>
  ) : (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50 border-b">
          <tr>
            <th className="text-left px-6 py-4">Title</th>
            <th className="text-left px-6 py-4">Created By</th>
            <th className="text-left px-6 py-4">Department</th>
            <th className="text-left px-6 py-4">Team</th>
            <th className="text-left px-6 py-4">Status</th>
            <th className="text-center px-6 py-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {contents.map((content) => (
            <tr
              key={content.id}
              className=" hover:bg-slate-50 transition"
            >
              <td className="px-6 py-4 font-medium">
                {content.title}
              </td>

              <td className="px-6 py-4">
                {content.createdBy}
              </td>

              <td className="px-6 py-4">
                {content.department}
              </td>

              <td className="px-6 py-4">
                {content.team || "Individual"}
              </td>

              <td className="px-6 py-4">
                <StatusBadge status={content.status} />
              </td>

              <td className="px-6 py-4 text-center">
                <button
                  onClick={() => navigate(`/content/view/${content.id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>
  );
};

export default PendingApprovalsPage;