import { Metadata } from "next";

export const metadata: Metadata = {
  title: "隱私權政策 | Mibu 旅遊扭蛋",
  description: "Mibu 旅遊扭蛋隱私權政策，說明我們如何收集、使用和保護您的個人資訊。",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-2">隱私權政策</h1>
      <p className="text-sm text-muted-foreground mb-8">最後更新日期：2026年2月</p>
      
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">1. 資料收集</h2>
          <p className="text-muted-foreground leading-relaxed">
            我們收集您在使用 Mibu 服務時提供的資訊，包括但不限於：帳戶資訊（姓名、電子郵件地址）、
            位置資訊（用於提供附近景點推薦）、使用紀錄（扭蛋紀錄、收藏景點）。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">2. 資料使用</h2>
          <p className="text-muted-foreground leading-relaxed">
            我們使用收集的資料來：提供並改善服務、個人化您的體驗、發送服務相關通知、
            分析使用趨勢以改進產品。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">3. 資料分享</h2>
          <p className="text-muted-foreground leading-relaxed">
            我們不會出售您的個人資訊。我們可能與以下對象分享資訊：
            提供服務的合作夥伴（如支付處理商）、法律要求時的政府機關。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">4. 第三方 AI 服務</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            本應用程式使用 Google Gemini AI 服務提供以下功能：
          </p>
          <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-1 mb-3">
            <li><strong>AI 行程推薦</strong>：您的對話內容將傳送至 Google 伺服器，用於產生個人化旅遊行程建議</li>
            <li><strong>智慧排序</strong>：您的旅遊偏好資料將傳送至 Google 伺服器，用於優化推薦結果</li>
            <li><strong>景點描述與翻譯</strong>：系統自動產生景點介紹文字（不涉及您的個人資料）</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-3">
            上述功能透過 Google Gemini API 處理，相關資料僅用於產生即時回應，不會被用於 AI 模型訓練。
            您可以在使用 AI 功能前選擇是否同意資料傳送，拒絕後仍可使用應用程式的核心功能（扭蛋、圖鑑、手動行程安排）。
          </p>
          <p className="text-muted-foreground leading-relaxed">
            詳細資訊請參閱{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Google 隱私權政策
            </a>
            。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">5. 資料安全</h2>
          <p className="text-muted-foreground leading-relaxed">
            我們採用業界標準的安全措施保護您的資料，包括加密傳輸和安全儲存。
            但請注意，沒有任何網路傳輸方式是完全安全的。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">6. 您的權利</h2>
          <p className="text-muted-foreground leading-relaxed">
            您有權：存取您的個人資料、更正不正確的資料、要求刪除您的資料、
            撤回同意。如需行使這些權利，請聯繫我們。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">7. Cookie 使用</h2>
          <p className="text-muted-foreground leading-relaxed">
            我們使用 Cookie 和類似技術來改善使用體驗、記住您的偏好設定、
            分析網站流量。您可以在瀏覽器設定中管理 Cookie。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">8. 聯絡我們</h2>
          <p className="text-muted-foreground leading-relaxed">
            如對本隱私權政策有任何疑問，請聯繫：
            <a href="mailto:chaosmibu@gmail.com" className="text-primary hover:underline ml-1">
              chaosmibu@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
