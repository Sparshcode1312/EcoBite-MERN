const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
    consumerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    paymentId: {
  type: String,
  default: "",
},

razorpayOrderId: {
  type: String,
  default: "",
},

paymentStatus: {
  type: String,
  enum: ["pending", "paid", "failed"],
  default: "pending",
},

totalAmount: {
  type: Number,
  default: 0,
},

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);