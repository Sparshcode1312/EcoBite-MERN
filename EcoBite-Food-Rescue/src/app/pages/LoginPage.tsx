import type { Screen } from "../types";
import toast from "react-hot-toast";
import {
  Leaf,
  ShoppingBag,
  Utensils,
  Check,
} from "lucide-react";
import { useState } from "react";



const LoginPage = ({
  setScreen,
  defaultMode = "login",
}: {
  setScreen: (s: Screen) => void;
  defaultMode?: "login" | "register";
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"consumer" | "vendor">("consumer");
  const [isRegister, setIsRegister] = useState(defaultMode === "register");
  const [authLoading, setAuthLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setAuthLoading(true);

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        sessionStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        sessionStorage.setItem("user", JSON.stringify(data.user));

        setScreen(data.user.role === "vendor" ? "vendor" : "consumer");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setAuthLoading(true);

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        sessionStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        sessionStorage.setItem("user", JSON.stringify(data.user));

        setScreen(data.user.role === "vendor" ? "vendor" : "consumer");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-green-600 via-green-700 to-green-900 flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-white text-lg tracking-tight">EcoBite</span>
        </div>
        <div>
          <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=480&h=300&fit=crop&auto=format" alt="Fresh food market" className="w-full h-56 object-cover opacity-75" />
          </div>
          <blockquote className="text-3xl font-black text-white leading-snug mb-4">
            "We prevented 400 kg of food waste last month alone."
          </blockquote>
          <p className="text-green-200 font-medium">— Marco R., La Piazza Italiana</p>
        </div>
        <div className="flex gap-4">
          {[{ label: "Avg Savings", value: "65%" }, { label: "Vendors", value: "3,200+" }, { label: "Cities", value: "40+" }].map((s) => (
            <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 border border-white/10">
              <p className="text-xl font-black text-white">{s.value}</p>
              <p className="text-xs text-green-200">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-slate-900">EcoBite</span>
          </div>
          <div className="mb-7">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{isRegister ? "Create your account" : "Welcome back"}</h2>
            <p className="text-slate-500 text-sm mt-1">{isRegister ? "Start your journey toward zero food waste." : "Sign in to continue to EcoBite."}</p>
          </div>
          <button className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors mb-4">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>
          <div className="space-y-3">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
<input
  type="text"
  placeholder="Your full name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/25 focus:border-green-400 transition-colors"
/>
              </div>
            )}

            {isRegister && (
  <div>
    <label className="block text-xs font-semibold text-slate-700 mb-2">
      Select Role
    </label>

    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => setRole("consumer")}
        className={`py-3 rounded-xl border font-semibold transition-all ${
          role === "consumer"
            ? "bg-green-500 text-white border-green-500"
            : "bg-white text-slate-700 border-slate-200 hover:border-green-400"
        }`}
      >
        🛒 Consumer
      </button>

      <button
        type="button"
        onClick={() => setRole("vendor")}
        className={`py-3 rounded-xl border font-semibold transition-all ${
          role === "vendor"
            ? "bg-orange-500 text-white border-orange-500"
            : "bg-white text-slate-700 border-slate-200 hover:border-orange-400"
        }`}
      >
        🍴 Vendor
      </button>
    </div>
  </div>
)}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/25 focus:border-green-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/25 focus:border-green-400 transition-colors" />
            </div>
          </div>
          {!isRegister && (
            <div className="text-right mt-2 mb-1">
              <button className="text-xs text-green-600 font-semibold hover:text-green-700">Forgot password?</button>
            </div>
          )}
          <button
  disabled={authLoading}
  onClick={isRegister ? handleRegister : handleLogin}
  className="w-full mt-4 bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors shadow-sm shadow-green-200"
>
  {authLoading ? (
    <span className="flex items-center justify-center gap-2">
      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
      {isRegister ? "Creating account..." : "Signing in..."}
    </span>
  ) : (
    isRegister ? "Create Account" : "Sign In"
  )}
</button>
          {isRegister && (
  <p className="text-center text-sm text-slate-500 mt-4">
    Already have an account?{" "}
    <button
      onClick={() => {
        setIsRegister(false);
        setScreen("login");
      }}
      className="text-green-600 font-bold hover:text-green-700"
    >
      Sign In
    </button>
  </p>
)}
          <button onClick={() => setScreen("landing")} className="w-full mt-5 text-sm text-slate-400 hover:text-slate-600 transition-colors">← Back to home</button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────── Role Select ─────────────────────────── //
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
export default LoginPage;