import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RoleSelect from "./pages/RoleSelect";
import ConsumerHome from "./pages/ConsumerHome";
import FoodDetails from "./pages/FoodDetails";
import ReviewFeedback from "./pages/ReviewFeedback";
import VendorLayout from "./pages/VendorLayout";
import { useState, useEffect } from "react";
import OrderSuccess from "./pages/OrderSuccess";
import ExplorePage from "./pages/ExplorePage";
import SavedPage from "./pages/SavedPage";
import ProfilePage from "./pages/ProfilePage";
import MyOrders from "./pages/MyOrders";
import CartPage from "./pages/CartPage";
import { Toaster } from "react-hot-toast";
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
type Screen =
  | "landing"
  | "login"
  | "register"
  | "role-select"
  | "consumer"
  | "cart"
  | "food-details"
  | "vendor"
  | "my-orders"
  | "explore"
| "saved"
| "profile"
  | "order-success"
  | "review";
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

// ─────────────────────────── App Root ──────────────────────── //
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [screen, setScreen] = useState<Screen>("landing");
  const [lastPayment, setLastPayment] = useState({
  amount: 0,
  paymentId: "",
});
const [foods, setFoods] = useState<Food[]>([]);
const [foodsLoading, setFoodsLoading] = useState(true);
const [savedFoods, setSavedFoods] = useState<Food[]>(() => {
  const storedSavedFoods = localStorage.getItem("savedFoods");

  return storedSavedFoods
    ? JSON.parse(storedSavedFoods)
    : [];
});
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [cartItems, setCartItems] = useState<Food[]>([]);
  const [vendorTab, setVendorTab] = useState<VendorTab>("dashboard");
  useEffect(() => {
  if (location.pathname === "/") setScreen("landing");
  else if (location.pathname === "/my-orders") {
  setScreen("my-orders");
}
else if (location.pathname === "/explore") {
  setScreen("explore");
}
else if (location.pathname === "/saved") {
  setScreen("saved");
}
else if (location.pathname === "/profile") {
  setScreen("profile");
}
  else if (location.pathname === "/cart") setScreen("cart");
  else if (location.pathname === "/register") setScreen("register");
  else if (location.pathname === "/login") setScreen("login");
  else if (location.pathname === "/select-role") setScreen("role-select");
  else if (location.pathname === "/consumer") setScreen("consumer");
  else if (location.pathname === "/order-success") {
  setScreen("order-success");
}
  else if (location.pathname === "/vendor") setScreen("vendor");
  else if (location.pathname === "/review") setScreen("review");
  else if (location.pathname === "/food-details") setScreen("food-details");
}, [location.pathname]);

    const handleSetScreen = (s: Screen) => {
    window.scrollTo(0, 0);

    switch (s) {
      case "explore":
  navigate("/explore");
  break;

case "saved":
  navigate("/saved");
  break;

case "profile":
  navigate("/profile");
  break;
      case "cart":
  navigate("/cart");
  break;
  case "order-success":
  navigate("/order-success");
  break;
  case "my-orders":
  navigate("/my-orders");
  break;
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
        case "register":
  navigate("/register");
  break;
    }

    setScreen(s);
  };

 const changeScreen = (screen: Screen) => {
  handleSetScreen(screen);
};

useEffect(() => {
  localStorage.setItem(
    "savedFoods",
    JSON.stringify(savedFoods)
  );
}, [savedFoods]);

useEffect(() => {
  const fetchFoods = async () => {
    try {
      setFoodsLoading(true);

      const response = await fetch("http://localhost:5000/api/foods");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch foods");
      }

      setFoods(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Food fetch error:", error);
      setFoods([]);
    } finally {
      setFoodsLoading(false);
    }
  };

  fetchFoods();
}, []);
    

  return (
   <>
    <Toaster
    position="top-right"
    toastOptions={{
      duration: 3000,
    }}
  />
   {screen === "explore" && (
  <ExplorePage
    foods={foods}
    setSelectedFood={setSelectedFood}
    setScreen={changeScreen}
  />
)}
{screen === "saved" && (
  <SavedPage
    savedFoods={savedFoods}
    setSavedFoods={setSavedFoods}
    setSelectedFood={setSelectedFood}
    setScreen={changeScreen}
  />
)}

{screen === "profile" && (
  <ProfilePage setScreen={changeScreen} />
)}

  {screen === "cart" && (
  <CartPage
    cartItems={cartItems}
    setCartItems={setCartItems}
    setScreen={changeScreen}
    setLastPayment={setLastPayment}
  />
)}

{screen === "my-orders" && (
  <MyOrders setScreen={changeScreen} />
)}

{screen === "order-success" && (
  <OrderSuccess
    setScreen={changeScreen}
    amount={lastPayment.amount}
    paymentId={lastPayment.paymentId}
  />
)}
    <div className="font-[Inter,sans-serif] antialiased">
      {screen === "landing" && <LandingPage setScreen={changeScreen} />}
     {screen === "login" && <LoginPage setScreen={changeScreen} defaultMode="login" />}
     {screen === "register" && <LoginPage setScreen={changeScreen} defaultMode="register" />}
      {screen === "role-select" && <RoleSelect setScreen={changeScreen} setRole={() => {}} />}
      {screen === "consumer" && <ConsumerHome
  setScreen={changeScreen}
  setSelectedFood={setSelectedFood}
  cartItems={cartItems}
  setCartItems={setCartItems}
  foods={foods}
  setFoods={setFoods}
  foodsLoading={foodsLoading}
  savedFoods={savedFoods}
    setSavedFoods={setSavedFoods}
/>
}
      {screen === "food-details" && selectedFood && <FoodDetails
  food={selectedFood}
  setScreen={changeScreen}
  cartItems={cartItems}
  setCartItems={setCartItems}
/>}
     {screen === "food-details" && !selectedFood && (
  <ConsumerHome
  setScreen={changeScreen}
  setSelectedFood={setSelectedFood}
  cartItems={cartItems}
  setCartItems={setCartItems}
  foods={foods}
  setFoods={setFoods}
  foodsLoading={foodsLoading}
  savedFoods={savedFoods}
    setSavedFoods={setSavedFoods}
/>
)}
      {screen === "vendor" && <VendorLayout vendorTab={vendorTab} setVendorTab={setVendorTab} setScreen={changeScreen} />}
      {screen === "review" && <ReviewFeedback setScreen={changeScreen} />}
    </div>
    </>
  );
}
