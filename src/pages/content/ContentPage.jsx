import { useEffect, useState } from "react";
import { getAllContent, getMyContents } from "../../services/contentService";
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
import { useNavigate } from "react-router-dom";
import CreateContentModal from "../content/CreateContentModal";
import { ArrowLeft, Calendar, List } from "lucide-react";

const ContentPage = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileGridView, setIsMobileGridView] = useState(false);

  const calendarDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const currentMonthDaysOnly = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const role = localStorage.getItem("role");
      let response;

      if (role === "ADMIN") {
        response = await getAllContent();
      } else {
        response = await getMyContents();
      }

      const individualContent = (response.data || []).filter(
        (item) => item.team === "Individual"
      );

      setContents(individualContent);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 md:p-8 pt-4 text-[#063A3A] font-semibold">Loading...</div>;
  }

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

  return (
    <div className="w-full font-sans text-slate-800 p-2   min-h-screen bg-slate-50/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[#063A3A]/5 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-[#063A3A]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#063A3A] tracking-tight">Content Calendar</h1>
          </div>
        </div>

        {["INTERN", "TEAM_LEADER"].includes(localStorage.getItem("role")) && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#063A3A] hover:bg-[#0D7A80] text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition-all flex items-center gap-1.5 shadow-sm cursor-pointer self-start sm:self-auto"
          >
            <span className="text-lg font-light leading-none">+</span> Add Content
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="w-10 h-10 flex items-center justify-center bg-[#063A3A]/5 hover:bg-[#063A3A]/20 text-[#063A3A] rounded-xl transition-colors border border-slate-200/60 font-bold"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="w-10 h-10 flex items-center justify-center bg-[#063A3A]/5 hover:bg-[#063A3A]/20 text-[#063A3A] rounded-xl transition-colors border border-slate-200/60 font-bold"
          >
            →
          </button>
          <h2 className="text-xl font-bold text-[#063A3A]">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
        </div>

        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-3xs self-start sm:self-auto lg:hidden">
          <button
            onClick={() => setIsMobileGridView(false)}
            className={`p-2 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
              !isMobileGridView ? "bg-[#063A3A] text-white" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <List size={14} /> List
          </button>
          <button
            onClick={() => setIsMobileGridView(true)}
            className={`p-2 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
              isMobileGridView ? "bg-[#063A3A] text-white" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Calendar size={14} /> Grid
          </button>
        </div>
      </div>

      <div className={`hidden lg:block bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm`} style={{ borderLeft: '4px solid #0D7A80' }}>
        <div className="grid grid-cols-7 bg-[#063A3A]/40 border-b border-slate-200/80">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center py-3.5 font-bold text-[#063A3A] text-xs uppercase tracking-wider">
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
                onClick={() => navigate(`/content/date/${dateString}`)}
                className={`min-h-[140px] border-r border-b border-slate-200/70 p-2 cursor-pointer transition-colors hover:bg-[#063A3A]/[0.02] ${isSunday ? "bg-[#0D7A80]/10" : " bg-white"}`}
              >
                <div className="mb-2 flex justify-between items-start">
                  <span className={`flex items-center justify-center w-7 h-7 text-xs rounded-full transition-all font-semibold ${!isCurrentMonth ? "text-slate-300" : "text-slate-700"} ${isToday ? "bg-[#063A3A] text-white font-bold shadow-xs" : ""}`}>
                    {format(day, "d")}
                  </span>
                  {items.length > 3 && (
                    <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-md">+{items.length - 3} more</span>
                  )}
                </div>

                <div className="space-y-1 overflow-hidden">
                  {items.slice(0, 3).map((content) => (
                    <div key={content.id} className={`flex items-center justify-between gap-1 px-2 py-1 rounded-lg border transition-all shadow-3xs ${{ APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200/60", REJECTED: "bg-rose-50 text-rose-700 border-rose-200/60", PENDING: "bg-amber-50 text-amber-700 border-amber-200/60", PENDING_LEADER: "bg-orange-50 text-orange-700 border-orange-200/60" }[content.status] || "bg-slate-50 text-slate-700 border-slate-200"}`}>
                      <span className="text-[10px] font-semibold truncate flex-1">{content.title}</span>
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

      <div className="lg:hidden">
        {isMobileGridView ? (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs" style={{ borderLeft: '4px solid #063A3A' }}>
            <div className="grid grid-cols-7 bg-[#063A3A]/40 border-b border-slate-200">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                <div key={index} className="text-center py-2.5 font-bold text-[#063A3A] text-xs uppercase">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 bg-white">
              {calendarDays.map((day) => {
                const dateString = format(day, "yyyy-MM-dd");
                const isToday = dateString === today;
                const items = groupedContent[dateString] || [];
                const isCurrentMonth = isSameMonth(day, currentMonth);

                return (
                  <div
                    key={dateString}
                    onClick={() => navigate(`/content/date/${dateString}`)}
                    className={`min-h-[55px] border-r border-b border-slate-100 p-1 flex flex-col items-center justify-between text-center relative ${!isCurrentMonth ? "bg-slate-50/50 opacity-40" : ""}`}
                  >
                    <span className={`w-5 h-5 flex items-center justify-center text-[11px] rounded-full font-bold ${isToday ? "bg-[#063A3A] text-white" : "text-slate-700"}`}>
                      {format(day, "d")}
                    </span>
                    {items.length > 0 && (
                      <div className="flex gap-0.5 justify-center items-center mb-0.5">
                        {items.slice(0, 3).map((item, idx) => (
                          <div key={idx} className={`w-1.5 h-1.5 rounded-full ${{ APPROVED: "bg-emerald-500", REJECTED: "bg-rose-500", PENDING: "bg-amber-500", PENDING_LEADER: "bg-orange-500" }[item.status] || "bg-slate-400"}`} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {currentMonthDaysOnly.map((day) => {
              const dateString = format(day, "yyyy-MM-dd");
              const isToday = dateString === today;
              const items = groupedContent[dateString] || [];

              return (
                <div 
                  key={dateString}
                  onClick={() => navigate(`/content/date/${dateString}`)}
                  className={`bg-white p-4 rounded-xl border border-slate-200/70 shadow-3xs flex gap-4 items-start cursor-pointer hover:border-[#0D7A80]/40 transition-all ${
                    isToday ? "ring-2 ring-[#063A3A]/20 bg-[#063A3A]/[0.01]" : ""
                  }`}
                >
                  <div className="flex flex-col items-center justify-center text-center shrink-0 w-12 h-12 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">
                      {format(day, "eee")}
                    </span>
                    <span className={`text-base font-black tracking-tight ${isToday ? "text-[#063A3A]" : "text-slate-800"}`}>
                      {format(day, "dd")}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    {items.length === 0 ? (
                      <p className="text-xs font-medium text-slate-400/80 pt-3 italic">No tasks or pipelines scheduled</p>
                    ) : (
                      items.map((content) => (
                        <div 
                          key={content.id} 
                          className={`p-2.5 rounded-xl border border-l-[4px] shadow-3xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-slate-100 ${
                            {
                              APPROVED: "border-l-emerald-500 bg-emerald-50/20",
                              REJECTED: "border-l-rose-500 bg-rose-50/20",
                              PENDING: "border-l-amber-500 bg-amber-50/20",
                              PENDING_LEADER: "border-l-orange-500 bg-orange-50/20"
                            }[content.status] || "border-l-slate-400 bg-slate-50"
                          }`}
                        >
                          <span className="text-xs font-bold text-slate-800 truncate pr-2">{content.title}</span>
                          <div className="self-start sm:self-auto shrink-0 scale-90 origin-left sm:origin-right">
                            <StatusBadge status={content.status} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CreateContentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onRefresh={fetchContent}
      />

    </div>
  );
};

export default ContentPage;