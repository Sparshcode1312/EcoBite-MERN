  export type Screen =
  | "landing"
  | "login"
  | "register"
  | "role-select"
  | "consumer"
  | "cart"
  | "food-details"
  | "vendor"
  | "review"
  | "explore"
| "saved"
| "profile"
  | "my-orders"
  | "order-success";

  export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "completed"
  | "rejected"
  | "cancelled";

export type RiskLevel = "low" | "medium" | "high";

export type VendorTab = "dashboard" | "post-food" | "orders" | "analytics" | "reviews";

export interface AiAnalysis {
  detectedFood: string;
  category: string;
  description: string;
  freshnessScore: number;
  riskLevel: RiskLevel;
  safeHours: number;
  suggestedDiscount: number;
  recommendedPrice: number;
  confidence: number;
  donationSuitability: string;
  recommendation: string;
  analyzedAt?: string;
}

export interface Food {
  id: number;
  name: string;
  vendor: string;
  category: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  distance: string;
  pickupTime: string;
  risk: RiskLevel;
  trust: number;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  ingredients: string[];
  quantity: number;
  tags?: string[];
  _id?: string;
vendorId?: string;
aiAnalysis?: AiAnalysis;
available?: boolean;
}