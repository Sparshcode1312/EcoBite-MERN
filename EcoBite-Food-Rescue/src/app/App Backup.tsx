import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MapPin, Bell, Search, Star, Clock, ShoppingBag, Leaf,
  TrendingUp, Users, BarChart2, Package, Settings, LogOut,
  Plus, Check, AlertTriangle, Home, Heart, History, User,
  Menu, Upload, Zap, Shield, DollarSign, ChevronDown,
  MessageSquare, Award, CheckCircle, ChevronRight, Globe,
  Utensils, X,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// ─────────────────────────── Types ───────────────────────────── //
type Screen = "landing" | "login" | "role-select" | "consumer" | "food-details" | "vendor" | "review";
type VendorTab = "dashboard" | "post-food" | "orders" | "analytics" | "reviews";
type RiskLevel = "low" | "medium" | "high";
type OrderStatus = "pending" | "accepted" | "ready" | "collected" | "cancelled";

interface Food {
  id: number;
  name: string;
  vendor: string;
  category: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  distance: string;
  pickupTime: string;
  risk: RiskLevel;
  trust: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  ingredients: string[];
  quantity: number;
}

// ─────────────────────────── Data ────────────────────────────── //
const FOODS: Food[] = [
  {
    id: 1, name: "Artisan Pastry Selection", vendor: "Flour & Stone Bakery", category: "Bakery",
    originalPrice: 22, discountedPrice: 8, discount: 64, distance: "0.3 km", pickupTime: "7:00–8:30 PM",
    risk: "low", trust: 96, rating: 4.8, reviews: 124,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&h=340&fit=crop&auto=format",
    description: "A curated selection of croissants, pain au chocolat, and seasonal danish pastries — all baked this morning and at peak freshness.",
    ingredients: ["Butter", "Flour", "Eggs", "Sugar", "Yeast", "Dark Chocolate", "Cream"],
    quantity: 4,
  },
  {
    id: 2, name: "Premium Sushi Platter", vendor: "Sakura Japanese Kitchen", category: "Japanese",
    originalPrice: 36, discountedPrice: 15, discount: 58, distance: "0.7 km", pickupTime: "8:30–9:30 PM",
    risk: "medium", trust: 88, rating: 4.6, reviews: 89,
    image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&h=340&fit=crop&auto=format",
    description: "Chef's selection of nigiri, maki rolls, and sashimi prepared with imported fish and premium Japanese rice.",
    ingredients: ["Salmon", "Tuna", "Rice", "Nori", "Wasabi", "Soy Sauce", "Avocado"],
    quantity: 2,
  },
  {
    id: 3, name: "Stone-baked Margherita Pizza", vendor: "La Piazza Italiana", category: "Italian",
    originalPrice: 20, discountedPrice: 7, discount: 65, distance: "1.1 km", pickupTime: "9:00–10:00 PM",
    risk: "low", trust: 94, rating: 4.7, reviews: 203,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=340&fit=crop&auto=format",
    description: "Classic Neapolitan pizza on house-made sourdough base with San Marzano tomatoes and fresh mozzarella di bufala.",
    ingredients: ["Sourdough Base", "San Marzano Tomatoes", "Buffalo Mozzarella", "Basil", "Olive Oil"],
    quantity: 3,
  },
  {
    id: 4, name: "Thai Green Curry Set", vendor: "Bangkok Bites", category: "Thai",
    originalPrice: 24, discountedPrice: 10, discount: 58, distance: "1.4 km", pickupTime: "8:00–9:00 PM",
    risk: "low", trust: 91, rating: 4.5, reviews: 167,
    image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=500&h=340&fit=crop&auto=format",
    description: "Authentic Thai green curry with jasmine rice, seasonal vegetables, and house-ground curry paste made from scratch daily.",
    ingredients: ["Green Curry Paste", "Coconut Milk", "Jasmine Rice", "Thai Basil", "Kaffir Lime", "Lemongrass"],
    quantity: 5,
  },
  {
    id: 5, name: "Harvest Grain Salad Bowl", vendor: "Green Garden Café", category: "Healthy",
    originalPrice: 18, discountedPrice: 6, discount: 67, distance: "0.5 km", pickupTime: "6:30–7:30 PM",
    risk: "low", trust: 98, rating: 4.9, reviews: 312,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=340&fit=crop&auto=format",
    description: "Vibrant bowl with quinoa, roasted sweet potato, chickpeas, avocado, baby spinach, and a lemon-tahini dressing.",
    ingredients: ["Quinoa", "Sweet Potato", "Chickpeas", "Avocado", "Spinach", "Tahini", "Lemon"],
    quantity: 6,
  },
  {
    id: 6, name: "Triple-Layer Chocolate Cake", vendor: "Sweet Layers Patisserie", category: "Desserts",
    originalPrice: 48, discountedPrice: 18, discount: 63, distance: "2.0 km", pickupTime: "5:00–6:00 PM",
    risk: "low", trust: 93, rating: 4.8, reviews: 78,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=340&fit=crop&auto=format",
    description: "Indulgent three-layer chocolate sponge with dark ganache frosting and hand-crafted chocolate shards — a celebration masterpiece.",
    ingredients: ["70% Dark Chocolate", "Unsalted Butter", "Free-range Eggs", "Flour", "Double Cream", "Cocoa"],
    quantity: 1,
  },
];

const REVENUE_DATA = [
  { day: "Mon", revenue: 124, waste: 3.2 },
  { day: "Tue", revenue: 188, waste: 5.0 },
  { day: "Wed", revenue: 152, waste: 4.1 },
  { day: "Thu", revenue: 276, waste: 7.4 },
  { day: "Fri", revenue: 318, waste: 8.5 },
  { day: "Sat", revenue: 412, waste: 11.0 },
  { day: "Sun", revenue: 384, waste: 10.3 },
];

const CATEGORY_DATA = [
  { name: "Bakery", value: 35, color: "#22C55E" },
  { name: "Hot Meals", value: 28, color: "#F97316" },
  { name: "Desserts", value: 18, color: "#3B82F6" },
  { name: "Drinks", value: 12, color: "#8B5CF6" },
  { name: "Salads", value: 7, color: "#EC4899" },
];

const ORDERS_DATA = [
  { id: "ORD-001", customer: "Sarah K.", food: "Artisan Pastry Selection", time: "7:15 PM", status: "ready" as OrderStatus, amount: 8 },
  { id: "ORD-002", customer: "James M.", food: "Sourdough Loaf Bundle", time: "7:30 PM", status: "accepted" as OrderStatus, amount: 6 },
  { id: "ORD-003", customer: "Priya R.", food: "Morning Croissant Box", time: "8:00 PM", status: "pending" as OrderStatus, amount: 9 },
  { id: "ORD-004", customer: "Chen L.", food: "Artisan Pastry Selection", time: "7:45 PM", status: "collected" as OrderStatus, amount: 8 },
  { id: "ORD-005", customer: "Maria S.", food: "Danish Pastry Pack", time: "8:30 PM", status: "cancelled" as OrderStatus, amount: 7 },
  { id: "ORD-006", customer: "Alex T.", food: "Morning Croissant Box", time: "7:00 PM", status: "collected" as OrderStatus, amount: 9 },
];

// ─────────────────────── Reusable Components ─────────────────── //
const RiskBadge = ({ level }: { level: RiskLevel }) => {
  const cfg = {
    low: { label: "Low Risk", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
    medium: { label: "Med Risk", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
    high: { label: "High Risk", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  }[level];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

const TrustScore = ({ score }: { score: number }) => {
  const color = score >= 90 ? "text-green-600 bg-green-50" : score >= 75 ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";
  return (
    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${color}`}>
      <Shield className="w-3 h-3" />
      <span className="text-xs font-bold">{score}</span>
    </div>
  );
};

const StatusChip = ({ status }: { status: OrderStatus }) => {
  const cfg = {
    pending: { label: "Pending", cls: "bg-amber-50 text-amber-700" },
    accepted: { label: "Accepted", cls: "bg-blue-50 text-blue-700" },
    ready: { label: "Ready", cls: "bg-green-50 text-green-700" },
    collected: { label: "Collected", cls: "bg-slate-100 text-slate-600" },
    cancelled: { label: "Cancelled", cls: "bg-red-50 text-red-600" },
  }[status];
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.cls}`}>{cfg.label}</span>;
};

const FoodCard = ({ food, onClick }: { food: Food; onClick: () => void }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group border border-slate-100"
  >
    <div className="relative overflow-hidden bg-green-50" style={{ aspectRatio: "4/3" }}>
      <img
        src={food.image}
        alt={food.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
        <h3 className="font-semibold text-slate-900 text-sm leading-snug flex-1 pr-2">{food.name}</h3>
        <TrustScore score={food.trust} />
      </div>
      <p className="text-xs text-slate-500 mb-3">{food.vendor}</p>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg font-bold text-slate-900">${food.discountedPrice}</span>
        <span className="text-xs text-slate-400 line-through">${food.originalPrice}</span>
        <div className="flex items-center gap-0.5 ml-auto">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-xs font-semibold text-slate-700">{food.rating}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{food.distance}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{food.pickupTime}</span>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors duration-150"
      >
        Reserve Now
      </button>
    </div>
  </div>
);

// ─────────────────────────── Landing Page ───────────────────────── //
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
            <button onClick={() => setScreen("role-select")} className="bg-green-500 hover:bg-green-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-sm shadow-green-200">Get Started</button>
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

// ─────────────────────────── Login Page ──────────────────────────── //
const LoginPage = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  const [isRegister, setIsRegister] = useState(false);
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
                <input type="text" placeholder="Your full name" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/25 focus:border-green-400 transition-colors" />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
              <input type="email" placeholder="you@example.com" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/25 focus:border-green-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
              <input type="password" placeholder="••••••••" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/25 focus:border-green-400 transition-colors" />
            </div>
          </div>
          {!isRegister && (
            <div className="text-right mt-2 mb-1">
              <button className="text-xs text-green-600 font-semibold hover:text-green-700">Forgot password?</button>
            </div>
          )}
          <button onClick={() => setScreen("role-select")} className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors shadow-sm shadow-green-200">
            {isRegister ? "Create Account" : "Sign In"}
          </button>
          <p className="text-center text-sm text-slate-500 mt-4">
            {isRegister ? "Already have an account? " : "Don't have an account? "}
            <button onClick={() => setIsRegister(!isRegister)} className="text-green-600 font-bold hover:text-green-700">{isRegister ? "Sign In" : "Create one"}</button>
          </p>
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

// ─────────────────────── Consumer Home ───────────────────────── //
const ConsumerHome = ({ setScreen, setSelectedFood }: { setScreen: (s: Screen) => void; setSelectedFood: (f: Food) => void }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const categories = ["All", "Bakery", "Japanese", "Italian", "Thai", "Healthy", "Desserts"];
  const filtered = FOODS.filter((f) => {
    const matchCat = activeCategory === "All" || f.category === activeCategory;
    const matchSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });
  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 flex items-center h-14 gap-3">
          <div className="flex items-center gap-1.5 mr-auto">
            <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-black text-slate-900 hidden sm:block">EcoBite</span>
          </div>
          <button className="flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
            <MapPin className="w-3 h-3 text-green-500" />
            <span className="hidden sm:block">San Francisco, CA</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          <button className="relative p-2 rounded-lg hover:bg-slate-50 transition-colors">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
          </button>
          <button onClick={() => setScreen("landing")} className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-black">ME</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-5">
        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search food, restaurants, cuisines..."
            className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/25 focus:border-green-400 shadow-sm transition-colors"
          />
        </div>

        {/* Hero Banner */}
        <div className="relative bg-gradient-to-r from-green-700 via-green-600 to-green-500 rounded-3xl p-6 mb-5 overflow-hidden">
          <div className="relative z-10">
            <p className="text-green-100 text-xs font-semibold mb-1 uppercase tracking-wider">Today's spotlight</p>
            <h3 className="text-white font-black text-xl leading-tight mb-3">Save up to 70% on<br />fresh surplus food</h3>
            <button onClick={() => { setSelectedFood(FOODS[0]); setScreen("food-details"); }} className="bg-white text-green-700 text-sm font-bold px-4 py-2 rounded-xl hover:bg-green-50 transition-colors">
              Explore Deals →
            </button>
          </div>
          <div className="absolute right-0 top-0 h-full w-48 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=160&fit=crop&auto=format" alt="" className="w-full h-full object-cover opacity-20" />
          </div>
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-white/10 rounded-full" />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-5" style={{ scrollbarWidth: "none" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-none px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${activeCategory === cat ? "bg-green-500 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:border-green-300"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-black text-slate-900 text-lg">
              {searchQuery ? `Results for "${searchQuery}"` : activeCategory === "All" ? "Nearby Deals" : activeCategory}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Pickup available today · {filtered.length} listings</p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No food found for "{searchQuery}"</p>
            <p className="text-sm mt-1">Try a different search term or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((food) => (
              <FoodCard key={food.id} food={food} onClick={() => { setSelectedFood(food); setScreen("food-details"); }} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex md:hidden z-40 safe-area-pb">
        {[
          { icon: Home, label: "Home", active: true },
          { icon: Search, label: "Explore", active: false },
          { icon: Heart, label: "Saved", active: false },
          { icon: History, label: "Orders", active: false },
          { icon: User, label: "Profile", active: false },
        ].map((item) => (
          <button key={item.label} className="flex-1 flex flex-col items-center py-2.5 gap-0.5">
            <item.icon className={`w-5 h-5 ${item.active ? "text-green-500" : "text-slate-400"}`} />
            <span className={`text-xs font-medium ${item.active ? "text-green-500" : "text-slate-400"}`}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────── Food Details ───────────────────────── //
const FoodDetails = ({ food, setScreen }: { food: Food; setScreen: (s: Screen) => void }) => (
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
            <span className="text-2xl font-black text-slate-900">${food.discountedPrice}</span>
            <span className="text-sm text-slate-400 line-through">${food.originalPrice}</span>
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
                  <RiskBadge level={food.risk} />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {food.risk === "low" && "AI assessment indicates minimal health risk. Prepared today, stored at safe temperature, and well within safe consumption window."}
                  {food.risk === "medium" && "Moderate risk detected. This item contains raw fish requiring careful temperature management. Consume immediately after pickup."}
                  {food.risk === "high" && "High risk detected. This item is near its safe consumption window. Exercise caution."}
                </p>
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
            <span className="font-black text-slate-900 text-xl">${food.discountedPrice}</span>
            <span className="text-sm text-slate-400 line-through">${food.originalPrice}</span>
          </div>
        </div>
        <button onClick={() => setScreen("review")} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl transition-colors shadow-lg shadow-green-200">
          Reserve This Food
        </button>
      </div>
    </div>
  </div>
);

// ─────────────────────── Vendor Layout ───────────────────────── //
const VendorDashboardTab = ({ setVendorTab }: { setVendorTab: (t: VendorTab) => void }) => (
  <div className="space-y-5">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: "Orders Today", value: "23", change: "+12%", icon: Package, color: "green" },
        { label: "Revenue", value: "$847", change: "+8%", icon: DollarSign, color: "blue" },
        { label: "Food Saved", value: "12.4 kg", change: "+23%", icon: Leaf, color: "green" },
        { label: "Trust Score", value: "96/100", change: "+2pts", icon: Shield, color: "orange" },
      ].map((s) => (
        <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-start justify-between mb-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color === "green" ? "bg-green-100" : s.color === "orange" ? "bg-orange-100" : "bg-blue-100"}`}>
              <s.icon className={`w-4 h-4 ${s.color === "green" ? "text-green-600" : s.color === "orange" ? "text-orange-600" : "text-blue-600"}`} />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{s.change}</span>
          </div>
          <p className="text-xl font-black text-slate-900">{s.value}</p>
          <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>

    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">Weekly Revenue Trend</h3>
          <span className="text-xs text-slate-400">This week</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={REVENUE_DATA}>
            <defs>
              <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: 12 }} />
            <Area type="monotone" dataKey="revenue" stroke="#22C55E" strokeWidth={2} fill="url(#rg)" name="Revenue ($)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-900 mb-4">Sales by Category</h3>
        <ResponsiveContainer width="100%" height={140}>
          <PieChart>
            <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={38} outerRadius={62} dataKey="value" paddingAngle={2}>
              {CATEGORY_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2 mt-2">
          {CATEGORY_DATA.map((c) => (
            <div key={c.name} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-none" style={{ backgroundColor: c.color }} />
              <span className="text-xs text-slate-600 flex-1">{c.name}</span>
              <span className="text-xs font-bold text-slate-900">{c.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="grid lg:grid-cols-2 gap-4">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-green-900">AI Insights</span>
          <span className="ml-auto text-xs text-green-600 font-semibold bg-green-100 px-2 py-0.5 rounded-full">Live</span>
        </div>
        <div className="space-y-3">
          {[
            { title: "Recommended Discount", value: "55% off", desc: "Increase discount on pastry boxes by 10% to clear remaining stock before 7 PM.", color: "orange" },
            { title: "Demand Forecast", value: "High tonight", desc: "Local event nearby predicts 40% higher demand 6–9 PM. Consider posting more items.", color: "blue" },
            { title: "Trust Score Update", value: "+2 points", desc: "3 new 5-star reviews this week. Maintain pickup punctuality to sustain growth.", color: "green" },
          ].map((ins) => (
            <div key={ins.title} className="bg-white rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-600">{ins.title}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ins.color === "green" ? "bg-green-100 text-green-700" : ins.color === "orange" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>{ins.value}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{ins.desc}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setVendorTab("post-food")} className="w-full mt-3 bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-2.5 rounded-xl transition-colors">
          + Post New Listing
        </button>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">Recent Orders</h3>
          <button className="text-xs text-green-600 font-semibold hover:text-green-700">View all →</button>
        </div>
        <div className="space-y-3">
          {ORDERS_DATA.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
              <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center text-xs font-black text-green-700 flex-none">{order.customer.charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{order.customer}</p>
                <p className="text-xs text-slate-500 truncate">{order.food}</p>
              </div>
              <div className="text-right flex-none">
                <StatusChip status={order.status} />
                <p className="text-xs text-slate-400 mt-1">{order.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const PostFoodTab = () => {
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("low");
  const [originalPrice, setOriginalPrice] = useState("18");
  const [suggestedPrice, setSuggestedPrice] = useState("7.56");
  const [analysed, setAnalysed] = useState(true);
  const origNum = parseFloat(originalPrice) || 18;
  const sugNum = parseFloat(suggestedPrice) || 7.56;
  const discPct = Math.round((1 - sugNum / origNum) * 100);

  const runAnalysis = () => {
    const price = (parseFloat(originalPrice) || 18) * 0.42;
    setSuggestedPrice(price.toFixed(2));
    setRiskLevel("low");
    setAnalysed(true);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
        <h3 className="font-bold text-slate-900">Listing Details</h3>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Food Name</label>
          <input type="text" defaultValue="Morning Croissant Box" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/25 focus:border-green-400 transition-colors" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
            <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/25 bg-white">
              <option>Bakery</option><option>Hot Meals</option><option>Desserts</option><option>Drinks</option><option>Salads</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Quantity</label>
            <input type="number" defaultValue={8} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/25" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Original Price ($)</label>
            <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/25" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Pickup Window</label>
            <input type="text" defaultValue="7:00–9:00 PM" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/25" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
          <textarea rows={3} defaultValue="Freshly baked assorted croissants and seasonal pastries from this morning's batch." className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/25 resize-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Food Photo</label>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-green-400 transition-colors cursor-pointer group">
            <Upload className="w-6 h-6 text-slate-400 group-hover:text-green-500 mx-auto mb-2 transition-colors" />
            <p className="text-sm text-slate-500">Drop image or <span className="text-green-600 font-semibold">browse files</span></p>
            <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
          </div>
        </div>
        <button onClick={runAnalysis} className="w-full border-2 border-green-500 text-green-600 font-bold py-2.5 rounded-xl hover:bg-green-50 transition-colors flex items-center justify-center gap-2">
          <Zap className="w-4 h-4" />Run AI Analysis
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-green-900">Live AI Analysis</span>
            <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${analysed ? "text-green-600 bg-green-100" : "text-slate-500 bg-slate-100"}`}>{analysed ? "Analysed" : "Pending"}</span>
          </div>

          <div className="bg-white rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-700 mb-2">Food Safety Risk Assessment</p>
            <div className="flex items-center gap-2 mb-2">
              <RiskBadge level={riskLevel} />
              <span className="text-xs text-slate-500">Based on category, time & vendor history</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">Baked goods stored at room temperature have low contamination risk within the same day. Your compliance history supports this rating.</p>
          </div>

          <div className="bg-white rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-700 mb-3">AI Suggested Selling Price</p>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-3xl font-black text-green-600">${suggestedPrice}</span>
              <span className="text-sm text-slate-400 line-through mb-1">${originalPrice}</span>
              <span className="text-sm font-black text-orange-500 mb-1">-{discPct}%</span>
            </div>
            <div className="space-y-1.5">
              {[
                { label: "Demand score", value: "High (8.2/10)" },
                { label: "Pickup window", value: "4h 30min remaining" },
                { label: "Sell-through probability", value: "94% at this price" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-xs">
                  <span className="text-slate-500">{row.label}</span>
                  <span className="font-semibold text-slate-700">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-700 mb-2">Trust Score Impact</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "96%" }} />
              </div>
              <span className="text-sm font-black text-green-600">96/100</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">This listing reinforces your trust score. Ensure item matches description at pickup.</p>
          </div>

          <div className="bg-green-500 rounded-xl p-4">
            <div className="flex gap-2">
              <Zap className="w-4 h-4 text-white flex-none mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white mb-1">AI Recommendation</p>
                <p className="text-xs text-green-100 leading-relaxed">"Reduce price by 15% to reach 94% sell-through probability. Evening pickup window (7–9 PM) aligns with peak local consumer demand."</p>
              </div>
            </div>
          </div>
        </div>

        <button className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-2xl transition-colors shadow-lg shadow-green-200 flex items-center justify-center gap-2">
          <Check className="w-5 h-5" />Publish Listing
        </button>
      </div>
    </div>
  );
};

const OrdersTab = () => {
  const [filter, setFilter] = useState("all");
  const statuses = ["all", "pending", "accepted", "ready", "collected", "cancelled"];
  const filtered = filter === "all" ? ORDERS_DATA : ORDERS_DATA.filter((o) => o.status === filter);
  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {statuses.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`flex-none px-3.5 py-1.5 rounded-xl text-sm font-semibold capitalize transition-all ${filter === s ? "bg-green-500 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:border-green-300"}`}>{s}</button>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Order</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Customer</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Food Item</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Pickup</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 text-xs font-mono text-slate-400">{order.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center text-xs font-black text-green-700">{order.customer.charAt(0)}</div>
                      <span className="text-sm font-semibold text-slate-900">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{order.food}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">{order.time}</td>
                  <td className="px-5 py-3.5"><StatusChip status={order.status} /></td>
                  <td className="px-5 py-3.5 text-sm font-black text-slate-900">${order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AnalyticsTab = () => (
  <div className="space-y-5">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: "Food Saved (Month)", value: "86.4 kg", sub: "= 173 meals prevented", color: "green" },
        { label: "Revenue Generated", value: "$5,284", sub: "+18% vs last month", color: "blue" },
        { label: "Avg Trust Score", value: "94.2", sub: "Top 8% of all vendors", color: "orange" },
        { label: "Customer Rating", value: "4.8 ★", sub: "Based on 312 reviews", color: "green" },
      ].map((m) => (
        <div key={m.label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <p className="text-2xl font-black text-slate-900 mb-0.5">{m.value}</p>
          <p className="text-xs text-slate-500 mb-1">{m.label}</p>
          <p className={`text-xs font-semibold ${m.color === "green" ? "text-green-600" : m.color === "orange" ? "text-orange-600" : "text-blue-600"}`}>{m.sub}</p>
        </div>
      ))}
    </div>
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900">Revenue & Food Waste Prevented</h3>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-green-500" /><span className="text-slate-500">Revenue ($)</span></div>
          <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-orange-400" /><span className="text-slate-500">Waste saved (kg)</span></div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={REVENUE_DATA}>
          <defs>
            <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.12} /><stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="ag2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F97316" stopOpacity={0.12} /><stop offset="95%" stopColor="#F97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: 12 }} />
          <Area type="monotone" dataKey="revenue" stroke="#22C55E" strokeWidth={2} fill="url(#ag1)" name="Revenue ($)" />
          <Area type="monotone" dataKey="waste" stroke="#F97316" strokeWidth={2} fill="url(#ag2)" name="Waste saved (kg)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-900 mb-4">Sales by Category</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={CATEGORY_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: 11 }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Share (%)">
              {CATEGORY_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-green-900">AI Recommendations</span>
        </div>
        <div className="space-y-3">
          {[
            { tag: "Timing", color: "green", tip: "Post pastry listings before 6 PM to capture 34% more customers in the evening demand window." },
            { tag: "Pricing", color: "orange", tip: "Desserts have the highest sell-through at 55–60% discount. You're at 63% — minor over-discounting detected." },
            { tag: "Service", color: "blue", tip: "Responding to orders within 5 minutes could raise your trust score by 2pts. Avg response is currently 8 min." },
          ].map((rec) => (
            <div key={rec.tag} className="bg-white rounded-xl p-3.5">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mb-2 ${rec.color === "green" ? "bg-green-100 text-green-700" : rec.color === "orange" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>{rec.tag}</span>
              <p className="text-xs text-slate-600 leading-relaxed">{rec.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ReviewsTab = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: "Overall Rating", value: "4.8 ★", sub: "out of 5.0" },
        { label: "Total Reviews", value: "312", sub: "this month" },
        { label: "Freshness Score", value: "4.7 / 5", sub: "avg. freshness" },
        { label: "Response Rate", value: "96%", sub: "within 24 hours" },
      ].map((s) => (
        <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
          <p className="text-xl font-black text-slate-900">{s.value}</p>
          <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          <p className="text-xs text-green-600 font-semibold mt-1">{s.sub}</p>
        </div>
      ))}
    </div>
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-5">
      {[
        { name: "Sarah K.", rating: 5, date: "2 days ago", food: "Artisan Pastry Selection", text: "Absolutely fresh and delicious! The croissants were perfectly flaky. Will definitely order again — this is a weekly staple now.", freshness: "Fresh" },
        { name: "James M.", rating: 5, date: "3 days ago", food: "Sourdough Bundle", text: "Great value, great quality. Love that I'm reducing food waste while saving money. The bread was as fresh as it gets.", freshness: "Fresh" },
        { name: "Priya R.", rating: 4, date: "5 days ago", food: "Morning Croissant Box", text: "Good quality overall. One pastry was slightly dry but the rest was excellent. Vendor was super friendly at pickup.", freshness: "Average" },
      ].map((review) => (
        <div key={review.name} className="border-b border-slate-50 pb-5 last:border-0 last:pb-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-sm font-black text-green-700">{review.name.charAt(0)}</div>
              <div>
                <p className="text-sm font-bold text-slate-900">{review.name}</p>
                <p className="text-xs text-slate-500">{review.food} · {review.date}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex gap-0.5 justify-end">
                {Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
              </div>
              <span className={`text-xs font-semibold ${review.freshness === "Fresh" ? "text-green-600" : "text-amber-600"}`}>{review.freshness}</span>
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed ml-11">{review.text}</p>
        </div>
      ))}
    </div>
  </div>
);

const VendorLayout = ({ vendorTab, setVendorTab, setScreen }: { vendorTab: VendorTab; setVendorTab: (t: VendorTab) => void; setScreen: (s: Screen) => void }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navItems: { tab: VendorTab; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
    { tab: "dashboard", icon: Home, label: "Dashboard" },
    { tab: "post-food", icon: Plus, label: "Post Food" },
    { tab: "orders", icon: Package, label: "Orders" },
    { tab: "analytics", icon: BarChart2, label: "Analytics" },
    { tab: "reviews", icon: MessageSquare, label: "Reviews" },
  ];

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-black text-slate-900 text-sm">EcoBite</p>
            <p className="text-xs text-slate-500">Vendor Portal</p>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-2.5">
          <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center text-orange-700 font-black text-sm">FS</div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">Flour & Stone</p>
            <p className="text-xs text-slate-500">Trust 96/100 · Bakery</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.tab}
            onClick={() => { setVendorTab(item.tab); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${vendorTab === item.tab ? "bg-green-500 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <item.icon className="w-4 h-4" />{item.label}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-slate-100 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
          <Settings className="w-4 h-4" />Settings
        </button>
        <button onClick={() => setScreen("landing")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
          <LogOut className="w-4 h-4" />Exit to Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-slate-100 flex-none">
        <Sidebar />
      </aside>
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-60 bg-white h-full shadow-2xl z-10">
            <Sidebar />
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3 flex-none">
          <button className="lg:hidden p-1.5 rounded-lg hover:bg-slate-50" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="font-bold text-slate-900 flex-1 capitalize">
            {vendorTab === "post-food" ? "Post Food Listing" : vendorTab === "analytics" ? "Analytics" : vendorTab}
          </h1>
          <button className="relative p-2 rounded-lg hover:bg-slate-50">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
          </button>
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-black">FS</div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {vendorTab === "dashboard" && <VendorDashboardTab setVendorTab={setVendorTab} />}
          {vendorTab === "post-food" && <PostFoodTab />}
          {vendorTab === "orders" && <OrdersTab />}
          {vendorTab === "analytics" && <AnalyticsTab />}
          {vendorTab === "reviews" && <ReviewsTab />}
        </main>
      </div>
    </div>
  );
};

// ─────────────────────── Review & Feedback ──────────────────── //
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

// ─────────────────────────── App Root ──────────────────────── //
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [screen, setScreen] = useState<Screen>("landing");
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [vendorTab, setVendorTab] = useState<VendorTab>("dashboard");
  useEffect(() => {
  if (location.pathname === "/") setScreen("landing");
  else if (location.pathname === "/login") setScreen("login");
  else if (location.pathname === "/select-role") setScreen("role-select");
  else if (location.pathname === "/consumer") setScreen("consumer");
  else if (location.pathname === "/vendor") setScreen("vendor");
  else if (location.pathname === "/review") setScreen("review");
  else if (location.pathname === "/food-details") setScreen("food-details");
}, [location.pathname]);

    const handleSetScreen = (s: Screen) => {
    window.scrollTo(0, 0);

    switch (s) {
      case "landing":
        navigate("/");
        break;
      case "login":
        navigate("/login");
        break;
      case "role-select":
        navigate("/select-role");
        break;
      case "consumer":
        navigate("/consumer");
        break;
      case "vendor":
        navigate("/vendor");
        break;
      case "review":
        navigate("/review");
        break;
      case "food-details":
        navigate("/food-details");
        break;
    }

    setScreen(s);
  };
    
    


  return (
    <div className="font-[Inter,sans-serif] antialiased">
      {screen === "landing" && <LandingPage setScreen={handleSetScreen} />}
      {screen === "login" && <LoginPage setScreen={handleSetScreen} />}
      {screen === "role-select" && <RoleSelect setScreen={handleSetScreen} setRole={() => {}} />}
      {screen === "consumer" && <ConsumerHome setScreen={handleSetScreen} setSelectedFood={setSelectedFood} />}
      {screen === "food-details" && selectedFood && <FoodDetails food={selectedFood} setScreen={handleSetScreen} />}
      {screen === "food-details" && !selectedFood && <ConsumerHome setScreen={handleSetScreen} setSelectedFood={setSelectedFood} />}
      {screen === "vendor" && <VendorLayout vendorTab={vendorTab} setVendorTab={setVendorTab} setScreen={handleSetScreen} />}
      {screen === "review" && <ReviewFeedback setScreen={handleSetScreen} />}
    </div>
  );
}
