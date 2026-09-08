import { ChevronRight, Trash2, ShoppingCart, Plus, Minus } from "lucide-react";
import type { Food, Screen } from "../types";
import toast from "react-hot-toast";

type CartItem = Food & { cartQty?: number };

const CartPage = ({
  cartItems,
  setCartItems,
  setScreen,
  setLastPayment,
}: {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setScreen: (s: Screen) => void;
   setLastPayment: React.Dispatch<
    React.SetStateAction<{
      amount: number;
      paymentId: string;
    }>
  >;
}) => {
  const updateQty = (id: string | undefined, type: "inc" | "dec") => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item._id !== id) return item;

          const currentQty = item.cartQty || 1;
          const maxQty = item.quantity || 1;

          if (type === "inc" && currentQty < maxQty) {
            return { ...item, cartQty: currentQty + 1 };
          }

          if (type === "dec" && currentQty > 1) {
            return { ...item, cartQty: currentQty - 1 };
          }

          return item;
        })
    );
  };

  const removeItem = (id?: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const itemTotal = cartItems.reduce(
    (sum, item) => sum + Number(item.discountedPrice || 0) * (item.cartQty || 1),
    0
  );

  const originalTotal = cartItems.reduce(
    (sum, item) => sum + Number(item.originalPrice || 0) * (item.cartQty || 1),
    0
  );

  const savings = originalTotal - itemTotal;
  const platformFee = cartItems.length > 0 ? 5 : 0;
  const toPay = itemTotal + platformFee;

  const handlePayment = async () => {
  try {
    const total = cartItems.reduce(
      (sum, item) => sum + Number(item.discountedPrice || 0) * (item.cartQty || 1),
      0
    );

    const response = await fetch(
      "http://localhost:5000/api/payment/create-order",
      {
        method: "POST",
        headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
},
        body: JSON.stringify({
          amount: toPay,
        }),
      }
    );

    const order = await response.json();

    const options = {
     key: order.key,
      amount: order.amount,
      currency: order.currency,
      name: "EcoBite",
      description: "Food Order",
      order_id: order.orderId,

     handler: async function (response: any) {
  const verifyResponse = await fetch("http://localhost:5000/api/payment/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
   body: JSON.stringify({
  razorpay_order_id: response.razorpay_order_id,
  razorpay_payment_id: response.razorpay_payment_id,
  razorpay_signature: response.razorpay_signature,

  amount: toPay,

  items: cartItems.map((item) => ({
    foodId: item._id,
    vendorId: item.vendorId,
    quantity: item.cartQty || 1,
    price: Number(item.discountedPrice || 0),
  })),
}),
  });

  const verifyData = await verifyResponse.json();

 if (verifyResponse.ok && verifyData.success) {
  setLastPayment({
    amount: toPay,
    paymentId: response.razorpay_payment_id,
  });

  setCartItems([]);

  document.body.style.overflow = "auto";
  document.body.style.pointerEvents = "auto";

  setTimeout(() => {
    setScreen("order-success");
  }, 300);
} else {
  toast.error(verifyData.message || "Payment verification failed");
}
},

      theme: {
        color: "#22c55e",
      },
    };

    const razor = new (window as any).Razorpay(options);
    razor.open();
  } catch (err) {
    console.error(err);
    toast.error("Payment failed");
  }
};

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <div className="sticky top-0 z-40 bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setScreen("order-success")}
          className="p-2 hover:bg-slate-50 rounded-xl"
        >
          <ChevronRight className="w-5 h-5 rotate-180 text-slate-700" />
        </button>
        <h1 className="font-black text-slate-900">My Cart</h1>
        <span className="ml-auto text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
          {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="max-w-3xl mx-auto p-4">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm">
            <ShoppingCart className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <h2 className="font-black text-xl text-slate-900">Your cart is empty</h2>
            <p className="text-sm text-slate-500 mt-2">
              Add surplus food items and checkout safely.
            </p>
            <button
              onClick={() => setScreen("order-success")}
              className="mt-5 bg-green-500 text-white font-bold px-6 py-3 rounded-xl"
            >
              Browse Food
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm mb-4">
              <p className="text-sm font-bold text-slate-900">Delivering from EcoBite Partner</p>
              <p className="text-xs text-slate-500 mt-1">
                AI-verified surplus food • Pickup/rescue order
              </p>
            </div>

            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex gap-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover bg-slate-100"
                  />

                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{item.name}</h3>
                    <p className="text-xs text-slate-500">{item.vendor}</p>

                    {item.aiAnalysis && (
                      <p className="text-[11px] text-green-600 font-semibold mt-1">
                        🤖 AI Verified • {item.aiAnalysis.confidence}% Confidence
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-black text-slate-900">
                        ₹{item.discountedPrice}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        ₹{item.originalPrice}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-green-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateQty(item._id, "dec")}
                          className="p-2 hover:bg-green-50 text-green-600"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <span className="px-3 text-sm font-bold text-green-700">
                          {item.cartQty || 1}
                        </span>

                        <button
                          onClick={() => updateQty(item._id, "inc")}
                          className="p-2 hover:bg-green-50 text-green-600"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item._id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl p-5 mt-5 border border-slate-100 shadow-sm">
              <h2 className="font-black text-slate-900 mb-4">Bill Summary</h2>

              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">Item Total</span>
                <span className="font-semibold">₹{itemTotal}</span>
              </div>

              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">EcoBite Platform Fee</span>
                <span className="font-semibold">₹{platformFee}</span>
              </div>

              <div className="flex justify-between text-sm mb-2 text-green-600">
                <span>You Saved</span>
                <span className="font-semibold">₹{savings}</span>
              </div>

              <div className="border-t pt-3 mt-3 flex justify-between">
                <span className="font-black text-slate-900">To Pay</span>
                <span className="font-black text-green-600">₹{toPay}</span>
              </div>

             <button
  onClick={handlePayment}
  className="w-full mt-5 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl"
>
  Proceed to Pay ₹{toPay}
</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;