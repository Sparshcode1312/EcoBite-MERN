import { Star, Clock, ShoppingBag, MapPin, Heart } from "lucide-react";
import type { Food } from "../types";
import RiskBadge from "./RiskBadge";
import TrustScore from "./TrustScore";

const FoodCard = ({
  food,
  onClick,
  isSaved,
  onToggleSave,
}: {
  food: Food;
  onClick: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
}) => (
  <div
    onClick={onClick}
    className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
  >
    <div className="relative overflow-hidden bg-green-50" style={{ aspectRatio: "4/3" }}>
    <button
  type="button"
  onClick={(e) => {
    e.stopPropagation();
    onToggleSave?.();
  }}
  className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center hover:scale-105 transition"
>
  <Heart
    className={`w-5 h-5 ${
      isSaved
        ? "fill-rose-500 text-rose-500"
        : "text-slate-500"
    }`}
  />
</button>
      <img
        src={food.image}
        alt={food.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      <div className="absolute top-3 left-3">
        <RiskBadge level={food.risk} />
      </div>
      <div className="absolute top-3 right-3">
        <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">-{food.discount}%</span>
      </div>
    </div>
    <div className="p-4">
      <div className="flex items-start justify-between mb-1">
  <h3 className="font-semibold text-slate-900 text-sm leading-snug flex-1 pr-2">
    {food.name}
  </h3>

  <div className="ml-2">
    <TrustScore score={food.trust} />
  </div>
</div>

<p className="text-xs text-slate-500">
  {food.vendor}
</p>

{food.aiAnalysis && (
  <p className="text-[11px] text-green-600 font-semibold mb-3">
    🤖 AI Verified • {food.aiAnalysis.confidence}% Confidence
  </p>
)}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg font-bold text-slate-900">₹{food.discountedPrice}</span>
        <span className="text-xs text-slate-400 line-through">₹{food.originalPrice}</span>
        <div className="flex items-center gap-0.5 ml-auto">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-xs font-semibold text-slate-700">{food.rating}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{food.distance}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{food.pickupTime}</span>
      </div>

      {food.quantity > 0 && (
  <div className="inline-flex items-center bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full text-xs font-semibold mb-3">
  🔥 Only {food.quantity} left
</div>
)}

      <button
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className="w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white text-sm font-bold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
      >
        Add to Cart
      </button>
    </div>
  </div>
);

export default FoodCard;