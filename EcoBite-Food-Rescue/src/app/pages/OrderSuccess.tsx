import { CheckCircle, ShoppingBag, ReceiptText } from "lucide-react";
import type { Screen } from "../types";

const OrderSuccess = ({
  setScreen,
  amount,
  paymentId,
}: {
  setScreen: (screen: Screen) => void;
  amount: number;
  paymentId: string;
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-100 shadow-xl p-6 sm:p-8 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-5">
          <CheckCircle className="w-11 h-11 text-green-600" />
        </div>

        <p className="text-xs font-bold uppercase tracking-widest text-green-600">
          Payment successful
        </p>

        <h1 className="text-3xl font-black text-slate-900 mt-2">
          Your food rescue order is confirmed!
        </h1>

        <p className="text-sm text-slate-500 mt-3 leading-relaxed">
          The vendor has received your order. You can now monitor its status
          from your orders section.
        </p>

        <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-100 p-4 text-left space-y-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-slate-500 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Amount paid
            </span>
            <span className="font-black text-green-600">
              ₹{amount}
            </span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <span className="text-sm text-slate-500 flex items-center gap-2">
              <ReceiptText className="w-4 h-4 mt-0.5" />
              Payment ID
            </span>
            <span className="text-xs font-semibold text-slate-700 break-all text-right">
              {paymentId}
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mt-6">
          <button
            onClick={() => setScreen("my-orders")}
                        className="w-full border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Continue Browsing
          </button>

          <button
            onClick={() => setScreen("consumer")}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors"
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;