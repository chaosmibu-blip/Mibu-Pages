import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Mail, ShieldCheck, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "刪除帳戶 | Mibu 旅遊扭蛋",
  description: "了解如何申請刪除您的 Mibu 帳戶及相關資料。",
};

export default function DeleteAccountPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex p-3 rounded-full bg-destructive/10 mb-4">
          <Trash2 className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">刪除帳戶</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          您可以隨時申請刪除您的 Mibu 帳戶及所有相關資料。
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-md bg-primary/10 mt-1">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  如何申請刪除帳戶
                </h2>
                <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                  <li>
                    發送電子郵件至{" "}
                    <a
                      href="mailto:chaosmibu@gmail.com?subject=申請刪除 Mibu 帳戶"
                      className="text-primary hover:underline font-medium"
                    >
                      chaosmibu@gmail.com
                    </a>
                  </li>
                  <li>在郵件主旨填寫「申請刪除 Mibu 帳戶」</li>
                  <li>在郵件內容提供您的登入方式（Google 或 Apple）及對應的電子信箱</li>
                  <li>我們將在收到申請後 7 個工作日內處理您的請求</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-md bg-destructive/10 mt-1">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  刪除後會移除的資料
                </h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>個人資料（暱稱、頭像、電子信箱）</li>
                  <li>扭蛋紀錄與圖鑑收藏</li>
                  <li>旅行行程與景點資料</li>
                  <li>AI 對話紀錄</li>
                  <li>意見回饋紀錄</li>
                  <li>所有應用程式內的活動資料</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-md bg-primary/10 mt-1">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  注意事項
                </h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>帳戶刪除後無法復原，所有資料將被永久移除</li>
                  <li>處理時間為收到申請後 7 個工作日內</li>
                  <li>
                    如有任何疑問，請聯繫{" "}
                    <a
                      href="mailto:chaosmibu@gmail.com"
                      className="text-primary hover:underline font-medium"
                    >
                      chaosmibu@gmail.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
