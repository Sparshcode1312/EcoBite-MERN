import TrustScore from "../components/TrustScore";
import RiskBadge from "../components/RiskBadge";
import toast from "react-hot-toast";
import type { Screen, Food, RiskLevel } from "../types";
import {
  ChevronRight,
  Star,
  MapPin,
  Clock,
  Package,
  Shield,
  Zap,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

type OrderStatus = "pending" | "accepted" | "ready" | "collected" | "cancelled";



const FoodDetails = ({
  food,
  setScreen,
  cartItems,
  setCartItems,
}: {
  food: Food;
  setScreen: (s: Screen) => void;
  cartItems: Food[];
  setCartItems: React.Dispatch<React.SetStateAction<Food[]>>;
}) => {
  const [reserveLoading, setReserveLoading] = useState(false);
const handleReserveFood = async () => {
  try {
    setReserveLoading(true);

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    const response = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        foodId: food._id,
        quantity: 1,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success("Food reserved successfully!");
    } else {
      toast.error(data.message || "Reservation failed");
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  } finally {
    setReserveLoading(false);
  }

};
const addToCart = () => {
  setCartItems((prev) => {
    const exists = prev.some((item) => item._id === food._id);

    if (exists) {
      alert("This item is already in your cart");
      return prev;
    }

    toast.success("Added to cart");
    return [...prev, { ...food, cartQty: 1 }];
  });

  setScreen("consumer");
};


    return (
  <div className="min-h-screen bg-slate-50">
    <div className="sticky top-0 z-40 bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3">
      <button onClick={() => setScreen("consumer")} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
        <ChevronRight className="w-5 h-5 text-slate-700 rotate-180" />
      </button>
      <span className="font-bold text-slate-900 truncate flex-1">{food.name}</span>
    </div>

    <div className="max-w-4xl mx-auto pb-28">
      {/* Hero */}
      <div className="relative h-64 sm:h-80 bg-green-100">
        <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <RiskBadge level={food.risk} />
          <span className="bg-orange-500 text-white text-sm font-black px-3 py-1.5 rounded-xl shadow">-{food.discount}%</span>
        </div>
      </div>

      <div className="px-4 sm:px-6">
        {/* Header Card */}
        <div className="bg-white rounded-2xl p-5 -mt-6 relative shadow-sm border border-slate-100 mb-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 pr-3">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">{food.name}</h1>
              <p className="text-sm text-slate-500">{food.vendor}</p>
            </div>
            <TrustScore score={food.trust} />
          </div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl font-black text-slate-900">₹{food.discountedPrice}</span>
            <span className="text-sm text-slate-400 line-through">₹{food.originalPrice}</span>
            <div className="flex items-center gap-0.5 ml-auto">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold">{food.rating}</span>
              <span className="text-xs text-slate-400">({food.reviews})</span>
            </div>
          </div>
          <div className="flex gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{food.distance}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{food.pickupTime}</span>
            <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5" />{food.quantity} left</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Left */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-2">About this food</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{food.description}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-3">Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {food.ingredients.map((ing) => (
                  <span key={ing} className="bg-slate-50 text-slate-600 text-xs px-3 py-1 rounded-full border border-slate-200">{ing}</span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-3">Pickup Window</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-none">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{food.pickupTime}</p>
                  <p className="text-xs text-slate-500">Arrive within the window to collect your order</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — AI Panel */}
          <div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-green-900">AI Safety Analysis</span>
                <span className="ml-auto text-xs text-green-600 font-semibold bg-green-100 px-2 py-0.5 rounded-full">Live</span>
              </div>

              <div className="bg-white rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">Food Safety Risk</span>
                  <RiskBadge level={food.aiAnalysis?.riskLevel || food.risk} />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {food.aiAnalysis?.riskLevel || food.risk === "low" && "AI assessment indicates minimal health risk. Prepared today, stored at safe temperature, and well within safe consumption window."}
                  {food.aiAnalysis?.riskLevel || food.risk === "medium" && "Moderate risk detected. This item contains raw fish requiring careful temperature management. Consume immediately after pickup."}
                  {food.aiAnalysis?.riskLevel || food.risk=== "high" && "High risk detected. This item is near its safe consumption window. Exercise caution."}
                </p>

                <div className="mt-4 border-t pt-3 space-y-2 text-sm">

  <div className="flex justify-between">
    <span>Freshness Score</span>
    <span className="font-semibold">
      {food.aiAnalysis?.freshnessScore ?? "--"}%
    </span>
  </div>

  <div className="flex justify-between">
    <span>Safe Consumption</span>
    <span className="font-semibold">
      {food.aiAnalysis?.safeHours ?? "--"} hrs
    </span>
  </div>

  <div className="flex justify-between">
    <span>AI Confidence</span>
    <span className="font-semibold">
      {food.aiAnalysis?.confidence ?? "--"}%
    </span>
  </div>

  <div className="flex justify-between">
    <span>Donation</span>
    <span className="font-semibold capitalize">
      {food.aiAnalysis?.donationSuitability ?? "--"}
    </span>
  </div>

</div>
              </div>

              <div className="bg-white rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-700">Vendor Trust Score</span>
                  <span className="text-2xl font-black text-green-600">{food.trust}<span className="text-xs font-semibold text-slate-400">/100</span></span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
                  <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${food.trust}%` }} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[{ label: "Completion", val: "98%" }, { label: "Freshness", val: "4.8★" }, { label: "Compliance", val: "A+" }].map((m) => (
                    <div key={m.label} className="text-center">
                      <p className="text-xs font-black text-slate-900">{m.val}</p>
                      <p className="text-xs text-slate-500">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-green-500 rounded-xl p-4">
                <div className="flex gap-2">
                  <CheckCircle className="w-4 h-4 text-white mt-0.5 flex-none" />
                  <p className="text-xs text-white leading-relaxed"><strong>AI Recommendation:</strong> This listing scores in the top 5% for safety and vendor reliability. Highly recommended for pickup today.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom CTA */}
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-4">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <div>
          <p className="text-xs text-slate-500">You pay</p>
          <div className="flex items-baseline gap-1.5">
            <span className="font-black text-slate-900 text-xl">₹{food.discountedPrice}</span>
            <span className="text-sm text-slate-400 line-through">₹{food.originalPrice}</span>
          </div>
        </div>
       <button
  type="button"
  disabled={reserveLoading}
  onClick={addToCart}
  className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl transition-colors shadow-lg shadow-green-200 flex items-center justify-center gap-2"
>
  {reserveLoading ? (
    <>
      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
      Reserving...
    </>
  ) : (
    "Add to Cart"
  )}
</button>
      </div>
    </div>
  </div>
 );
};
export default FoodDetails;