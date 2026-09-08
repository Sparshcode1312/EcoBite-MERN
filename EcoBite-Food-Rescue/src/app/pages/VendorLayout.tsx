import RiskBadge from "../components/RiskBadge";
import { socket } from "../socket";
import toast from "react-hot-toast";
import type { Food } from "../types";
import type { Screen, VendorTab, RiskLevel, OrderStatus } from "../types";
import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import {
  Leaf,
  Bell,
  Search,
  Package,
  Settings,
  LogOut,
  Plus,
  BarChart2,
  Users,
  DollarSign,
  TrendingUp,
  Upload,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  MessageSquare,
  Shield,
  Zap,
  Check,
  Home,
  Menu,
  

} from "lucide-react";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface VendorStats {
  totalOrders: number;
  revenue: number;
  foodSaved: number;
  trustScore: number;
  pendingOrders: number;
  completedOrders: number;
  rejectedOrders: number;
}


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
  { id: "ORD-001", customer: "Sarah K.", food: "Artisan Pastry Selection", time: "7:15 PM", status: "completed" as OrderStatus, amount: 8 },
  { id: "ORD-002", customer: "James M.", food: "Sourdough Loaf Bundle", time: "7:30 PM", status: "accepted" as OrderStatus, amount: 6 },
  { id: "ORD-003", customer: "Priya R.", food: "Morning Croissant Box", time: "8:00 PM", status: "pending" as OrderStatus, amount: 9 },
  { id: "ORD-004", customer: "Chen L.", food: "Artisan Pastry Selection", time: "7:45 PM", status: "completed" as OrderStatus, amount: 8 },
  { id: "ORD-005", customer: "Maria S.", food: "Danish Pastry Pack", time: "8:30 PM", status: "rejected" as OrderStatus, amount: 7 },
  { id: "ORD-006", customer: "Alex T.", food: "Morning Croissant Box", time: "7:00 PM", status: "completed" as OrderStatus, amount: 9 },
];

const StatusChip = ({ status }: { status: OrderStatus }) => {
  const cfg: Record<
    OrderStatus,
    {
      label: string;
      cls: string;
    }
  > = {
    pending: {
      label: "Pending",
      cls: "bg-amber-50 text-amber-700",
    },

    accepted: {
      label: "Accepted",
      cls: "bg-blue-50 text-blue-700",
    },

    preparing: {
      label: "Preparing",
      cls: "bg-orange-50 text-orange-700",
    },

    ready: {
      label: "Ready",
      cls: "bg-cyan-50 text-cyan-700",
    },

    completed: {
      label: "Completed",
      cls: "bg-green-50 text-green-700",
    },

    rejected: {
      label: "Rejected",
      cls: "bg-red-50 text-red-600",
    },

    cancelled: {
      label: "Cancelled",
      cls: "bg-slate-100 text-slate-600",
    },
  };

  const currentStatus = cfg[status];

  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${currentStatus.cls}`}
    >
      {currentStatus.label}
    </span>
  );
};

const VendorDashboardTab = ({
  setVendorTab,
  vendorFoods,
  setVendorFoods,
  setEditingFood,
}: {
  setVendorTab: (t: VendorTab) => void;
  vendorFoods: Food[];
  setVendorFoods: React.Dispatch<React.SetStateAction<Food[]>>;
  setEditingFood: React.Dispatch<React.SetStateAction<Food | null>>;
}) => { const [stats, setStats] = useState<VendorStats>({
  totalOrders: 0,
  revenue: 0,
  foodSaved: 0,
  trustScore: 100,
  pendingOrders: 0,
  completedOrders: 0,
  rejectedOrders: 0,
});

const [statsLoading, setStatsLoading] = useState(true);
const [statsError, setStatsError] = useState("");
  const [weeklyStats, setWeeklyStats] = useState<any[]>([]);
  const [categoryStats, setCategoryStats] = useState<any[]>([]);
 
   const CATEGORY_COLORS = ["#22C55E", "#F97316", "#3B82F6", "#8B5CF6", "#EC4899"];
   const handleDeleteFood = async (id: string) => {
  
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:5000/api/foods/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    setVendorFoods((prev) =>
  prev.filter((food) => food._id !== id)
);
    toast.success("Food deleted successfully");
    window.location.reload();
  } else {
    const data = await response.json();
    toast.error(data.message || "Delete failed");
  }
};


  const fetchStats = async () => {
    const token = localStorage.getItem("token");

    const weeklyResponse = await fetch("http://localhost:5000/api/vendor/weekly-stats", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const weeklyData = await weeklyResponse.json();
setWeeklyStats(weeklyData);

    const response = await fetch("http://localhost:5000/api/vendor/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const categoryResponse = await fetch(
  "http://localhost:5000/api/vendor/category-stats",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

const categoryData = await categoryResponse.json();
setCategoryStats(Array.isArray(categoryData) ? categoryData : []);
  };

useEffect(() => {
  fetchStats();
}, []);

useEffect(() => {
  const fetchVendorStats = async () => {
    try {
      setStatsLoading(true);
      setStatsError("");

      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/vendor/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load dashboard statistics"
        );
      }

      setStats({
        totalOrders: Number(data.totalOrders) || 0,
        revenue: Number(data.revenue) || 0,
        foodSaved: Number(data.foodSaved) || 0,
        trustScore: Number(data.trustScore) || 0,
        pendingOrders: Number(data.pendingOrders) || 0,
        completedOrders: Number(data.completedOrders) || 0,
        rejectedOrders: Number(data.rejectedOrders) || 0,
      });
    } catch (error) {
      console.error("Vendor stats error:", error);

      setStatsError(
        error instanceof Error
          ? error.message
          : "Unable to load dashboard"
      );
    } finally {
      setStatsLoading(false);
    }
  };

  fetchVendorStats();
}, []);

return (

  <div className="space-y-5">
    <p className="text-sm text-slate-500">
  My Listings: {vendorFoods.length}
</p>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statsError && (
  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
    {statsError}
  </div>
)}
      {[
  {
    label: "Total Orders",
    value: statsLoading ? "..." : stats.totalOrders,
    change: `${stats.pendingOrders} pending`,
    icon: Package,
    color: "green",
  },
  {
    label: "Revenue",
    value: statsLoading
      ? "..."
      : `₹${stats.revenue.toLocaleString("en-IN")}`,
    change: "Paid orders",
    icon: DollarSign,
    color: "blue",
  },
  {
    label: "Food Saved",
    value: statsLoading ? "..." : stats.foodSaved,
    change: `${stats.completedOrders} completed`,
    icon: Leaf,
    color: "green",
  },
  {
    label: "Trust Score",
    value: statsLoading ? "..." : `${stats.trustScore}/100`,
    change: `${stats.rejectedOrders} rejected`,
    icon: Shield,
    color: "orange",
  },
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
          <AreaChart data={weeklyStats}>
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
            <Area type="monotone" dataKey="revenue" stroke="#22C55E" strokeWidth={2} fill="url(#rg)" name="Revenue (₹)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-900 mb-4">Sales by Category</h3>
        <ResponsiveContainer width="100%" height={140}>
          <PieChart>
            <Pie data={categoryStats} cx="50%" cy="50%" innerRadius={38} outerRadius={62} dataKey="value" paddingAngle={2}>
             {(Array.isArray(categoryStats) ? categoryStats : []).map((entry, i) => (
  <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2 mt-2">
          {(Array.isArray(categoryStats) ? categoryStats : []).map((c) => (
            <div key={c.name} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-none" style={{ backgroundColor: CATEGORY_COLORS[0] }} />
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
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
  <h2 className="text-lg font-bold text-slate-900 mb-3">My Listings</h2>

  {vendorFoods.length === 0 ? (
    <p className="text-sm text-slate-500">No listings found.</p>
  ) : (
    <div className="space-y-3">
      {(Array.isArray(vendorFoods) ? vendorFoods : []).map((food) => (
        <div key={food._id} className="border border-slate-100 rounded-xl p-3">
          <p className="font-bold text-slate-900">{food.name}</p>
          <p className="text-sm text-slate-500">{food.category}</p>
          <p className="text-sm font-semibold text-green-600">
            ₹{food.discountedPrice || food.originalPrice}
          </p>
          <button
  onClick={() => {
    setEditingFood(food);
    setVendorTab("post-food");
  }}
  className="mt-2 mr-3 text-xs font-bold text-blue-600 hover:text-blue-700"
>
  Edit
</button>
          <button
  onClick={() => handleDeleteFood(food._id!)}
  className="mt-2 text-xs font-bold text-red-600 hover:text-red-700"
>
  Delete
</button>
        </div>
      ))}
    </div>
  )}
</div>
  </div>
  
);
};



const PostFoodTab = ({
  editingFood,
  setEditingFood,
}: {
  editingFood: Food | null;
  setEditingFood: React.Dispatch<React.SetStateAction<Food | null>>;
}) => {
  const [foodName, setFoodName] = useState("");
  const [category, setCategory] = useState("Bakery");
   const [description, setDescription] = useState(
  "Freshly baked assorted croissants and seasonal pastries from this morning's batch."
);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("low");
  const [originalPrice, setOriginalPrice] = useState("18");
  const [suggestedPrice, setSuggestedPrice] = useState("7.56");
  const [quantity, setQuantity] = useState("8");
  const [analysed, setAnalysed] = useState(true);
  const [foodImage, setFoodImage] = useState<File | null>(null);
const [aiResult, setAiResult] = useState<any>(null);
const [aiLoading, setAiLoading] = useState(false);
const [publishLoading, setPublishLoading] = useState(false);
const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
  if (editingFood) {
    setFoodName(editingFood.name);
    setCategory(editingFood.category);
    setOriginalPrice(String(editingFood.originalPrice));
    setRiskLevel(editingFood.risk);
  }
}, [editingFood]);

  const origNum = parseFloat(originalPrice) || 18;
  const sugNum = parseFloat(suggestedPrice) || 7.56;
  const discPct = Math.round((1 - sugNum / origNum) * 100);

  const runAnalysis = async () => {
  if (!foodImage) {
    alert("Please upload a food image first");
    return;
  }

  try {
    setAiLoading(true);

    const formData = new FormData();
    formData.append("image", foodImage);
    formData.append("foodName", foodName);
    formData.append("category", category);
    formData.append("originalPrice", originalPrice);

    const response = await fetch("http://localhost:5000/api/ai/analyze-food", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message || "AI analysis failed");
      return;

    }

    
    setAiResult(data.analysis);

    if (data.analysis.imageUrl) {
  setImageUrl(data.analysis.imageUrl);
}
    if (data.analysis.detectedFood) {
  setFoodName(data.analysis.detectedFood);
}

if (data.analysis.category) {
  setCategory(data.analysis.category);
}

if (data.analysis.description) {
  setDescription(data.analysis.description);
}

setRiskLevel(data.analysis.riskLevel);
setSuggestedPrice(String(data.analysis.recommendedPrice));

setAnalysed(true);
    setRiskLevel(data.analysis.riskLevel);
    setSuggestedPrice(String(data.analysis.recommendedPrice));
    setAnalysed(true);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    toast.error("Something went wrong during AI analysis");
  } finally {
    setAiLoading(false);
  }
};

const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result as string);
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

  const handleAddFood = async () => {
  try {
    setPublishLoading(true);
    const response = await fetch(
      editingFood
  ? `http://localhost:5000/api/foods/${editingFood._id}`
  : "http://localhost:5000/api/foods",
      {
        method: editingFood ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
       body: JSON.stringify({
  name: foodName,
  category: category,
  originalPrice: Number(originalPrice),
  discountedPrice: Number(suggestedPrice),
  discount: discPct,
  description: description,
  risk: riskLevel,
  quantity: Number(quantity) || 1,
  image: imageUrl,
  aiAnalysis: aiResult
    ? {
        ...aiResult,
        analyzedAt: new Date(),
      }
    : null,
}),
      }
    );

    const data = await response.json();

    console.log("Food Added:", data);

    toast.success("Food Added Successfully!");
    setEditingFood(null);
  } catch (error) {
    console.error(error);
  }
  finally {
  setPublishLoading(false);
  }
};

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
        <h3 className="font-bold text-slate-900">Listing Details</h3>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Food Name</label>
          <input type="text" value= {foodName} onChange={(e) => setFoodName(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/25 focus:border-green-400 transition-colors" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/25 bg-white">
              <option>Bakery</option><option>Hot Meals</option><option>Desserts</option><option>Drinks</option><option>Salads</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Quantity</label>
            <input
  type="number"
  value={quantity}
  onChange={(e) => setQuantity(e.target.value)}
  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/25"
/>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Original Price (₹)</label>
            <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/25" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Pickup Window</label>
            <input type="text" defaultValue="7:00–9:00 PM" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/25" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
          <textarea
  rows={3}
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/25 resize-none"
/>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Food Photo</label>
         <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-green-400 transition-colors">

  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />

  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      if (e.target.files && e.target.files.length > 0) {
        setFoodImage(e.target.files[0]);
      }
    }}
    className="mb-3"
  />

  {foodImage && (
    <p className="text-green-600 text-sm font-semibold">
      Selected: {foodImage.name}
    </p>
  )}

  <p className="text-xs text-slate-400 mt-2">
    PNG, JPG, WEBP up to 10MB
  </p>

</div>
        </div>
        <button
  onClick={runAnalysis}
  disabled={aiLoading}
  className="w-full border-2 border-green-500 text-green-600 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
>
  {aiLoading ? (
    <>
      <span className="w-4 h-4 border-2 border-green-200 border-t-green-600 rounded-full animate-spin"></span>
      Analyzing food...
    </>
  ) : (
    <>
      <Zap className="w-4 h-4" />
      Run AI Analysis
    </>
  )}
</button>

        {aiResult && (
  <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">

    <h3 className="text-lg font-bold text-green-700 mb-4">
      🤖 AI Food Analysis
    </h3>

    <div className="grid grid-cols-2 gap-4 text-sm">

      <div>
        <strong>🍽 Food</strong>
        <p>{aiResult.detectedFood}</p>
      </div>

      <div>
        <strong>🌱 Freshness</strong>
        <p>{aiResult.freshnessScore}%</p>
      </div>

      <div>
        <strong>⚠ Risk</strong>
        <p>{aiResult.riskLevel}</p>
      </div>

      <div>
        <strong>⏰ Safe Hours</strong>
        <p>{aiResult.safeHours} Hours</p>
      </div>

      <div>
        <strong>💸 Suggested Price</strong>
        <p>₹{aiResult.recommendedPrice}</p>
      </div>

      <div>
        <strong>♻ Donation</strong>
        <p>{aiResult.donationSuitability}</p>
      </div>

      <div>
        <strong>🎯 Confidence</strong>
        <p>{aiResult.confidence}%</p>
      </div>

    </div>

    <div className="mt-5 rounded-xl bg-white p-4 border">
      <strong>📝 Recommendation</strong>
      <p className="mt-2 text-sm text-slate-600">
        {aiResult.recommendation}
      </p>
    </div>

  </div>
)}
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
              <span className="text-3xl font-black text-green-600">₹{suggestedPrice}</span>
              <span className="text-sm text-slate-400 line-through mb-1">₹{originalPrice}</span>
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

        <button
  onClick={handleAddFood}
  disabled={publishLoading}
  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
>
  {publishLoading ? (
    <>
      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
      Publishing...
    </>
  ) : (
    <>
      ✓ Publish Listing
    </>
  )}
</button>
      </div>
    </div>
  );
};

const OrdersTab = () => {
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState<any[]>([]);
  const socketRef = useRef<Socket | null>(null);
 

  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

   const statuses = [
    "all",
    "pending",
    "accepted",
    "preparing",
    "ready",
    "rejected",
    "completed",
    "cancelled",
  ];
 
  useEffect(() => {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  const savedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  const user = savedUser ? JSON.parse(savedUser) : null;

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/vendor/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to fetch vendor orders"
        );
      }

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching vendor orders:", error);
    }
  };

  // Load existing MongoDB orders when the tab opens
  fetchOrders();

  // Create one Socket.IO connection
  socketRef.current = io("http://localhost:5000");

  socketRef.current.on("connect", () => {
    console.log("Vendor socket connected:", socketRef.current?.id);

    if (user?.id) {
      socketRef.current?.emit("joinVendorRoom", user.id);
    }
  });

  socketRef.current.on("newOrder", (data) => {
    console.log("New paid order received:", data);

    alert(data.message || "New order received!");

    /*
     * Fetch again because the socket order may contain only MongoDB IDs,
     * while the API returns populated food and consumer information.
     */
    fetchOrders();
  });

  return () => {
    socketRef.current?.off("connect");
    socketRef.current?.off("newOrder");
    socketRef.current?.disconnect();
    socketRef.current = null;
  };
}, []);

 const filtered =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  const updateOrderStatus = async (
    orderId: string,
    status: OrderStatus
  ) => {
    // Your existing function remains here
  };


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
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">
  Action
</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Order</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Customer</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Food Item</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Pickup</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Amount</th>
              </tr>
            </thead>
            <tbody>
 {filtered.length === 0 ? (
  <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
    <p className="font-bold text-slate-900">
      No orders found
    </p>

    <p className="text-sm text-slate-500 mt-2">
      New customer orders will appear here.
    </p>
  </div>
) : (
    filtered.map((order) => (
      <tr key={order._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
        <td className="px-5 py-3.5">
          {order.status === "pending" && (
            <div className="flex flex-wrap gap-2">
  {order.status === "pending" && (
    <>
      <button
  type="button"
  disabled={updatingOrderId === order._id}
  onClick={() =>
    updateOrderStatus(order._id, "accepted")
  }
  className="px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
>
  {updatingOrderId === order._id
    ? "Updating..."
    : "Accept"}
</button>

     <button
  type="button"
  disabled={updatingOrderId === order._id}
  onClick={() =>
    updateOrderStatus(order._id, "rejected")
  }
  className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
>
  {updatingOrderId === order._id
    ? "Updating..."
    : "Reject"}
</button>
    </>
  )}

  {order.status === "accepted" && (
   <button
  type="button"
  disabled={updatingOrderId === order._id}
  onClick={() =>
    updateOrderStatus(order._id, "preparing")
  }
  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
>
  {updatingOrderId === order._id
    ? "Updating..."
    : "Start Preparing"}
</button>
  )}

  {order.status === "preparing" && (
   <button
  type="button"
  disabled={updatingOrderId === order._id}
  onClick={() =>
    updateOrderStatus(order._id, "ready")
  }
  className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
>
  {updatingOrderId === order._id
    ? "Updating..."
    : "Mark Ready"}
</button>
  )}

  {order.status === "ready" && (
    <button
  type="button"
  disabled={updatingOrderId === order._id}
  onClick={() =>
    updateOrderStatus(order._id, "completed")
  }
  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
>
  {updatingOrderId === order._id
    ? "Updating..."
    : "Complete Order"}
</button>
  )}

  {(order.status === "completed" ||
    order.status === "rejected" ||
    order.status === "cancelled") && (
    <span className="text-xs font-semibold text-slate-400">
      No actions available
    </span>
  )}
</div>
          )}

          {order.status === "accepted" && (
            <button
              onClick={() => updateOrderStatus(order._id, "completed")}
              className="px-3 py-1 rounded-lg bg-blue-500 text-white text-xs font-bold"
            >
              Mark Completed
            </button>
          )}
        </td>

        <td className="px-5 py-3.5 text-xs font-mono text-slate-400">
          {order._id}
        </td>

        <td className="px-5 py-3.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center text-xs font-black text-green-700">
              {order.consumerId?.name?.charAt(0) || "U"}
            </div>
            <span className="text-sm font-semibold text-slate-900">
              {order.consumerId?.name || "Unknown User"}
            </span>
          </div>
        </td>

        <td className="px-5 py-3.5 text-sm text-slate-600">
          {order.foodId?.name || "Food deleted"}
        </td>

        <td className="px-5 py-3.5 text-sm text-slate-500">
          {order.foodId?.pickupTime || "Not set"}
        </td>

        <td className="px-5 py-3.5">
          <StatusChip status={order.status} />
        </td>

        <td className="px-5 py-3.5 text-sm font-black text-slate-900">
          ₹{order.foodId?.discountedPrice || order.foodId?.originalPrice || 0}
        </td>
      </tr>
    ))
  )}
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
        { label: "Revenue Generated", value: "₹5,284", sub: "+18% vs last month", color: "blue" },
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
          <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-green-500" /><span className="text-slate-500">Revenue (₹)</span></div>
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
          <Area type="monotone" dataKey="revenue" stroke="#22C55E" strokeWidth={2} fill="url(#ag1)" name="Revenue (₹)" />
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
 const [vendorFoods, setVendorFoods] = useState<Food[]>([]);
 const [editingFood, setEditingFood] = useState<Food | null>(null);
 const [notification, setNotification] = useState("");
 const [notificationCount, setNotificationCount] = useState(0);
 const [notifications, setNotifications] = useState<string[]>([]);
const [showNotifications, setShowNotifications] = useState(false);

 useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const vendorId = user.id || user._id;

  if (!vendorId) {
    return;
  }

  socket.emit("joinVendorRoom", vendorId);
  console.log("Vendor joined with ID:", vendorId);

  const handleNewOrder = (data: any) => {
    console.log("New order received:", data);

    const message = data?.message || "New order received";

    setNotification(message);
    setNotificationCount((prev) => prev + 1);
    setNotifications((prev) => [message, ...prev]);

    setTimeout(() => {
      setNotification("");
    }, 4000);
  };

  socket.on("newOrder", handleNewOrder);

  return () => {
    socket.off("newOrder", handleNewOrder);
  };
}, []);

useEffect(() => {
  const token = localStorage.getItem("token");

  fetch("http://localhost:5000/api/vendor/foods", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => setVendorFoods(Array.isArray(data) ? data : []))
    .catch((err) => console.error(err));
}, []);
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
        <button onClick={() => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setScreen("landing");
}} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
          <LogOut className="w-4 h-4" />Exit to Home
        </button>
      </div>
    </div>
  );

  useEffect(() => {
  const token = localStorage.getItem("token");

  fetch("http://localhost:5000/api/vendor/foods", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => setVendorFoods(data))
    .catch((error) => console.error("Error fetching vendor foods:", error));
}, []);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {notification && (
  <div className="fixed top-5 right-5 bg-green-600 text-white px-5 py-3 rounded-xl shadow-xl z-50">
    🔔 {notification}
  </div>
)}
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
         <div className="relative">
  <button
    onClick={() => {
      setShowNotifications((prev) => !prev);
      setNotificationCount(0);
    }}
    className="relative p-2 rounded-lg hover:bg-slate-50"
  >
    <Bell className="w-5 h-5 text-slate-600" />

    {notificationCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
        {notificationCount}
      </span>
    )}
  </button>

  {showNotifications && (
    <div className="absolute right-0 top-12 w-72 bg-white border border-slate-100 rounded-xl shadow-xl z-50 p-3">
      <p className="font-bold text-sm text-slate-900 mb-2">Notifications</p>

      {notifications.length === 0 ? (
        <p className="text-xs text-slate-500">No notifications yet</p>
      ) : (
        notifications.map((note, index) => (
          <p key={index} className="text-sm text-slate-700 border-b last:border-b-0 py-2">
            🔔 {note}
          </p>
        ))
      )}
    </div>
  )}
  </div>

          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-black">FS</div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
         {vendorTab === "dashboard" && (
  <VendorDashboardTab
    setVendorTab={setVendorTab}
    vendorFoods={vendorFoods}
    setVendorFoods={setVendorFoods}
    setEditingFood={setEditingFood}
  />
)}
          {vendorTab === "post-food" && <PostFoodTab 
          editingFood={editingFood}
          setEditingFood={setEditingFood}
          />}
          {vendorTab === "orders" && <OrdersTab />}
          {vendorTab === "analytics" && <AnalyticsTab />}
          {vendorTab === "reviews" && <ReviewsTab />}
        </main>
      </div>
    </div>
  );
};
export default VendorLayout;
