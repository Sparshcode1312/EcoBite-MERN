import { ChevronRight, Heart } from "lucide-react";
import type { Food, Screen } from "../types";
import FoodCard from "../components/FoodCard";

const SavedPage = ({
  savedFoods,
  setSavedFoods,
  setSelectedFood,
  setScreen,
}: {
  savedFoods: Food[];
  setSavedFoods: React.Dispatch<
    React.SetStateAction<Food[]>
  >;
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
            <h1 className="font-black text-slate-900">Saved Food</h1>
            <p className="text-xs text-slate-500">
              Items you want to rescue later
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        {savedFoods.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 mx-auto flex items-center justify-center">
              <Heart className="w-8 h-8 text-rose-400" />
            </div>

            <h2 className="text-xl font-black text-slate-900 mt-5">
              No saved food yet
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Tap the heart icon on a food item to save it here.
            </p>

            <button
              onClick={() => setScreen("explore")}
              className="mt-6 bg-green-500 text-white font-bold px-6 py-3 rounded-xl"
            >
              Explore Food
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {savedFoods.map((food) => (
              <FoodCard
  key={food._id || food.id}
  food={food}
  onClick={() => {
    setSelectedFood(food);
    setScreen("food-details");
  }}
  isSaved={true}
  onToggleSave={() => {
    setSavedFoods((prev) =>
      prev.filter((item) => item._id !== food._id)
    );
  }}
/>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedPage;