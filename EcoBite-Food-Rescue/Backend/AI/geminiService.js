require("dotenv").config({ override: true });

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in .env");
}

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const shouldRetry = (status) => {
  return status === 429 || status === 500 || status === 502 || status === 503;
};

const analyzeFoodImage = async ({
  imageBuffer,
  mimeType,
  foodName,
  category,
  originalPrice,
}) => {
  const base64Image = imageBuffer.toString("base64");

  const prompt = `
You are EcoBite AI, an expert food safety inspector, restaurant pricing analyst, and food waste reduction assistant for the Indian market.

Analyze the supplied food image conservatively and realistically.

Provided information:
Food name: ${foodName || "Not provided"}
Category: ${category || "Not provided"}
Original price: ₹${originalPrice || 0}

VERY IMPORTANT RULES:

1. Food Detection
- Detect the food from the image.
- If the provided food name differs slightly from the image, prefer the image.
- Never invent a completely different food.

2. Category Selection
Choose ONLY one:
- Bakery
- Hot Meals
- Desserts
- Drinks
- Salads

3. Freshness Analysis
Estimate freshness using visible evidence only.

Consider:
- Surface texture
- Colour consistency
- Moisture
- Packaging quality
- Cooking style
- Ingredient type
- Typical shelf life
- Visible spoilage

Do not assume food is spoiled without clear visual evidence.

Freshly cooked restaurant food should normally receive 85-98.
Good quality food prepared today should normally receive 80-94.
Only assign below 70 when there are clear indicators of deterioration.

The same image should produce approximately the same freshness score.

4. Risk Level

low:
Fresh food with no visible issues.

medium:
Slight quality degradation but still consumable.

high:
Visible spoilage, mold, discoloration, leakage, or unsafe appearance.

Never assign high unless there are visible safety concerns.

5. Recommended Discount

Fresh food:
10-20%

Good quality:
20-30%

Near pickup deadline:
30-40%

Only recommend above 40% if food quality is poor.

6. Pricing Strategy

You are acting as a pricing consultant for Indian restaurants selling surplus food through EcoBite.

The recommended price must:
- be attractive enough for customers
- remain fair to vendors
- reflect visible freshness
- reflect category and likely demand
- never exceed originalPrice

For surplus food, recommendedPrice should normally be 10% to 35% lower than originalPrice.

Examples:

Original ₹80
Recommended ₹65-75

Original ₹120
Recommended ₹90-110

Original ₹180
Recommended ₹135-165

Original ₹250
Recommended ₹185-225

Original ₹350
Recommended ₹260-315

Original ₹500
Recommended ₹375-450

Do NOT simply apply a fixed percentage.

7. Safe Consumption Time

Fresh cooked food:
4-6 hours

Bakery:
8-24 hours

Packaged desserts:
12-24 hours

Salads:
2-4 hours

Drinks:
12-48 hours

8. Donation Suitability

Return ONLY one:
"suitable"
"caution"
"not_suitable"

9. Confidence

Return confidence between 85 and 99.
Only go below 85 if image quality is poor.

10. Recommendation

Write a short professional recommendation under 30 words.

Return ONLY valid JSON with no markdown and no explanation.

{
  "detectedFood": "string",
  "category": "Bakery | Hot Meals | Desserts | Drinks | Salads",
  "description": "string",
  "freshnessScore": number,
  "riskLevel": "low | medium | high",
  "safeHours": number,
  "suggestedDiscount": number,
  "recommendedPrice": number,
  "confidence": number,
  "donationSuitability": "suitable | caution | not_suitable",
  "recommendation": "string"
}
`;

  try {
   const apiKey = process.env.GEMINI_API_KEY;

const url =
  `https://generativelanguage.googleapis.com/v1beta/models/` +
  `gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;

const requestBody = {
  contents: [
    {
      role: "user",
      parts: [
        {
          text: prompt,
        },
        {
          inline_data: {
            mime_type: mimeType,
            data: base64Image,
          },
        },
      ],
    },
  ],

  generationConfig: {
    temperature: 0.2,
    responseMimeType: "application/json",
  },
};

let response;
let data;

const MAX_RETRIES = 4;

for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
  try {
    console.log(
      `Gemini request attempt ${attempt}/${MAX_RETRIES}`
    );

    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    data = await response.json();

    if (response.ok) {
      console.log(
        `✅ Gemini succeeded on attempt ${attempt}`
      );

      break;
    }

    console.error("Gemini request failed:", {
      attempt,
      status: response.status,
      message: data?.error?.message,
    });

    if (
      shouldRetry(response.status) &&
      attempt < MAX_RETRIES
    ) {
      const delay = 1500 * Math.pow(2, attempt - 1);

      console.log(
        `⏳ Temporary Gemini error. Retrying in ${delay}ms...`
      );

      await sleep(delay);
      continue;
    }

    throw new Error(
      data?.error?.message ||
        `Gemini API failed with HTTP ${response.status}`
    );
  } catch (error) {
    if (attempt === MAX_RETRIES) {
      throw error;
    }

    const delay = 1500 * Math.pow(2, attempt - 1);

    console.log(
      `⏳ Gemini request error. Retrying in ${delay}ms...`
    );

    await sleep(delay);
  }
}

if (!response?.ok) {
  throw new Error(
    data?.error?.message ||
      "Gemini analysis failed after multiple attempts"
  );
}



    if (!response.ok) {
      console.error("Gemini REST API Error:", {
        status: response.status,
        message: data?.error?.message,
        statusText: data?.error?.status,
        details: data?.error?.details,
      });

      throw new Error(
        data?.error?.message ||
          `Gemini API request failed with status ${response.status}`
      );
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("Unexpected Gemini response:", data);
      throw new Error("Gemini returned an empty analysis");
    }

    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let analysis;

    try {
      analysis = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Gemini JSON parse failed.");
      console.error("Returned text:", cleaned);

      throw new Error(
        "Gemini returned an invalid JSON response"
      );
    }

    const original = Number(originalPrice);

    if (!Number.isFinite(original) || original <= 0) {
      throw new Error(
        "originalPrice must be a valid positive number"
      );
    }

    let aiPrice = Number(analysis.recommendedPrice);

    if (!Number.isFinite(aiPrice) || aiPrice <= 0) {
      aiPrice = Math.round(original * 0.85);
    }

    // Never allow AI price to equal/exceed original price.
    if (aiPrice >= original) {
      aiPrice = Math.round(original * 0.8);
    }

    // Avoid unrealistic extreme discounts.
    if (aiPrice < original * 0.4) {
      aiPrice = Math.round(original * 0.6);
    }

    analysis.recommendedPrice = aiPrice;

    analysis.suggestedDiscount = Math.round(
      ((original - aiPrice) / original) * 100
    );

    if (analysis.suggestedDiscount < 0) {
      analysis.suggestedDiscount = 0;
    }

    return analysis;
  } catch (error) {
    console.error("AI Food Analysis Error:", {
      message: error?.message,
      name: error?.name,
    });

    throw error;
  }
};

module.exports = {
  analyzeFoodImage,
};