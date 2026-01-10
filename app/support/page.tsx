import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageCircle, FileText, HelpCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "技術支援 | Mibu 旅遊扭蛋",
  description: "Mibu 旅遊扭蛋技術支援中心，提供常見問題解答和聯絡方式。",
};

const faqs = [
  {
    question: "如何開始使用 Mibu？",
    answer: "下載 Mibu App 後，使用 Google 或 Apple 帳號登入即可開始使用。首次使用可獲得免費扭蛋次數！",
  },
  {
    question: "扭蛋結果可以更換嗎？",
    answer: "每次扭蛋結果都是隨機產生的驚喜，無法更換。但您可以將不喜歡的景點跳過，下次扭蛋時不會再出現。",
  },
  {
    question: "如何成為合作商家？",
    answer: "請前往「商家合作」頁面了解詳情，或直接下載 App 申請商家帳號。審核通過後即可上架您的店家。",
  },
  {
    question: "訂閱方案可以取消嗎？",
    answer: "可以，您可以隨時在帳戶設定中取消訂閱。取消後，您仍可使用付費功能直到當期結束。",
  },
];

export default function SupportPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-foreground mb-4">技術支援</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          遇到問題？我們在這裡幫助您。查看常見問題或直接聯繫我們。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">電子郵件支援</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              有任何問題或建議？歡迎來信，我們會盡快回覆。
            </p>
            <a
              href="mailto:chaosmibu@gmail.com"
              className="text-primary hover:underline font-medium"
              data-testid="link-support-email"
            >
              chaosmibu@gmail.com
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">文件與政策</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              查看我們的服務條款和隱私權政策。
            </p>
            <div className="space-y-2">
              <Link href="/privacy" className="block text-primary hover:underline">
                隱私權政策
              </Link>
              <Link href="/terms" className="block text-primary hover:underline">
                服務條款
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">常見問題</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
