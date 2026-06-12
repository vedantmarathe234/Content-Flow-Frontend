const StatusBadge = ({ status }) => {

  const colors = {
    APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    REJECTED: "bg-rose-50 text-rose-700 border-rose-200/60",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200/60",
    PENDING_LEADER: "bg-orange-50 text-orange-700 border-orange-200/60",
  };

  const currentStyle = colors[status] || "bg-slate-50 text-slate-600 border-slate-200";

  const formattedStatus = status ? status.replace(/_/g, " ") : "";

  return (
    <span
      className={`
        px-2
        py-0.5
        border
        rounded-md
        text-[10px]
        font-bold
        uppercase
        tracking-wider
        whitespace-nowrap
        shadow-sm
        transition-all
        ${currentStyle}
      `}
    >
      {formattedStatus}
    </span>
  );
};

export default StatusBadge;