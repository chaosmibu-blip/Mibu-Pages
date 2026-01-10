import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSupportRequestSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/support", async (req, res) => {
    try {
      const validatedData = insertSupportRequestSchema.parse(req.body);
      const supportRequest = await storage.createSupportRequest(validatedData);
      res.status(201).json({ success: true, id: supportRequest.id });
    } catch (error) {
      console.error("Support request error:", error);
      res.status(400).json({ success: false, error: "Invalid request data" });
    }
  });

  // Merchant subscription checkout endpoint
  app.post("/api/merchant/subscription/checkout", async (req, res) => {
    try {
      const { tier, provider } = req.body;

      if (!tier || !["pro", "premium"].includes(tier)) {
        return res.status(400).json({ message: "無效的方案" });
      }

      if (!provider || !["stripe", "recur"].includes(provider)) {
        return res.status(400).json({ message: "無效的付款方式" });
      }

      const baseUrl = process.env.BASE_URL || "https://mibu-travel.com";

      if (provider === "stripe") {
        res.json({
          url: `${baseUrl}/merchant/subscription/success?tier=${tier}&provider=stripe`,
        });
      } else {
        res.json({
          publishableKey: process.env.RECUR_PUBLISHABLE_KEY || "pk_test_placeholder",
          productId: tier === "pro" ? "prod_pro" : "prod_premium",
          externalCustomerId: "customer_placeholder",
          successUrl: `${baseUrl}/merchant/subscription/success?tier=${tier}`,
          cancelUrl: `${baseUrl}/merchant/subscription/cancel`,
        });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      res.status(500).json({ message: "結帳失敗，請稍後再試" });
    }
  });

  // Get merchant subscription status
  app.get("/api/merchant/subscription", async (req, res) => {
    res.json({
      tier: "free",
      status: "active",
      currentPeriodEnd: null,
      history: [],
    });
  });

  // Merchant login endpoint (mock)
  app.post("/api/merchant/login", async (req, res) => {
    const { email, password, target_role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "請輸入電子郵件和密碼" });
    }

    if (password.length < 6) {
      return res.status(401).json({ code: "INVALID_CREDENTIALS", message: "帳號或密碼錯誤" });
    }

    if (email === "pending@example.com") {
      return res.status(403).json({ code: "PENDING_APPROVAL", message: "帳號審核中，請等待管理員核准" });
    }

    if (email === "user@example.com" && target_role === "merchant") {
      return res.status(403).json({ code: "ROLE_MISMATCH", message: "此帳號不是商家帳號，請使用 App 登入" });
    }

    res.json({
      success: true,
      merchant: {
        id: 1,
        name: "測試商家",
        email: email,
        level: "free",
      },
    });
  });

  // Verify merchant auth status (mock)
  app.get("/api/merchant/verify", async (req, res) => {
    res.json({ authenticated: false });
  });

  // Merchant logout (mock)
  app.post("/api/merchant/logout", async (req, res) => {
    res.json({ success: true });
  });

  // Get subscription plans
  app.get("/api/subscription-plans", async (req, res) => {
    const plans = [
      {
        id: "free",
        tier: "free",
        title: "Free",
        priceMonthly: 0,
        priceYearly: null,
        period: "永久免費",
        features: ["1 間店家", "5 張優惠券", "基礎數據報表"],
        buttonText: "開始使用",
        disabled: true,
        highlighted: false,
        highlightLabel: null,
      },
      {
        id: "pro",
        tier: "pro",
        title: "Pro 專業版",
        priceMonthly: 299,
        priceYearly: 2870,
        period: "/月",
        features: ["3 間店家", "20 張優惠券", "進階數據報表", "優先曝光"],
        buttonText: "立即訂閱",
        disabled: false,
        highlighted: true,
        highlightLabel: "熱門選擇",
      },
      {
        id: "premium",
        tier: "premium",
        title: "Premium 旗艦版",
        priceMonthly: 799,
        priceYearly: 7670,
        period: "/月",
        features: [
          "無限店家",
          "無限優惠券",
          "完整數據報表",
          "最高優先曝光",
          "專屬客服",
        ],
        buttonText: "立即訂閱",
        disabled: false,
        highlighted: false,
        highlightLabel: null,
      },
    ];
    res.json(plans);
  });

  // SEO: Get cities list
  app.get("/api/seo/cities", async (req, res) => {
    const cities = [
      {
        id: 1,
        slug: "taipei",
        name: "台北",
        nameEn: "Taipei",
        country: "台灣",
        coverImage: "https://images.unsplash.com/photo-1470004914212-05527e49370b?w=800&q=80",
        placesCount: 42,
      },
      {
        id: 2,
        slug: "tokyo",
        name: "東京",
        nameEn: "Tokyo",
        country: "日本",
        coverImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
        placesCount: 68,
      },
      {
        id: 3,
        slug: "osaka",
        name: "大阪",
        nameEn: "Osaka",
        country: "日本",
        coverImage: "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800&q=80",
        placesCount: 35,
      },
      {
        id: 4,
        slug: "kyoto",
        name: "京都",
        nameEn: "Kyoto",
        country: "日本",
        coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
        placesCount: 48,
      },
      {
        id: 5,
        slug: "seoul",
        name: "首爾",
        nameEn: "Seoul",
        country: "韓國",
        coverImage: "https://images.unsplash.com/photo-1534274867514-d5b47ef89ed7?w=800&q=80",
        placesCount: 55,
      },
      {
        id: 6,
        slug: "bangkok",
        name: "曼谷",
        nameEn: "Bangkok",
        country: "泰國",
        coverImage: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80",
        placesCount: 38,
      },
    ];
    res.json(cities);
  });

  // SEO: Get city detail
  app.get("/api/seo/cities/:slug", async (req, res) => {
    const { slug } = req.params;
    const cityData: Record<string, any> = {
      taipei: {
        id: 1,
        slug: "taipei",
        name: "台北",
        nameEn: "Taipei",
        country: "台灣",
        description: "台北是台灣的首都，融合了現代都會與傳統文化，擁有世界級的美食、夜市和文化景點。",
        coverImage: "https://images.unsplash.com/photo-1470004914212-05527e49370b?w=1200&q=80",
        places: [
          { id: 1, slug: "taipei-101", name: "台北101", category: "地標", rating: 4.7, image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&q=80" },
          { id: 2, slug: "shilin-night-market", name: "士林夜市", category: "夜市", rating: 4.5, image: "https://images.unsplash.com/photo-1529921879218-f61a61c0f24c?w=400&q=80" },
          { id: 3, slug: "national-palace-museum", name: "故宮博物院", category: "博物館", rating: 4.8, image: "https://images.unsplash.com/photo-1553603227-2358aabe821e?w=400&q=80" },
        ],
      },
      tokyo: {
        id: 2,
        slug: "tokyo",
        name: "東京",
        nameEn: "Tokyo",
        country: "日本",
        description: "東京是日本的首都，是傳統與現代的完美結合，擁有古老的神社和尖端科技的摩天大樓。",
        coverImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80",
        places: [
          { id: 4, slug: "tokyo-tower", name: "東京鐵塔", category: "地標", rating: 4.6, image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=400&q=80" },
          { id: 5, slug: "senso-ji", name: "淺草寺", category: "寺廟", rating: 4.7, image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&q=80" },
          { id: 6, slug: "shibuya-crossing", name: "澀谷十字路口", category: "地標", rating: 4.5, image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400&q=80" },
        ],
      },
    };

    const city = cityData[slug];
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }
    res.json(city);
  });

  // SEO: Get place detail
  app.get("/api/seo/places/:slug", async (req, res) => {
    const { slug } = req.params;
    const placeData: Record<string, any> = {
      "taipei-101": {
        id: 1,
        slug: "taipei-101",
        name: "台北101",
        nameEn: "Taipei 101",
        category: "地標",
        city: { slug: "taipei", name: "台北" },
        description: "台北101曾是世界最高建築，高508公尺，是台灣最具代表性的地標之一。觀景台可俯瞰整個台北市區。",
        coverImage: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&q=80",
        rating: 4.7,
        address: "台北市信義區信義路五段7號",
        openingHours: "09:00 - 22:00",
        website: "https://www.taipei-101.com.tw",
      },
      "shilin-night-market": {
        id: 2,
        slug: "shilin-night-market",
        name: "士林夜市",
        nameEn: "Shilin Night Market",
        category: "夜市",
        city: { slug: "taipei", name: "台北" },
        description: "士林夜市是台北最大、最知名的夜市，提供各式台灣小吃和購物體驗。",
        coverImage: "https://images.unsplash.com/photo-1529921879218-f61a61c0f24c?w=1200&q=80",
        rating: 4.5,
        address: "台北市士林區基河路101號",
        openingHours: "17:00 - 00:00",
      },
      "tokyo-tower": {
        id: 4,
        slug: "tokyo-tower",
        name: "東京鐵塔",
        nameEn: "Tokyo Tower",
        category: "地標",
        city: { slug: "tokyo", name: "東京" },
        description: "東京鐵塔是東京的經典地標，高333公尺，提供壯麗的城市景觀。",
        coverImage: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=1200&q=80",
        rating: 4.6,
        address: "東京都港區芝公園4-2-8",
        openingHours: "09:00 - 23:00",
        website: "https://www.tokyotower.co.jp",
      },
    };

    const place = placeData[slug];
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.json(place);
  });

  return httpServer;
}
