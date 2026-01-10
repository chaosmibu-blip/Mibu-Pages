import { Layout } from "@/components/Layout";
import { useSEO } from "@/hooks/use-seo";

export default function PrivacyPolicy() {
  useSEO({
    title: "隱私權政策",
    description: "了解 Mibu App 如何收集、使用和保護您的個人資料。包含資料收集、用途、安全措施及用戶權利說明。"
  });

  return (
    <Layout>
      <article className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <header className="mb-12">
          <div className="w-16 h-1 bg-primary mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="heading-privacy">
            隱私權政策
          </h1>
          <p className="text-muted-foreground" data-testid="text-privacy-intro">
            本隱私權政策說明 Mibu App 如何收集、使用和保護您的個人資料。
          </p>
          <p className="text-sm text-muted-foreground mt-2" data-testid="text-last-updated">
            最後更新日期：2025 年 12 月
          </p>
        </header>

        <div className="prose prose-lg max-w-none space-y-10">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4" data-testid="heading-intro">
              1. 簡介
            </h2>
            <p className="text-foreground leading-relaxed">
              歡迎使用 Mibu！Mibu 是一款由查爾斯有限公司開發的旅行扭蛋 App，用戶可以隨機抽取旅遊行程、收集景點、規劃旅程。我們重視您的隱私，並致力於保護您的個人資料。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4" data-testid="heading-data-collected">
              2. 收集的資料
            </h2>
            <p className="text-foreground leading-relaxed mb-4">
              為了提供更好的服務，我們可能會收集以下資料：
            </p>
            <div className="bg-card rounded-lg border border-card-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">資料類型</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">收集目的</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 text-foreground">Email 地址</td>
                    <td className="px-4 py-3 text-muted-foreground">用於帳號註冊與登入、接收重要通知</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-foreground">位置資訊</td>
                    <td className="px-4 py-3 text-muted-foreground">用於推薦附近景點（需用戶明確授權）</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-foreground">Apple ID</td>
                    <td className="px-4 py-3 text-muted-foreground">透過 Apple 登入進行身份驗證</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-foreground">使用行為資料</td>
                    <td className="px-4 py-3 text-muted-foreground">改善 App 功能與用戶體驗</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4" data-testid="heading-data-usage">
              3. 資料用途
            </h2>
            <p className="text-foreground leading-relaxed mb-4">
              我們收集的資料將用於以下目的：
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">帳號管理與身份驗證</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">推薦個人化的旅遊景點與行程</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">分析與改善 App 服務品質</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">發送重要的服務通知與更新</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4" data-testid="heading-data-sharing">
              4. 資料分享
            </h2>
            <p className="text-foreground leading-relaxed mb-4">
              我們<strong>不會出售</strong>您的個人資料給任何第三方。在以下情況下，我們可能會分享您的資料：
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">使用第三方分析服務（如 Firebase Analytics）以改善服務</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">法律要求或政府機關依法調取</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">保護我們的權利、財產或安全</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4" data-testid="heading-data-security">
              5. 資料安全
            </h2>
            <p className="text-foreground leading-relaxed">
              我們採取適當的技術和組織措施來保護您的個人資料，包括：
            </p>
            <ul className="space-y-2 mt-4">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">使用 SSL/TLS 加密傳輸所有資料</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">將資料儲存在安全的伺服器上</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">定期審查和更新我們的安全措施</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4" data-testid="heading-user-rights">
              6. 用戶權利
            </h2>
            <p className="text-foreground leading-relaxed mb-4">
              您對您的個人資料擁有以下權利：
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">隨時在 App 設定中刪除您的帳號和所有相關資料</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">在裝置設定中取消位置授權</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-foreground">請求存取、更正或刪除您的個人資料</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4" data-testid="heading-children">
              7. 兒童隱私
            </h2>
            <p className="text-foreground leading-relaxed">
              Mibu App 不適用於 13 歲以下的用戶。我們不會故意收集 13 歲以下兒童的個人資料。如果我們發現已收集兒童的資料，將立即刪除。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4" data-testid="heading-updates">
              8. 政策更新
            </h2>
            <p className="text-foreground leading-relaxed">
              我們可能會不時更新本隱私權政策。當政策發生重大變更時，我們將透過 App 內通知或 Email 通知您。建議您定期查閱本政策以了解最新資訊。
            </p>
          </section>

          <section className="bg-card rounded-lg border border-card-border p-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4" data-testid="heading-contact">
              9. 聯絡我們
            </h2>
            <p className="text-foreground leading-relaxed mb-4">
              如果您對本隱私權政策有任何疑問，請透過以下方式與我們聯繫：
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
