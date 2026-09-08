import TrustScore from "../components/TrustScore";
import RiskBadge from "../components/RiskBadge";
import type { Screen, RiskLevel } from "../types";
import { useState } from "react";
import {
  Leaf,
  Menu,
  X,
  Zap,
  MapPin,
  ShoppingBag,
  Check,
  Award,
  Shield,
  Users,
  Globe,
  Search,
  CheckCircle,
  ChevronRight,
  TrendingUp,
  Star,
} from "lucide-react";

const LandingPage = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white font-[Inter,sans-serif]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16 gap-4">
          <div className="flex items-center gap-2 mr-auto">
            <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center shadow-sm">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">EcoBite</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["How It Works", "AI Features", "Impact", "For Vendors"].map((link) => (
              <a key={link} href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium">{link}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setScreen("login")} className="hidden sm:block text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors">Log in</button>
            <button onClick={() => setScreen("register")} className="bg-green-500 hover:bg-green-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-sm shadow-green-200">Get Started</button>
            <button className="md:hidden p-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 py-3 space-y-3">
            {["How It Works", "AI Features", "Impact", "For Vendors"].map((l) => (
              <a key={l} href="#" className="block text-sm font-medium text-slate-600 py-1">{l}</a>
            ))}
            <button onClick={() => setScreen("login")} className="block text-sm font-semibold text-green-600">Log in</button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-orange-50 pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #22C55E22 0%, transparent 60%), radial-gradient(circle at 80% 20%, #F9731622 0%, transparent 60%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full mb-6 border border-green-200">
                <Zap className="w-3 h-3" />
                AI-Powered Food Safety + Dynamic Pricing
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.08] tracking-tight mb-6">
                Save Food.<br />
                <span className="text-green-500">Save Money.</span><br />
                Save The Planet.
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
                EcoBite connects you with surplus food from local restaurants and cafes at up to 70% off — backed by AI safety assessment and verified vendor trust scores.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <button
                  onClick={() => setScreen("consumer")}
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-4 rounded-2xl transition-all shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-200 hover:-translate-y-0.5"
                >
                  <MapPin className="w-4 h-4" />
                  Find Food Near Me
                </button>
                <button
                  onClick={() => setScreen("vendor")}
                  className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold px-6 py-4 rounded-2xl border border-slate-200 transition-all hover:border-slate-300 hover:-translate-y-0.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Start Selling
                </button>
              </div>
              <div className="flex flex-wrap gap-5 text-sm text-slate-500">
                {[
                  { label: "AI Safety Verified", icon: Shield },
                  { label: "3,200+ Vendors", icon: ShoppingBag },
                  { label: "Zero Waste Mission", icon: Leaf },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
            {/* Hero visual */}
            <div className="hidden lg:block relative">
              <div className="relative">
                <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 p-4 border border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=480&h=260&fit=crop&auto=format"
                    alt="Artisan pastries"
                    className="w-full h-48 object-cover rounded-2xl"
                  />
                  <div className="mt-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-slate-900">Artisan Pastry Box</p>
                        <p className="text-xs text-slate-500">Flour & Stone Bakery · 0.3 km</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-900 text-lg">$8.00</p>
                        <p className="text-xs text-slate-400 line-through">$22.00</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <RiskBadge level="low" />
                      <span className="bg-slate-50 text-slate-600 text-xs font-medium px-2 py-0.5 rounded-full border border-slate-200">Trust 96/100</span>
                      <span className="ml-auto bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">-64%</span>
                    </div>
                    <div className="bg-green-500 text-white text-center text-sm font-bold py-3 rounded-xl">Reserve Now</div>
                  </div>
                </div>
                <div className="absolute -top-5 -right-5 bg-orange-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg">
                  48,000+ happy customers
                </div>
                <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 flex items-center gap-3">
                  <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">2.3M kg saved</p>
                    <p className="text-xs text-slate-400">food waste prevented</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-slate-900 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Food Saved", value: "2.3M kg", icon: Leaf },
              { label: "Happy Customers", value: "48,000+", icon: Users },
              { label: "Partner Vendors", value: "3,200+", icon: ShoppingBag },
              { label: "CO₂ Prevented", value: "4.1M kg", icon: Globe },
            ].map((s) => (
              <div key={s.label} className="group">
                <s.icon className="w-5 h-5 text-green-400 mx-auto mb-2" />
                <p className="text-3xl font-black text-white mb-1">{s.value}</p>
                <p className="text-sm text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-green-500 text-sm font-bold uppercase tracking-widest">Simple Process</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">How EcoBite Works</h2>
            <p className="text-slate-500 mt-4 max-w-md mx-auto">Three steps to save food, save money, and protect our planet.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: "01", icon: Search, title: "Browse Nearby Deals", desc: "Search surplus food from local restaurants and cafes — filtered by category, distance, and AI safety rating. New listings added daily.", color: "green" },
              { step: "02", icon: ShoppingBag, title: "Reserve in Seconds", desc: "Pick your deal, reserve it instantly, and receive a confirmation with pickup details and a unique QR order code.", color: "orange" },
              { step: "03", icon: CheckCircle, title: "Collect & Enjoy", desc: "Head to the vendor during the pickup window, scan your code, and enjoy quality food at a fraction of the original price.", color: "green" },
            ].map((step, i) => (
              <div key={step.step} className="relative group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${step.color === "green" ? "bg-green-100" : "bg-orange-100"}`}>
                  <step.icon className={`w-6 h-6 ${step.color === "green" ? "text-green-600" : "text-orange-600"}`} />
                </div>
                <span className="absolute top-0 right-0 text-6xl font-black text-slate-100 select-none leading-none">{step.step}</span>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                {i < 2 && (
                  <ChevronRight className="hidden md:block absolute top-5 -right-6 w-5 h-5 text-slate-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-green-500 text-sm font-bold uppercase tracking-widest">Powered by AI</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">Intelligence Built In</h2>
            <p className="text-slate-500 mt-4 max-w-md mx-auto">Every listing is backed by three layers of AI intelligence.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Food Safety AI", desc: "Real-time risk assessment analyzes food type, preparation time, storage conditions, and vendor history to assign a Low / Medium / High safety score to every listing.", badge: "Safety First", color: "green" },
              { icon: Award, title: "Vendor Trust Score", desc: "A 0–100 composite score built from order completion rate, customer reviews, freshness feedback, and compliance records. Updated in real time after every transaction.", badge: "Verified Quality", color: "blue" },
              { icon: TrendingUp, title: "Dynamic Pricing AI", desc: "Smart pricing engine analyzes demand signals, time-to-pickup, food category, and local trends to recommend optimal discounts that maximize sell-through probability.", badge: "Smart Pricing", color: "orange" },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center ${f.color === "green" ? "bg-green-100" : f.color === "orange" ? "bg-orange-100" : "bg-blue-100"}`}>
                  <f.icon className={`w-6 h-6 ${f.color === "green" ? "text-green-600" : f.color === "orange" ? "text-orange-600" : "text-blue-600"}`} />
                </div>
                <span className={`inline-flex text-xs font-bold px-2.5 py-1 rounded-full mb-3 ${f.color === "green" ? "bg-green-50 text-green-700" : f.color === "orange" ? "bg-orange-50 text-orange-700" : "bg-blue-50 text-blue-700"}`}>{f.badge}</span>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-green-500 text-sm font-bold uppercase tracking-widest">Community</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">People Love EcoBite</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Sarah K.", role: "Regular Customer", initials: "SK", text: "Found incredible sushi at 60% off last night. The AI safety rating gave me total confidence — it was absolutely fresh. I order 3–4 times a week now.", rating: 5 },
              { name: "James M.", role: "Bakery Owner, Flour & Stone", initials: "JM", text: "We used to throw out 30–40 items daily. With EcoBite, we sell everything. The AI pricing tool is surprisingly accurate — it doubled our sell-through rate in week one.", rating: 5 },
              { name: "Priya R.", role: "Food Blogger", initials: "PR", text: "The trust score system is what sets EcoBite apart. I can see exactly why a vendor scores the way they do. Transparent, smart, and genuinely life-changing for my food budget.", rating: 5 },
            ].map((t) => (
              <div key={t.name} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{t.initials}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-green-500 text-sm font-bold uppercase tracking-widest">Partners</span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">Featured Vendors</h2>
            </div>
            <button onClick={() => setScreen("consumer")} className="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center gap-1">View all <ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Flour & Stone Bakery", category: "Bakery", trust: 96, img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop&auto=format" },
              { name: "Sakura Japanese Kitchen", category: "Japanese", trust: 88, img: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=300&h=200&fit=crop&auto=format" },
              { name: "La Piazza Italiana", category: "Italian", trust: 94, img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop&auto=format" },
              { name: "Green Garden Café", category: "Healthy", trust: 98, img: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=300&h=200&fit=crop&auto=format" },
            ].map((v) => (
              <div key={v.name} onClick={() => setScreen("consumer")} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative bg-green-50 overflow-hidden" style={{ aspectRatio: "4/3" }}>
                  <img src={v.img} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-3">
                  <p className="font-semibold text-slate-900 text-sm truncate">{v.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-slate-500">{v.category}</span>
                    <TrustScore score={v.trust} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-500 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">Ready to eat smart and waste less?</h2>
          <p className="text-green-100 mb-8 text-lg">Join 48,000+ people already saving food and money every day.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => setScreen("consumer")} className="bg-white text-green-600 font-bold px-8 py-3.5 rounded-2xl hover:bg-green-50 transition-colors shadow-sm">Find Food Near Me</button>
            <button onClick={() => setScreen("vendor")} className="bg-green-600 border border-green-400 text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-green-700 transition-colors">Start Selling Surplus</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center">
                  <Leaf className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-black text-white">EcoBite</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">Eat Smart. Waste Less.<br />Making surplus food accessible to everyone.</p>
            </div>
            {[
              { title: "Product", links: ["How It Works", "AI Features", "Mobile App", "Pricing"] },
              { title: "Vendors", links: ["Start Selling", "Dashboard", "Analytics", "Support"] },
              { title: "Company", links: ["About Us", "Sustainability", "Blog", "Careers"] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-sm font-bold text-white mb-4">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-slate-500">© 2025 EcoBite Technologies. All rights reserved.</p>
            <p className="text-xs text-slate-500">Made with 💚 for the planet</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;