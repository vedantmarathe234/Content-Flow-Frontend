const StatusBadge = ({ status }) => {

  const colors = {
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    PENDING_LEADER: "bg-orange-100 text-orange-700",
  };

  return (
    <span
      className={`
        px-1.5
        py-0.5
        rounded-md
        text-[10px]
        font-medium
        whitespace-nowrap
        ${colors[status]}
      `}
    >
      {status === "PENDING_LEADER"
        ? "Pending"
        : status}
    </span>
  );
};

export default StatusBadge;