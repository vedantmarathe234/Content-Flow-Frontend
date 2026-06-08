import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllContent } from "../../services/contentService";
import StatusBadge from "./StatusBadge";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CreateContentModal from "./CreateContentModal";

const ContentDatePage = () => {
    const navigate = useNavigate();

  const { date } = useParams();

  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await getAllContent();

      const filtered = response.data.filter(
        item => item.scheduledDate === date
      );

      setContents(filtered);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const today = new Date().toISOString().split("T")[0];

const isPastDate = date < today;


const role = localStorage.getItem("role");

const canCreateContent =
  role === "INTERN" || role === "TEAM_LEADER";

  return (
    <div className="w-full font-sans text-slate-800">

      <div className="flex items-center justify-between mb-6">

  <div className="flex items-center gap-4">

    <button
      onClick={() => navigate(-1)}
      className="p-2 hover:bg-slate-100 rounded-full transition-colors"
    >
      <ArrowLeft size={20} />
    </button>

    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
      Content
    </h1>

  </div>

</div>

<p className="text-slate-500 mb-6">
  {date}
</p>


{canCreateContent && (
  <>
    {isPastDate && (
      <p className="text-red-500 mb-4">
        You cannot create content for past dates.
      </p>
    )}

    <div className="flex justify-between items-center mb-6">
      <button
        onClick={() => setShowCreateModal(true)}
        disabled={isPastDate}
        className={`
          px-4
          py-2
          rounded-lg
          text-white
          ${
            isPastDate
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }
        `}
      >
        + Create Content
      </button>
    </div>
  </>
)}

      {contents.length === 0 ? (

        <div className="bg-white rounded-xl p-8 text-center">
          No content scheduled
        </div>

      ) : (

     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {contents.map((content) => (
<div
  key={content.id}
  onClick={() =>
  navigate(`/content/view/${content.id}`)
}
  className="
    bg-white
    p-5
    rounded-xl
    border
    border-slate-200
    shadow-sm
    hover:shadow-md
    transition-shadow
    cursor-pointer
  "
>
<div className="flex justify-between items-start mb-4">

  <div>
    <h3 className="text-sm font-bold text-slate-900">
      {content.title}
    </h3>

    <p className="text-[11px] text-blue-600 font-medium uppercase mt-0.5">
      {content.contentType}
    </p>
  </div>

  <StatusBadge status={content.status} />

</div>

<div>

  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
    Description
  </p>

  <p className="text-xs text-slate-700">
    {content.description}
  </p>

  <div className="mt-4">

    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
      Scheduled Date
    </p>

    <span className="text-xs font-medium text-slate-700">
      {content.scheduledDate}
    </span>

  </div>

</div>

            </div>

          ))}

        </div>

      )}

      <CreateContentModal
  isOpen={showCreateModal}
  onClose={() => setShowCreateModal(false)}
  onRefresh={fetchContent}
  selectedDate={date}
/>

    </div>
  );
};

export default ContentDatePage;