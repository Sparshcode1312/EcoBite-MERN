import { ChevronRight, Search, MapPin } from "lucide-react";
import type { Food, Screen } from "../types";
import FoodCard from "../components/FoodCard";

const ExplorePage = ({
  foods,
  setSelectedFood,
  setScreen,
}: {
  foods: Food[];
  setSelectedFood: (food: Food) => void;
  setScreen: (screen: Screen) => void;
}) => {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-3">
          <button
            onClick={() => setScreen("consumer")}
            className="p-2 rounded-xl hover:bg-slate-50"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>

          <div>
            <h1 className="font-black text-slate-900">Explore Food</h1>
            <p className="text-xs text-slate-500">
              Discover nearby surplus meals
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

          <input
            type="text"
            placeholder="Search food, vendor or category"
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 outline-none focus:border-green-400"
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <MapPin className="w-4 h-4 text-green-500" />
          Showing food near New Delhi, India
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {foods.map((food) => (
            <FoodCard
              key={food._id || food.id}
              food={food}
              onClick={() => {
                setSelectedFood(food);
                setScreen("food-details");
              }}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default ExplorePage;