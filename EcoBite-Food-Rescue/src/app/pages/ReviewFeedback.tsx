import type { Screen } from "../types";
import { useState } from "react";
import {
  Leaf,
  Star,
  CheckCircle,
  MessageSquare,
  ChevronRight,
  
} from "lucide-react";

const ReviewFeedback = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  const [freshness, setFreshness] = useState("");
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Thanks for the feedback!</h2>
          <p className="text-slate-500 mb-6 leading-relaxed">Your review directly updates the vendor's AI Trust Score and helps the EcoBite community eat safer.</p>
          <div className="bg-green-50 rounded-2xl p-4 mb-6 border border-green-200">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-green-600 flex-none" />
              <p className="text-sm text-green-700 leading-relaxed">By collecting this food, you helped prevent <strong>0.8 kg</strong> of food waste and save <strong>2.1 kg</strong> of CO₂ emissions.</p>
            </div>
          </div>
          <button onClick={() => setScreen("consumer")} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl transition-colors">
            Find More Food →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setScreen("consumer")} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
          <ChevronRight className="w-5 h-5 text-slate-700 rotate-180" />
        </button>
        <span className="font-bold text-slate-900">Rate Your Experience</span>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-7 h-7 text-green-600" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">How was your food?</h2>
            <p className="text-slate-500 text-sm mt-1">Your feedback directly updates the vendor's AI trust score.</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="font-bold text-slate-900 mb-3">Was the food fresh?</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: "Fresh", emoji: "✅", color: "green" },
                { val: "Average", emoji: "😐", color: "amber" },
                { val: "Poor", emoji: "❌", color: "red" },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setFreshness(opt.val)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all duration-150 ${
                    freshness === opt.val
                      ? opt.color === "green" ? "border-green-500 bg-green-50" : opt.color === "amber" ? "border-amber-500 bg-amber-50" : "border-red-500 bg-red-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="text-xs font-semibold text-slate-700">{opt.val}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="font-bold text-slate-900 mb-3">Overall rating</p>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} className="transition-transform hover:scale-110 active:scale-95">
                  <Star className={`w-9 h-9 transition-colors ${star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-xs text-slate-500 mt-2">
                {["", "Poor experience", "Below average", "Decent", "Really good!", "Outstanding! 🎉"][rating]}
              </p>
            )}
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="font-bold text-slate-900 mb-1">Leave a comment <span className="text-slate-400 font-normal text-sm">(optional)</span></p>
            <p className="text-xs text-slate-500 mb-3">What did you love? Any suggestions for the vendor?</p>
            <textarea rows={3} placeholder="The croissants were incredibly flaky and fresh..." className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/25 focus:border-green-400 resize-none transition-colors" />
          </div>

          <button
            onClick={() => setSubmitted(true)}
            disabled={!freshness || !rating}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-3.5 rounded-2xl transition-colors shadow-sm shadow-green-200 disabled:shadow-none"
          >
            Submit Feedback
          </button>
          <p className="text-center text-xs text-slate-400">Your feedback is anonymous and helps improve AI safety scores.</p>
        </div>
      </div>
    </div>
  );
};
export default ReviewFeedback;
