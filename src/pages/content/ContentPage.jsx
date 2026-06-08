import { useEffect, useState } from "react";
import { getAllContent } from "../../services/contentService";
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

const ContentPage = () => {
  const navigate = useNavigate();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [showCreateModal, setShowCreateModal] = useState(false);

  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(null);

const [showOverview, setShowOverview] = useState(false);


const calendarDays = eachDayOfInterval({
  start: startOfWeek(startOfMonth(currentMonth)),
  end: endOfWeek(endOfMonth(currentMonth)),
});


  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await getAllContent();
      setContents(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
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

const currentDate = new Date();

const monthDays = eachDayOfInterval({
  start: startOfMonth(currentDate),
  end: endOfMonth(currentDate),
});


const today = format(new Date(), "yyyy-MM-dd");


return (
  <div>


    

    <div className="flex justify-between items-center mb-6">

      <div>
        <h1 className="text-3xl font-bold">
          Content Calendar
        </h1>

        <p className="text-slate-500">
          Manage scheduled content
        </p>
      </div>

  {["INTERN", "TEAM_LEADER"].includes(
  localStorage.getItem("role")
) && (
  <button
    onClick={() => setShowCreateModal(true)}
    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
  >
    Add Content
  </button>
)}

    </div>
    <div className="flex items-center gap-3 mb-6">

  <button
    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
    className="w-10 h-10 rounded-lg border"
  >
    ←
  </button>

  <button
    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
    className="w-10 h-10 rounded-lg border"
  >
    →
  </button>

  <h2 className="text-2xl font-bold">
    {format(currentMonth, "MMMM yyyy")}
  </h2>

</div>

   <div
  className="
    bg-white
    rounded-2xl
    border
    border-[#D9E5F4]
    overflow-hidden
  "
>

      {/* Weekday Header */}

      <div className="grid grid-cols-7 bg-[#EEF5FF] border-b border-[#D9E5F4]">

        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (

        <div className="text-center py-3 font-semibold text-slate-700">
            {day}
          </div>

        ))}

      </div>
      

      {/* Calendar Grid */}

      <div className="grid grid-cols-7 bg-[#EEF5FF] border-b border-[#D9E5F4]">

        {calendarDays.map((day) => {
          

  const dateString = format(day, "yyyy-MM-dd");
  const isToday = dateString === today;
  const items = groupedContent[dateString] || [];
  const selectedContents =
  groupedContent[selectedDate] || [];

  const isCurrentMonth = isSameMonth(day, currentMonth);
  const isSunday = day.getDay() === 0;



  return (

    <div
      key={dateString} 
      onClick={() => {
  navigate(`/content/date/${dateString}`);
}}
      
 className={`
  min-h-[140px]
  border-r
  border-b
  border-[#D9E5F4]
  p-2
  cursor-pointer
  hover:bg-slate-50
  ${isSunday ? "bg-[#EEF5FF]" : "bg-white"}
 
  }}
`}
    >

<div
  className={`
    mb-2
    font-medium
    ${
      isCurrentMonth
        ? "text-slate-900"
        : "text-slate-400 opacity-60"
    }
  `}
>
  <span
  className={`
    flex
    items-center
    justify-center
    w-8
    h-8
    rounded-full
    transition-all
    ${
      isToday
        ? "bg-blue-600 text-white font-bold shadow-md"
        : ""
    }
  `}
>
    {format(day, "d")}
  </span>
</div>

{items.slice(0, 3).map((content) => (

  <div
  key={content.id}
  className={`
  flex
  items-center
  justify-between
  gap-1
  px-1.5
  py-1
  mb-1
  rounded-md
  text-white
  ${{
    APPROVED: "bg-green-500",
    REJECTED: "bg-red-500",
    PENDING: "bg-amber-500",
    PENDING_LEADER: "bg-orange-500",
  }[content.status] || "bg-slate-500"}
`}
>

    <span className="text-[11px] truncate flex-1 text-white1">
  {content.title}
</span>

    <StatusBadge status={content.status} />

  </div>

))}


    </div>
  );
})}


      </div>

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