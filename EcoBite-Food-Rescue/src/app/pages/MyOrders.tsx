import { useEffect, useRef, useState } from "react";
import {
  ChevronRight,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ShoppingBag,
} from "lucide-react";
import type { Screen } from "../types";
import { io, type Socket } from "socket.io-client";

interface OrderFood {
  _id?: string;
  name?: string;
  image?: string;
  vendor?: string;
  discountedPrice?: number;
  pickupTime?: string;
}

interface ConsumerOrder {
  _id: string;
  foodId?: OrderFood;
  quantity: number;
  status: string;
  paymentStatus?: string;
  totalAmount?: number;
  paymentId?: string;
  createdAt?: string;
}

const MyOrders = ({
  setScreen,
}: {
  setScreen: (screen: Screen) => void;
}) => {
  const [orders, setOrders] = useState<ConsumerOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setOrdersLoading(true);
        setOrdersError("");

        const token =
          localStorage.getItem("token") ||
          sessionStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/orders/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load orders");
        }

        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("My Orders Error:", error);

        setOrdersError(
          error instanceof Error
            ? error.message
            : "Unable to load your orders"
        );
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  useEffect(() => {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  socketRef.current = io("http://localhost:5000", {
    auth: {
      token,
    },
  });

  socketRef.current.on("connect", () => {

  const savedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  const user = savedUser ? JSON.parse(savedUser) : null;

  if (user?.id) {
    socketRef.current?.emit("joinConsumerRoom", user.id);
  }
});

  socketRef.current.on("orderStatusUpdated", (data) => {
    console.log("Live order status update:", data);

    setOrders((previousOrders) =>
      previousOrders.map((order) =>
        order._id === data.orderId
          ? {
              ...order,
              status: data.status,
            }
          : order
      )
    );
  });

  return () => {
    socketRef.current?.off("orderStatusUpdated");
    socketRef.current?.disconnect();
    socketRef.current = null;
  };
}, []);

  
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
      case "ready":
        return "bg-green-100 text-green-700";

      case "completed":
      case "collected":
        return "bg-blue-100 text-blue-700";

      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
      case "ready":
      case "completed":
      case "collected":
        return <CheckCircle className="w-4 h-4" />;

      case "rejected":
      case "cancelled":
        return <XCircle className="w-4 h-4" />;

      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-100 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={() => setScreen("consumer")}
            className="p-2 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-180 text-slate-700" />
          </button>

          <div>
            <h1 className="font-black text-slate-900">
              My Orders
            </h1>

            <p className="text-xs text-slate-500">
              Track your food rescue orders
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Loading state */}
        {ordersLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl p-4 border border-slate-100 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl bg-slate-200" />

                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                    <div className="h-3 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-slate-200 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!ordersLoading && ordersError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="font-bold text-red-700">
              Unable to load orders
            </p>

            <p className="text-sm text-red-600 mt-2">
              {ordersError}
            </p>
          </div>
        )}

        {/* Empty state */}
        {!ordersLoading &&
          !ordersError &&
          orders.length === 0 && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-green-50 mx-auto flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-green-500" />
              </div>

              <h2 className="text-xl font-black text-slate-900 mt-5">
                No orders yet
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                Explore nearby surplus food and place your first rescue order.
              </p>

              <button
                onClick={() => setScreen("consumer")}
                className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
              >
                Browse Food
              </button>
            </div>
          )}

        {/* Orders list */}
        {!ordersLoading &&
          !ordersError &&
          orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order) => {
                const food = order.foodId;

                const orderSteps = [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "completed",
];

const getCurrentStep = (status: string) => {
  return orderSteps.indexOf(status.toLowerCase());
};

                return (
                  <div
                    key={order._id}
                    className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
                  >
                    <div className="p-4 sm:p-5">
                      <div className="flex gap-4">
                        <img
                          src={
                            food?.image ||
                            "https://placehold.co/160x160?text=EcoBite"
                          }
                          alt={food?.name || "Food order"}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-slate-100 flex-none"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h2 className="font-black text-slate-900 truncate">
                                {food?.name || "Food Order"}
                              </h2>

                              <p className="text-xs text-slate-500 mt-1">
                                {food?.vendor || "EcoBite Vendor"}
                              </p>
                            </div>

                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold capitalize ${getStatusStyle(
                                order.status
                              )}`}
                            >
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mt-4">
                            <div>
                              <p className="text-xs text-slate-400">
                                Quantity
                              </p>

                              <p className="text-sm font-bold text-slate-800">
                                {order.quantity}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-slate-400">
                                Amount
                              </p>

                              <p className="text-sm font-black text-green-600">
                                ₹
                                {order.totalAmount ??
                                  food?.discountedPrice ??
                                  0}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-slate-400">
                                Payment
                              </p>

                              <p className="text-sm font-bold text-slate-800 capitalize">
                                {order.paymentStatus || "pending"}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-slate-400">
                                Ordered
                              </p>

                              <p className="text-sm font-bold text-slate-800">
                                {order.createdAt
                                  ? new Date(
                                      order.createdAt
                                    ).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : "--"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {order.status !== "rejected" && order.status !== "cancelled" && (
  <div className="mt-5 pt-5 border-t border-slate-100">
    <p className="text-sm font-bold text-slate-900 mb-4">
      Order Progress
    </p>

    <div className="flex items-start justify-between relative">
      <div className="absolute top-3 left-4 right-4 h-1 bg-slate-200 rounded-full" />

      <div
        className="absolute top-3 left-4 h-1 bg-green-500 rounded-full transition-all duration-500"
        style={{
          width: `${
            (Math.max(getCurrentStep(order.status), 0) /
              (orderSteps.length - 1)) *
            100
          }%`,
          maxWidth: "calc(100% - 2rem)",
        }}
      />

      {orderSteps.map((step, index) => {
        const currentStep = getCurrentStep(order.status);
        const completed = index <= currentStep;

        return (
          <div
            key={step}
            className="relative z-10 flex flex-col items-center flex-1"
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                completed
                  ? "bg-green-500 border-green-500 text-white"
                  : "bg-white border-slate-300 text-slate-400"
              }`}
            >
              {completed ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-slate-300" />
              )}
            </div>

            <span
              className={`text-[10px] sm:text-xs mt-2 text-center capitalize ${
                completed
                  ? "font-bold text-green-600"
                  : "text-slate-400"
              }`}
            >
              {step === "pending" ? "Placed" : step}
            </span>
          </div>
        );
      })}
    </div>
  </div>
)}

{(order.status === "rejected" ||
  order.status === "cancelled") && (
  <div className="mt-5 pt-5 border-t border-slate-100">
    <div className="rounded-2xl bg-red-50 border border-red-100 p-4 flex items-start gap-3">
      <XCircle className="w-5 h-5 text-red-500 mt-0.5" />

      <div>
        <p className="font-bold text-red-700 capitalize">
          Order {order.status}
        </p>

        <p className="text-xs text-red-600 mt-1">
          This order will not continue through the preparation process.
        </p>
      </div>
    </div>
  </div>
)}

                      <div className="border-t border-slate-100 mt-4 pt-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Package className="w-4 h-4" />

                          <span className="truncate">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </span>
                        </div>

                        {order.paymentId && (
                          <span className="text-[11px] text-slate-400 truncate max-w-[180px]">
                            Payment: {order.paymentId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </div>
    </div>
  );
};

export default MyOrders;