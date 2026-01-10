import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "退款與取消政策 | Mibu 旅遊扭蛋",
  description: "Mibu 退款與取消政策，包含取消訂閱、七天鑑賞期退款、年訂閱條款等相關規定。",
};

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
      <h1 className="text-3xl font-bold text-foreground mb-8">Mibu 退款與取消政策</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">政策概覽</h2>
          <p className="text-muted-foreground">
            本政策適用於透過 Mibu 官方網站購買的所有商家訂閱服務。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">一、取消政策</h2>
          
          <h3 className="text-lg font-medium text-foreground mt-6 mb-3">1.1 隨時取消</h3>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>您可以隨時取消訂閱，無需支付額外費用</li>
            <li>取消後，您的訂閱將持續有效至當期結束</li>
            <li>當期結束後，將自動停止扣款</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-6 mb-3">1.2 取消方式</h3>
          <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
            <li>登入商家後台</li>
            <li>前往「訂閱管理」頁面</li>
            <li>點擊「取消訂閱」按鈕</li>
            <li>確認取消</li>
          </ol>

          <h3 className="text-lg font-medium text-foreground mt-6 mb-3">1.3 取消後的權益</h3>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>取消立即生效，但服務持續至當期結束</li>
            <li>當期結束前仍可使用所有已付費功能</li>
            <li>資料將保留 30 天，之後刪除</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">二、退款政策</h2>
          
          <h3 className="text-lg font-medium text-foreground mt-6 mb-3">2.1 七天鑑賞期（符合台灣消費者保護法）</h3>
          <p className="text-muted-foreground mb-4">
            根據台灣《消費者保護法》第 19 條，線上購買之服務享有 7 天鑑賞期：
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-4 py-2 text-left font-semibold">條件</th>
                  <th className="border border-border px-4 py-2 text-left font-semibold">說明</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr>
                  <td className="border border-border px-4 py-2">適用對象</td>
                  <td className="border border-border px-4 py-2">首次訂閱的 B2C 消費者</td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-2">鑑賞期</td>
                  <td className="border border-border px-4 py-2">首次付款後 7 個日曆天內</td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-2">退款金額</td>
                  <td className="border border-border px-4 py-2">全額退款</td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-2">退款方式</td>
                  <td className="border border-border px-4 py-2">原支付方式退回</td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-2">處理時間</td>
                  <td className="border border-border px-4 py-2">5-10 個工作天</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-medium text-foreground mt-6 mb-3">2.2 退款條件</h3>
          <p className="text-muted-foreground mb-2">可申請退款的情況：</p>
          <ul className="list-none pl-0 text-muted-foreground space-y-1 mb-4">
            <li>✅ 首次付款後 7 天內申請</li>
            <li>✅ 帳戶未大量使用服務功能</li>
            <li>✅ 技術問題導致無法使用服務（需提供證明）</li>
          </ul>
          
          <p className="text-muted-foreground mb-2">不適用退款的情況：</p>
          <ul className="list-none pl-0 text-muted-foreground space-y-1">
            <li>❌ 超過 7 天鑑賞期</li>
            <li>❌ 已大量使用服務功能（如：建立超過 3 個優惠券）</li>
            <li>❌ 續訂期間（非首次訂閱）</li>
            <li>❌ 企業 B2B 訂閱（需另議）</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-6 mb-3">2.3 退款申請方式</h3>
          <p className="text-muted-foreground mb-2">
            <strong>Email 申請：</strong>發送郵件至{" "}
            <a href="mailto:chaosmibu@gmail.com" className="text-primary hover:underline">
              chaosmibu@gmail.com
            </a>
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
            <li>主旨：[退款申請] 您的商家名稱</li>
            <li>內容：訂閱帳號、退款原因、付款日期</li>
          </ul>
          <p className="text-muted-foreground">
            <strong>客服表單：</strong>填寫{" "}
            <Link href="/support" className="text-primary hover:underline">
              官網客服表單
            </Link>
          </p>

          <h3 className="text-lg font-medium text-foreground mt-6 mb-3">2.4 退款處理流程</h3>
          <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
            <span className="bg-muted px-3 py-1 rounded">申請提交</span>
            <span>→</span>
            <span className="bg-muted px-3 py-1 rounded">資格審核 (1-2 工作天)</span>
            <span>→</span>
            <span className="bg-muted px-3 py-1 rounded">退款處理 (3-5 工作天)</span>
            <span>→</span>
            <span className="bg-muted px-3 py-1 rounded">款項退回</span>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">三、年訂閱特別條款</h2>
          
          <h3 className="text-lg font-medium text-foreground mt-6 mb-3">3.1 年訂閱取消</h3>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>年訂閱可隨時取消，取消後享有至當年度結束</li>
            <li>取消不會立即終止服務</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-6 mb-3">3.2 年訂閱退款</h3>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li><strong>7 天內：</strong>全額退款</li>
            <li><strong>7 天後：</strong>不提供退款，但服務持續至當年度結束</li>
            <li><strong>特殊情況：</strong>經審核可酌情提供按比例退款</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">四、付款失敗處理</h2>
          
          <h3 className="text-lg font-medium text-foreground mt-6 mb-3">4.1 自動重試</h3>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>付款失敗後，系統將在 3 天內重試</li>
            <li>重試 3 次仍失敗，訂閱將自動暫停</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-6 mb-3">4.2 暫停與恢復</h3>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>暫停期間無法使用付費功能</li>
            <li>更新付款方式後可立即恢復</li>
            <li>暫停超過 30 天，訂閱將自動取消</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">五、聯絡方式</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-4 py-2 text-left font-semibold">管道</th>
                  <th className="border border-border px-4 py-2 text-left font-semibold">資訊</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr>
                  <td className="border border-border px-4 py-2">Email</td>
                  <td className="border border-border px-4 py-2">
                    <a href="mailto:chaosmibu@gmail.com" className="text-primary hover:underline">
                      chaosmibu@gmail.com
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-2">客服時間</td>
                  <td className="border border-border px-4 py-2">週一至週五 09:00-18:00 (台北時間)</td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-2">官網</td>
                  <td className="border border-border px-4 py-2">
                    <Link href="/support" className="text-primary hover:underline">
                      https://mibu-travel.com/support
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">六、政策更新</h2>
          <p className="text-muted-foreground">
            本政策最後更新日期：2026 年 1 月 9 日
          </p>
          <p className="text-muted-foreground mt-2">
            我們保留隨時修改本政策的權利。重大變更將提前 30 天通知用戶。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">附錄：法規依據</h2>
          
          <h3 className="text-lg font-medium text-foreground mt-6 mb-3">台灣消費者保護法第 19 條</h3>
          <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
            通訊交易或訪問交易之消費者，得於收受商品或接受服務後七日內，以退回商品或書面通知方式解除契約，無須說明理由及負擔任何費用或對價。
          </blockquote>
          <p className="text-muted-foreground mt-4">
            參考連結：
            <a
              href="https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0170001&flno=19"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline ml-1"
            >
              消費者保護法
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
