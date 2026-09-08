const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: String,
    vendor: String,
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    category: String,
    originalPrice: Number,
    discountedPrice: Number,
    discount: Number,

    distance: String,
    pickupTime: String,
    risk: String,
    trust: Number,

    image: String,
    rating: Number,
    reviews: Number,
    description: String,
    ingredients: [String],
    quantity: Number,
    tags: [String],

    aiAnalysis: {
      detectedFood: String,
      category: String,
      description: String,
      freshnessScore: Number,
      riskLevel: String,
      safeHours: Number,
      suggestedDiscount: Number,
      recommendedPrice: Number,
      confidence: Number,
      donationSuitability: String,
      recommendation: String,
      analyzedAt: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);