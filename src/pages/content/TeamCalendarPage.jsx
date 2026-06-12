import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getContentByTeamId } from "../../services/contentService";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
} from "date-fns";
import StatusBadge from "../content/StatusBadge";
import TeamCreateContentModal from "./TeamCreateContentModal";
import { ArrowLeft } from "lucide-react";

const TeamCalendarPage = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const teamName = location.state?.teamName || "";

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  const calendarDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  useEffect(() => {
    fetchContent();
  }, [teamId]);

  const fetchContent = async () => {
    try {
      const response = await getContentByTeamId(teamId);
      setContents(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const groupByDate = (contents) => {
    const grouped = {};
    contents.forEach((item) => {
      const date = item.scheduledDate;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    });
    return grouped;
  };

  const groupedContent = groupByDate(contents);
  const today = format(new Date(), "yyyy-MM-dd");

  if (loading) {
    return <div className="p-8 text-[#063A3A] font-semibold">Loading...</div>;
  }

  return (
    <div className="w-full font-sans text-slate-800 p-2 min-h-screen bg-slate-50/50">
      
   
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-[#063A3A]" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-[#063A3A] tracking-tight">
              Team {teamName} Calendar
            </h1>
            <p className="text-sm text-slate-500">
              Manage scheduled team content
            </p>
          </div>
        </div>

        {["INTERN", "TEAM_LEADER"].includes(localStorage.getItem("role")) && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#063A3A] hover:bg-[#0D7A80] text-white font-semibold py-2 px-4 rounded-xl text-sm transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span className="text-lg font-light">+</span> Team Content
          </button>
        )}
      </div>

  
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="w-10 h-10 flex items-center justify-center bg-[#063A3A]/5 hover:bg-[#063A3A]/40 text-[#063A3A] rounded-full transition-colors border border-slate-200/60 font-bold"
        >
          ←
        </button>

        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="w-10 h-10 flex items-center justify-center bg-[#063A3A]/5 hover:bg-[#063A3A]/40 text-[#063A3A] rounded-full transition-colors border border-slate-200/60 font-bold"
        >
          →
        </button>

        <h2 className="text-xl font-bold text-[#063A3A]">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
      </div>

     
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
        
       
        <div className="grid grid-cols-7 bg-[#063A3A]/40  border-b border-slate-200/80">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center py-3.5 font-bold text-[#063A3A] text-xs uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        
        <div className="grid grid-cols-7 bg-slate-100">
          {calendarDays.map((day) => {
            const dateString = format(day, "yyyy-MM-dd");
            const isToday = dateString === today;
            const items = groupedContent[dateString] || [];
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSunday = day.getDay() === 0;

            return (
              <div
                key={dateString}
                onClick={() =>
                  navigate(`/team/${teamId}/date/${dateString}`, {
                    state: { teamName }
                  })
                }
                className={`
                  min-h-[140px]
                  border-r
                  border-b
                  border-slate-200/70
                  p-2
                  cursor-pointer
                  transition-colors
                  hover:bg-[#063A3A]/[0.02]
                  ${isSunday ? "bg-[#0D7A80]/10" : "bg-white"}
                `}
              >
             
                <div className="mb-2 flex justify-between items-start">
                  <span
                    className={`
                      flex
                      items-center
                      justify-center
                      w-7
                      h-7
                      text-xs
                      rounded-full
                      transition-all
                      font-semibold
                      ${!isCurrentMonth ? "text-slate-300" : "text-slate-700"}
                      ${isToday ? "bg-[#063A3A] text-white font-bold shadow-xs" : ""}
                    `}
                  >
                    {format(day, "d")}
                  </span>

                  {items.length > 3 && (
                    <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-md">
                      +{items.length - 3} more
                    </span>
                  )}
                </div>

                
                <div className="space-y-1 overflow-hidden">
                  {items.slice(0, 3).map((content) => (
                    <div
                      key={content.id}
                      className={`
                        flex
                        items-center
                        justify-between
                        gap-1
                        px-2
                        py-1
                        rounded-lg
                        border
                        transition-all
                        shadow-3xs
                        ${{
                          APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
                          REJECTED: "bg-rose-50 text-rose-700 border-rose-200/60",
                          PENDING: "bg-amber-50 text-amber-700 border-amber-200/60",
                          PENDING_LEADER: "bg-orange-50 text-orange-700 border-orange-200/60",
                        }[content.status] || "bg-slate-50 text-slate-700 border-slate-200"}
                      `}
                    >
                      <span className="text-[10px] font-semibold truncate flex-1">
                        {content.title}
                      </span>
                      <div className="flex-shrink-0 scale-75 origin-right">
                        <StatusBadge status={content.status} />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>
      </div>

     
      <TeamCreateContentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onRefresh={fetchContent}
        teamId={teamId}
        teamName={teamName}
      />
    </div>
  );
};

export default TeamCalendarPage;