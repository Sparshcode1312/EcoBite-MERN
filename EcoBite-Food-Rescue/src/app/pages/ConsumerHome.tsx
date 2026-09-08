import FoodCard from "../components/FoodCard";
import { socket } from "../socket";
import TrustScore from "../components/TrustScore";
import RiskBadge from "../components/RiskBadge";
import type { Screen, Food, RiskLevel } from "../types";
import { useEffect, useRef, useState } from "react";
import { ShoppingCart } from "lucide-react";
import {
  Leaf,
  Search,
  MapPin,
  Bell,
  ShoppingBag,
  Heart,
  Star,
  Clock,
  Menu,
  X,
  User,
  Home,
  Shield,
  ChevronDown,
  History as HistoryIcon
} from "lucide-react";

const ConsumerHome = ({
  setScreen,
  setSelectedFood,
  cartItems,
  setCartItems,
  foods,
  setFoods,
  foodsLoading,
  savedFoods,
  setSavedFoods,
}: {
  setScreen: (s: Screen) => void;
  setSelectedFood: (f: Food) => void;
  cartItems: Food[];
  setCartItems: React.Dispatch<React.SetStateAction<Food[]>>;
   foods: Food[];
  setFoods: React.Dispatch<React.SetStateAction<Food[]>>;
  foodsLoading: boolean;
  savedFoods: Food[];

setSavedFoods: React.Dispatch<
  React.SetStateAction<Food[]>
>;
}) => {
  const [activeCategory, setActiveCategory] = useState("All");
   const ordersRef = useRef<HTMLDivElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState("");
const [notificationCount, setNotificationCount] = useState(0);
const [searchTerm, setSearchTerm] = useState("");
const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Bakery", "Japanese", "Italian", "Thai", "Healthy", "Desserts"];
  const filtered = foods.filter((food) => {
  const matchesSearch =
    food.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.category?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesCategory =
    selectedCategory === "All" || food.category === selectedCategory;

  return matchesSearch && matchesCategory;
});

    useEffect(() => {
  fetch("http://localhost:5000/api/foods")
    .then((res) => res.json())
    .then((data) => setFoods(Array.isArray(data) ? data : []))
    .catch((error) => console.error("Error fetching foods:", error));
}, []);

  console.log("foods:", foods);

 useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const consumerId = user.id || user._id;

  if (!consumerId) {
    console.log("Consumer ID not found");
    return;
  }

  socket.emit("joinConsumerRoom", consumerId);
  console.log("Consumer joined room:", consumerId);

  const handleOrderStatusUpdated = (data: any) => {
    console.log("Order status updated:", data);
    setNotification(data.message);
setNotificationCount((prev) => prev + 1);

setTimeout(() => {
  setNotification("");
}, 4000);
  };

  socket.on("orderStatusUpdated", handleOrderStatusUpdated);

  return () => {
    socket.off("orderStatusUpdated", handleOrderStatusUpdated);
  };
}, []);

useEffect(() => {
  const handleFoodQuantityUpdated = (data: any) => {
    console.log("Food quantity updated:", data);

    setFoods((prevFoods) =>
      prevFoods
        .map((food) =>
          food._id === data.foodId
            ? {
                ...food,
                quantity: data.quantity,
                available: data.available,
              }
            : food
        )
        .filter((food) => food.available !== false)
    );
  };

  socket.on("foodQuantityUpdated", handleFoodQuantityUpdated);

  return () => {
    socket.off("foodQuantityUpdated", handleFoodQuantityUpdated);
  };
}, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {notification && (
  <div className="fixed top-5 right-5 bg-green-600 text-white px-5 py-3 rounded-xl shadow-xl z-50">
    🔔 {notification}
  </div>
)}

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
            <span className="hidden sm:block">New Delhi, India</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          <button className="relative p-2 rounded-lg hover:bg-slate-50 transition-colors">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
          </button>
          <button
  onClick={() => setScreen("cart")}
  className="relative p-2 rounded-full bg-white shadow hover:shadow-md transition"
>
  <ShoppingCart className="w-6 h-6 text-green-600" />

  {cartItems.length > 0 && (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
      {cartItems.length}
    </span>
  )}
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
            <button onClick={() => { setSelectedFood(foods[0]); setScreen("food-details"); }} className="bg-white text-green-700 text-sm font-bold px-4 py-2 rounded-xl hover:bg-green-50 transition-colors">
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
      
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 px-4 max-w-7xl mx-auto">
            {filtered.map((food) => (
  <FoodCard
    key={food._id || food.id}
    food={food}
    onClick={() => {
      setSelectedFood(food);
      setScreen("food-details");
    }}

    isSaved={savedFoods.some(
      (item) => item._id === food._id
    )}

    onToggleSave={() => {
      setSavedFoods((prev) => {
        const exists = prev.some(
          (item) => item._id === food._id
        );

        if (exists) {
          return prev.filter(
            (item) => item._id !== food._id
          );
        }

        return [...prev, food];
      });
    }}
  />
))}
          </div>
        )}
      </div>
     
      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex z-30 safe-area-pb">
        {[
          { icon: Home, label: "Home", active: true },
          { icon: Search, label: "Explore", active: false },
          { icon: Heart, label: "Saved", active: false },
          { icon: HistoryIcon, label: "Orders", active: false },
          { icon: User, label: "Profile", active: false },
        ].map((item) => (
          <button
  key={item.label}
  onClick={() => {
  switch (item.label) {
    case "Home":
      setScreen("consumer");
      break;

    case "Explore":
      setScreen("explore");
      break;

    case "Saved":
      setScreen("saved");
      break;

    case "Orders":
      setScreen("my-orders");
      break;

    case "Profile":
      setScreen("profile");
      break;

    default:
      break;
  }
}}
  className="flex-1 flex flex-col items-center py-2.5 gap-0.5"
>
            <item.icon className={`w-5 h-5 ${item.active ? "text-green-500" : "text-slate-400"}`} />
            <span className={`text-xs font-medium ${item.active ? "text-green-500" : "text-slate-400"}`}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConsumerHome;