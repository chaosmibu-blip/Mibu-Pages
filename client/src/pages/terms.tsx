import { Layout } from "@/components/Layout";
import { useSEO } from "@/hooks/use-seo";

export default function TermsOfService() {
  useSEO({
    title: "使用條款",
    description: "Mibu App 使用條款與服務說明。了解使用規範、智慧財產權、免責聲明及適用法律。"
  });

  return (
    <Layout>
      <article className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <header className="mb-12">
          <div className="w-16 h-1 bg-primary mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="heading-terms">
            使用條款
          </h1>
          <p className="text-muted-foreground" data-testid="text-terms-intro">
            歡迎使用 Mibu App。請在使用前詳細閱讀以下條款。
          </p>
          <p className="text-sm text-muted-foreground mt-2" data-testid="text-last-updated">
            最後更新日期：2025 年 12 月
          </p>
        </header>

        <div className="prose prose-lg max-w-none space-y-10">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4" data-testid="heading-service">
              1. 服務說明
            </h2>
            <p className="text-foreground leading-relaxed">
              Mibu 是一款由查爾斯有限公司提供的旅行扭蛋 App。本 App 讓用戶可以隨機抽取旅遊行程、收集景點、規劃旅程，享受探索未知目的地的樂趣。使用本 App 即表示您同意遵守本使用條款。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4" data-testid="heading-usage">
              2. 使用規範
            </h2>
            <p className="text-foreground leading-relaxed mb-4">
              使用本 App 時，您同意遵守以下規範：
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">不得濫用本 App 或干擾其正常運作</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">不得冒用他人帳號或身份</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">不得使用自動化程式或機器人存取服務</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">不得傳播違法、有害或不當內容</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">不得嘗試破解或繞過 App 的安全機制</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4" data-testid="heading-ip">
              3. 智慧財產權
            </h2>
            <p className="text-foreground leading-relaxed mb-4">
              本 App 的所有內容，包括但不限於：
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">App 設計、介面、圖形和標誌</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">文字內容、圖片和影片</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">軟體程式碼和演算法</span>
              </li>
            </ul>
            <p className="text-foreground leading-relaxed mt-4">
              均為查爾斯有限公司或其授權方的財產，受著作權法及其他智慧財產權法律保護。未經書面授權，不得複製、修改、散布或以其他方式使用。
            </p>
          </section>

          <section className="bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800 p-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4" data-testid="heading-disclaimer">
              4. 免責聲明
            </h2>
            <p className="text-foreground leading-relaxed font-medium">
              <strong>重要提醒：</strong>本 App 提供的旅遊行程、景點資訊僅供參考。實際旅遊時，請務必自行確認以下事項：
            </p>
            <ul className="space-y-2 mt-4">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                <span className="text-foreground">景點的營業時間和開放狀態</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                <span className="text-foreground">當地天氣和安全狀況</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                <span className="text-foreground">交通和住宿安排</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                <span className="text-foreground">旅遊保險和個人安全</span>
              </li>
            </ul>
            <p className="text-foreground leading-relaxed mt-4">
              查爾斯有限公司不對因使用本 App 資訊而導致的任何損失或損害承擔責任。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4" data-testid="heading-account">
              5. 帳號責任
            </h2>
            <p className="text-foreground leading-relaxed">
              您需妥善保管您的帳號資訊，對您帳號下的所有活動負責。如發現帳號遭未經授權使用，請立即通知我們。我們對因帳號安全問題導致的損失不承擔責任，除非是由於我們的疏忽造成。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4" data-testid="heading-service-interruption">
              6. 服務中斷
            </h2>
            <p className="text-foreground leading-relaxed">
              我們會盡力維持 App 的穩定運作，但在以下情況下可能暫時中斷服務：
            </p>
            <ul className="space-y-2 mt-4">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">系統維護和更新</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">不可抗力因素（如天災、網路故障）</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">安全事件的應對處理</span>
              </li>
            </ul>
            <p className="text-foreground leading-relaxed mt-4">
              我們會在可能的情況下提前通知用戶，並盡快恢復服務。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4" data-testid="heading-modification">
              7. 條款修改
            </h2>
            <p className="text-foreground leading-relaxed">
              我們保留隨時修改本使用條款的權利。條款修改後，我們將透過 App 內通知或更新本頁面的方式告知用戶。繼續使用本 App 即表示您同意修改後的條款。如不同意新條款，請停止使用本 App。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4" data-testid="heading-law">
              8. 適用法律
            </h2>
            <p className="text-foreground leading-relaxed">
              本使用條款依中華民國（台灣）法律解釋和管轄。如有任何爭議，雙方同意以台灣台北地方法院為第一審管轄法院。
            </p>
          </section>

          <section className="bg-card rounded-lg border border-card-border p-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4" data-testid="heading-contact">
              9. 聯絡我們
            </h2>
            <p className="text-foreground leading-relaxed mb-4">
              如果您對本使用條款有任何疑問，請透過以下方式與我們聯繫：
            </p>
            <div className="space-y-2 text-foreground">
              <p><strong>公司名稱：</strong>查爾斯有限公司</p>
              <p>
                <strong>Email：</strong>
                <a
                  href="mailto:chaosmibu@gmail.com"
                  className="text-primary hover:underline"
                  data-testid="link-contact-email"
                >
                  chaosmibu@gmail.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </article>
    </Layout>
  );
}
