import type { RiskLevel } from "../types";

const RiskBadge = ({ level }: { level: RiskLevel }) => {
  const config = {
    low: {
      label: "Low Risk",
      bg: "bg-green-50",
      text: "text-green-700",
      dot: "bg-green-500",
    },
    medium: {
      label: "Medium Risk",
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      dot: "bg-yellow-500",
    },
    high: {
      label: "High Risk",
      bg: "bg-red-50",
      text: "text-red-700",
      dot: "bg-red-500",
    },
  };

  const cfg = config[level];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

export default RiskBadge;