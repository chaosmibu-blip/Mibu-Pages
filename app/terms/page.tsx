import { Metadata } from "next";

export const metadata: Metadata = {
  title: "服務條款 | Mibu 旅遊扭蛋",
  description: "Mibu 旅遊扭蛋服務條款，說明使用本服務的規則和條件。",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-2">服務條款</h1>
      <p className="text-sm text-muted-foreground mb-8">最後更新日期：2025年1月</p>
      
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">1. 服務說明</h2>
          <p className="text-muted-foreground leading-relaxed">
            Mibu 是一款旅遊扭蛋應用程式，透過隨機推薦的方式幫助使用者發現新景點。
            本服務由查爾斯有限公司提供和維護。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">2. 使用資格</h2>
          <p className="text-muted-foreground leading-relaxed">
            您必須年滿 13 歲才能使用本服務。如果您未滿 18 歲，
            需獲得父母或監護人的同意才能使用本服務。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">3. 帳戶責任</h2>
          <p className="text-muted-foreground leading-relaxed">
            您對您帳戶下的所有活動負責。請保護好您的登入資訊，
            如發現未經授權的使用，請立即通知我們。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">4. 禁止行為</h2>
          <p className="text-muted-foreground leading-relaxed">
            使用本服務時，您不得：發布虛假或誤導性資訊、侵犯他人智慧財產權、
            干擾或破壞服務運作、進行任何非法活動。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">5. 智慧財產權</h2>
          <p className="text-muted-foreground leading-relaxed">
            本服務的所有內容（包括但不限於文字、圖片、標誌、軟體）
            均受著作權法保護，未經許可不得複製或使用。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">6. 免責聲明</h2>
          <p className="text-muted-foreground leading-relaxed">
            本服務提供的景點資訊僅供參考，實際情況可能有所不同。
            我們不對因使用本服務而產生的任何損失承擔責任。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">7. 條款變更</h2>
          <p className="text-muted-foreground leading-relaxed">
            我們保留隨時修改本條款的權利。重大變更將透過應用程式或電子郵件通知。
            繼續使用本服務即表示您接受修改後的條款。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">8. 聯絡方式</h2>
          <p className="text-muted-foreground leading-relaxed">
            如對本條款有任何疑問，請聯繫：
            <a href="mailto:chaosmibu@gmail.com" className="text-primary hover:underline ml-1">
              chaosmibu@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
