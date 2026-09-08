import { Shield } from "lucide-react";
const TrustScore = ({ score }: { score: number }) => {
  const color =
    score >= 90
      ? "text-green-600 bg-green-50"
      : score >= 75
      ? "text-amber-600 bg-amber-50"
      : "text-red-600 bg-red-50";

  return (
    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${color}`}>
      <Shield className="w-3 h-3" />
      <span className="text-xs font-bold">{score}</span>
    </div>
  );
};
export default TrustScore;