import type { Screen } from "../types";
import {
  Leaf,
  Store,
  ShoppingBag,
  Check,
  ChevronRight,
  Utensils,
} from "lucide-react";


const RoleSelect = ({ setScreen, setRole }: { setScreen: (s: Screen) => void; setRole: (r: "consumer" | "vendor") => void }) => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
    <div className="text-center mb-12">
      <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200">
        <Leaf className="w-6 h-6 text-white" />
      </div>
      <h2 className="text-3xl font-black text-slate-900 tracking-tight">How will you use EcoBite?</h2>
      <p className="text-slate-500 mt-2">Choose your role to get started. You can switch anytime.</p>
    </div>
    <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
      {[
        {
          role: "consumer" as const, icon: ShoppingBag, screen: "consumer" as Screen,
          title: "I'm a Consumer", subtitle: "Discover affordable food nearby", color: "green",
          desc: "Browse surplus food from local restaurants at up to 70% off, verified by AI safety assessment.",
          features: ["AI risk ratings on every listing", "Real-time deals near you", "Reserve in seconds", "Leave freshness reviews"],
        },
        {
          role: "vendor" as const, icon: Utensils, screen: "vendor" as Screen,
          title: "I'm a Vendor", subtitle: "Sell surplus food, reduce waste", color: "orange",
          desc: "List surplus food, get AI-powered pricing recommendations, and build your trust score.",
          features: ["Dynamic AI pricing engine", "Vendor Trust Score system", "Revenue & waste analytics", "Order management dashboard"],
        },
      ].map((opt) => (
        <button
          key={opt.role}
          onClick={() => { setRole(opt.role); setScreen(opt.screen); }}
          className="bg-white rounded-3xl p-8 border-2 border-transparent hover:border-green-400 shadow-sm hover:shadow-lg transition-all duration-200 text-left group"
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors ${opt.color === "green" ? "bg-green-100 group-hover:bg-green-500" : "bg-orange-100 group-hover:bg-orange-500"}`}>
            <opt.icon className={`w-7 h-7 transition-colors ${opt.color === "green" ? "text-green-600 group-hover:text-white" : "text-orange-600 group-hover:text-white"}`} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-1 tracking-tight">{opt.title}</h3>
          <p className={`text-sm font-bold mb-3 ${opt.color === "green" ? "text-green-600" : "text-orange-600"}`}>{opt.subtitle}</p>
          <p className="text-sm text-slate-500 leading-relaxed mb-5">{opt.desc}</p>
          <ul className="space-y-2">
            {opt.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-green-500 flex-none" />{f}
              </li>
            ))}
          </ul>
        </button>
      ))}
    </div>
    <button onClick={() => setScreen("landing")} className="mt-8 text-sm text-slate-400 hover:text-slate-600 transition-colors">← Back to home</button>
  </div>
);
export default RoleSelect;