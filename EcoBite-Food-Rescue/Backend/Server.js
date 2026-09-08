require("dotenv").config({ override: true });


const { protect, vendorOnly } = require("./middleware/authMiddleware");
const { uploadImage } = require("./services/cloudinaryService");
const http = require("http");
const { Server } = require("socket.io");
const Food = require("./Models/Food");
const upload = require("./Middleware/upload");
const { analyzeFoodImage } = require("./AI/geminiService");
const Order = require("./Models/Order");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const connectDB = require("./config/db");
const User = require("./models/User");
connectDB();

const app = express();

const server = http.createServer(app);

const ai = require("./AI/geminiService");

app.get("/api/ai/test", async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Say EcoBite AI is connected successfully in one short sentence.",
    });

    res.json({
      message: response.text,
    });
  } catch (error) {
    console.error("Gemini Test Error:", error);
    res.status(500).json({
      message: "Gemini test failed",
      error: error.message,
    });
  }
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinConsumerRoom", (consumerId) => {
  socket.join(consumerId);
  console.log("Consumer joined room:", consumerId);
}); 

  socket.on("joinVendorRoom", (vendorId) => {
    socket.join(vendorId);
    console.log("Vendor joined room:", vendorId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("EcoBite Backend is running");
});

app.get("/api/foods", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.post("/api/foods", protect, vendorOnly, async (req, res) => {
  try {
    const food = await Food.create({
      ...req.body,
      vendorId: req.user.id,
       available: true,
  quantity: Number(req.body.quantity) || 1,
    });

    res.status(201).json({
      message: "Food added successfully",
      food,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.put("/api/foods/:id", protect, vendorOnly, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    if (food.vendorId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can update only your own food listing",
      });
    }

    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Food updated successfully",
      food: updatedFood,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.delete("/api/foods/:id", protect, vendorOnly, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    if (food.vendorId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can delete only your own food listing",
      });
    }

    await Food.findByIdAndDelete(req.params.id);

    res.json({
      message: "Food deleted successfully",
      food,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});



app.get("/api/vendor/foods", protect, vendorOnly, async (req, res) => {
  try {
    const foods = await Food.find({ vendorId: req.user.id });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/vendor/dashboard", protect, vendorOnly, async (req, res) => {
  try {
    const vendorId = req.user.id;

    const orders = await Order.find({
      vendorId,
    });

    const paidOrders = orders.filter(
      (order) => order.paymentStatus === "paid"
    );

    const completedOrders = orders.filter(
      (order) =>
        order.status === "completed" ||
        order.status === "collected"
    );

    const rejectedOrders = orders.filter(
      (order) =>
        order.status === "rejected" ||
        order.status === "cancelled"
    );

    const totalOrders = orders.length;

    const revenue = paidOrders.reduce(
      (sum, order) =>
        sum + Number(order.totalAmount || 0),
      0
    );

    const foodSaved = completedOrders.reduce(
      (sum, order) =>
        sum + Number(order.quantity || 0),
      0
    );

    const successfulOrders =
      totalOrders - rejectedOrders.length;

    const trustScore =
      totalOrders === 0
        ? 100
        : Math.round(
            (successfulOrders / totalOrders) * 100
          );

    res.json({
      totalOrders,
      revenue,
      foodSaved,
      trustScore,
      pendingOrders: orders.filter(
        (order) => order.status === "pending"
      ).length,
      completedOrders: completedOrders.length,
      rejectedOrders: rejectedOrders.length,
    });
  } catch (error) {
    console.error("Vendor dashboard error:", error);

    res.status(500).json({
      message: "Unable to load vendor dashboard",
      error: error.message,
    });
  }
});

app.post("/api/orders", protect, async (req, res) => {
  try {
    const { foodId, quantity } = req.body;

    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    if (food.quantity <= 0) {
      return res.status(400).json({
        message: "Food is no longer available",
      });
    }

    const existingOrder = await Order.findOne({
      foodId,
      consumerId: req.user.id,
    });

    if (existingOrder) {
      return res.status(400).json({
        message: "You have already reserved this food",
      });
    }

    const order = await Order.create({
      foodId,
      consumerId: req.user.id,
      vendorId: food.vendorId,
      quantity: quantity || 1,
      status: "pending",
    });

    const orderQty = Number(quantity) || 1;
const currentQty = Number(food.quantity) || 0;

food.quantity = currentQty - orderQty;

    if (food.quantity <= 0) {
      food.available = false;
    }

    await food.save();

    io.emit("foodQuantityUpdated", {
  foodId: food._id.toString(),
  quantity: food.quantity,
  available: food.available,
});

    console.log("Food vendorId:", food.vendorId.toString());
console.log("Emitting to vendor room:", food.vendorId.toString());

   io.to(food.vendorId.toString()).emit("newOrder", {
  message: `${food.name} has been reserved`,
  order,
});

    res.status(201).json({
      message: "Food reserved successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.get("/api/vendor/orders", protect, vendorOnly, async (req, res) => {
  try {
    const orders = await Order.find({ vendorId: req.user.id })
      .populate("foodId")
      .populate("consumerId", "name email");

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.put("/api/vendor/orders/:id", protect, vendorOnly, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "accepted",
      "preparing",
      "ready",
      "completed",
      "rejected",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.vendorId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can update only your own orders",
      });
    }

    order.status = status;

    await order.save();

    io.to(order.consumerId.toString()).emit("orderStatusUpdated", {
      orderId: order._id.toString(),
      status: order.status,
      message: `Your order status changed to ${order.status}`,
    });

    return res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      message: "Unable to update order status",
      error: error.message,
    });
  }
});

app.get("/api/orders/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ consumerId: req.user.id })
      .populate("foodId")
      .populate("vendorId", "name email");

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.get("/api/vendor/stats", protect, vendorOnly, async (req, res) => {
  try {
    const foods = await Food.find({ vendorId: req.user.id });
    const orders = await Order.find({ vendorId: req.user.id }).populate("foodId");

    const totalOrders = orders.length;

    const completedOrders = orders.filter(
      (order) => order.status === "completed"
    );

    const revenue = completedOrders.reduce((sum, order) => {
      return sum + (order.foodId?.discountedPrice || order.foodId?.originalPrice || 0);
    }, 0);

    const activeListings = foods.length;

    res.json({
      totalOrders,
      revenue,
      activeListings,
      foodSaved: `${completedOrders.length * 0.5} kg`,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.get("/api/vendor/weekly-stats", protect, vendorOnly, async (req, res) => {
  try {
    const orders = await Order.find({ vendorId: req.user.id }).populate("foodId");

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const weeklyData = days.map((day) => ({
      day,
      revenue: 0,
      orders: 0,
    }));

    orders.forEach((order) => {
      const dayIndex = new Date(order.createdAt).getDay();

      weeklyData[dayIndex].orders += 1;

      if (order.status === "completed") {
        weeklyData[dayIndex].revenue +=
          order.foodId?.discountedPrice || order.foodId?.originalPrice || 0;
      }
    });

    res.json(weeklyData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/vendor/category-stats", protect, vendorOnly, async (req, res) => {
  try {
    const orders = await Order.find({
      vendorId: req.user.id,
      status: "completed",
    }).populate("foodId");

    const categoryMap = {};

    orders.forEach((order) => {
      const category = order.foodId?.category || "Other";
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });

    const result = Object.keys(categoryMap).map((category) => ({
      name: category,
      value: categoryMap[category],
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/payment/create-order", protect, async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: `ecobite_${Date.now()}`,
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create Razorpay order",
      error: error.message,
    });
  }
});

app.post("/api/payment/verify", protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
    } = req.body;

    // 1. Validate required payment information
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details are incomplete",
      });
    }

    // 2. Validate cart items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // 3. Create the signature expected from Razorpay
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // 4. Compare generated signature with Razorpay signature
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // 5. Prevent duplicate order creation
    const existingPaidOrders = await Order.find({
      paymentId: razorpay_payment_id,
      consumerId: req.user.id,
    });

    if (existingPaidOrders.length > 0) {
      return res.json({
        success: true,
        message: "Payment was already verified",
        orders: existingPaidOrders,
      });
    }

    const createdOrders = [];

    // 6. Process every cart item
    for (const item of items) {
      const food = await Food.findById(item.foodId);

      if (!food) {
        return res.status(404).json({
          success: false,
          message: "One of the selected food items was not found",
        });
      }

      const orderQuantity = Number(item.quantity) || 1;
      const availableQuantity = Number(food.quantity) || 0;

      if (!food.available || availableQuantity < orderQuantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${availableQuantity} quantity of ${food.name} is available`,
        });
      }

      /*
       * Use the price stored in MongoDB.
       * Do not trust the price sent by the frontend.
       */
      const itemPrice = Number(food.discountedPrice) || 0;
      const itemTotal = itemPrice * orderQuantity;

      // 7. Create the paid EcoBite order
      const order = await Order.create({
        foodId: food._id,
        consumerId: req.user.id,
        vendorId: food.vendorId,
        quantity: orderQuantity,
        status: "pending",

        paymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        paymentStatus: "paid",
        totalAmount: itemTotal,
      });

      createdOrders.push(order);

      // 8. Reduce available food quantity
      food.quantity = availableQuantity - orderQuantity;

      if (food.quantity <= 0) {
        food.quantity = 0;
        food.available = false;
      }

      await food.save();

      // 9. Notify the relevant vendor
      io.to(food.vendorId.toString()).emit("newOrder", {
        message: `New paid order received for ${food.name}`,
        order,
        paymentStatus: "paid",
      });

      // 10. Update quantity for all connected consumers
      io.emit("foodQuantityUpdated", {
        foodId: food._id.toString(),
        quantity: food.quantity,
        available: food.available,
      });
    }

    return res.json({
      success: true,
      message: "Payment verified and orders created successfully",
      orders: createdOrders,
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
}); 

app.post(
  "/api/ai/analyze-food",
  protect,
  vendorOnly,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Food image is required",
        });
      }

      const { foodName, category, originalPrice } = req.body;

      let analysis;

      try {
        analysis = await analyzeFoodImage({
          imageBuffer: req.file.buffer,
          mimeType: req.file.mimetype,
          foodName,
          category,
          originalPrice,
        });

        console.log("✅ Gemini analysis successful");
      } catch (error) {
        console.error("❌ Gemini analysis failed:", error);

        return res.status(500).json({
          message: "Gemini analysis failed",
          error: error.message,
        });
      }

      let cloudinaryResult;

      try {
        cloudinaryResult = await uploadImage(req.file.buffer);

        console.log("✅ Cloudinary upload successful");
      } catch (error) {
        console.error("❌ Cloudinary upload failed:", {
          message: error?.message,
          http_code: error?.http_code,
          name: error?.name,
        });

        return res.status(500).json({
          message: "Cloudinary image upload failed",
          error: error.message,
        });
      }

      analysis.imageUrl = cloudinaryResult.secure_url;

      return res.json({
        message: "AI analysis completed successfully",
        analysis,
      });
    } catch (error) {
      console.error("❌ Unexpected AI route error:", error);

      return res.status(500).json({
        message: "AI food analysis failed",
        error: error.message,
      });
    }
  }
);

server.listen(PORT, () => {
  console.log(`EcoBite backend running on port ${PORT}`);
});