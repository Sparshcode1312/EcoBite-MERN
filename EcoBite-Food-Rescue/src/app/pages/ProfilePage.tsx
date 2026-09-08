import {
  ChevronRight,
  LogOut,
  Mail,
  ShieldCheck,
  ShoppingBag,
  User,
} from "lucide-react";
import type { Screen } from "../types";

const ProfilePage = ({
  setScreen,
}: {
  setScreen: (screen: Screen) => void;
}) => {
  const savedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  const user = savedUser ? JSON.parse(savedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    setScreen("landing");
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setScreen("consumer")}
            className="p-2 rounded-xl hover:bg-slate-50"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>

          <h1 className="font-black text-slate-900">My Profile</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4">
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <div className="w-20 h-20 rounded-full bg-green-100 mx-auto flex items-center justify-center">
            <User className="w-10 h-10 text-green-600" />
          </div>

          <h2 className="text-xl font-black text-slate-900 text-center mt-4">
            {user?.name || "EcoBite User"}
          </h2>

          <p className="text-sm text-slate-500 text-center mt-1">
            {user?.email || "No email available"}
          </p>

          <div className="flex justify-center mt-3">
            <span className="bg-green-50 text-green-700 text-xs font-bold capitalize px-3 py-1 rounded-full">
              {user?.role || "consumer"}
            </span>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm mt-4 overflow-hidden">
          <button
            type="button"
            onClick={() => setScreen("my-orders")}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 border-b border-slate-100"
          >
            <ShoppingBag className="w-5 h-5 text-green-600" />

            <div className="text-left flex-1">
              <p className="font-bold text-slate-900">My Orders</p>
              <p className="text-xs text-slate-500">
                View and track your orders
              </p>
            </div>

            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>

          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
            <Mail className="w-5 h-5 text-green-600" />

            <div>
              <p className="font-bold text-slate-900">Email</p>
              <p className="text-xs text-slate-500">
                {user?.email || "Not available"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 py-4">
            <ShieldCheck className="w-5 h-5 text-green-600" />

            <div>
              <p className="font-bold text-slate-900">Account Security</p>
              <p className="text-xs text-slate-500">
                Protected using JWT authentication
              </p>
            </div>
          </div>
        </section>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full mt-4 bg-white border border-red-200 text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </main>
    </div>
  );
};

export default ProfilePage;