import { Metadata } from "next";

export const metadata: Metadata = {
  title: "隱私權政策 | Mibu 旅遊扭蛋",
  description: "Mibu 旅遊扭蛋隱私權政策，說明我們如何收集、使用和保護您的個人資訊。",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-2">隱私權政策</h1>
      <p className="text-sm text-muted-foreground mb-8">最後更新日期：2025年1月</p>
      
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
          <h2 className="text-xl font-semibold text-foreground mb-3">4. 資料安全</h2>
          <p className="text-muted-foreground leading-relaxed">
            我們採用業界標準的安全措施保護您的資料，包括加密傳輸和安全儲存。
            但請注意，沒有任何網路傳輸方式是完全安全的。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">5. 您的權利</h2>
          <p className="text-muted-foreground leading-relaxed">
            您有權：存取您的個人資料、更正不正確的資料、要求刪除您的資料、
            撤回同意。如需行使這些權利，請聯繫我們。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">6. Cookie 使用</h2>
          <p className="text-muted-foreground leading-relaxed">
            我們使用 Cookie 和類似技術來改善使用體驗、記住您的偏好設定、
            分析網站流量。您可以在瀏覽器設定中管理 Cookie。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">7. 聯絡我們</h2>
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
