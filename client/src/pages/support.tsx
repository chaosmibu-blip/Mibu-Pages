import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Mail, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/use-seo";

const faqItems = [
  {
    id: "delete-account",
    question: "如何刪除我的帳號？",
    answer:
      "您可以在 App 內的「設定」>「帳號」>「刪除帳號」中刪除您的帳號。刪除後，您的所有資料將被永久移除，且無法恢復。如果您使用 Apple 登入，也可以在 Apple ID 設定中管理您的帳號授權。",
  },
  {
    id: "location-permission",
    question: "如何取消位置授權？",
    answer:
      "iOS 用戶：前往「設定」>「隱私權」>「位置服務」> 找到 Mibu > 選擇「永不」。Android 用戶：前往「設定」>「應用程式」> Mibu >「權限」>「位置」> 選擇「拒絕」。取消位置授權後，您仍可使用 App，但無法獲得附近景點推薦功能。",
  },
  {
    id: "gacha-mechanism",
    question: "扭蛋的抽獎機制是什麼？",
    answer:
      "Mibu 的扭蛋系統會根據您的偏好設定、季節、天氣等因素，從我們的景點資料庫中隨機選擇適合的旅遊目的地。每次抽取都是獨立的，您可能會抽到重複的景點，這些景點會自動加入您的收藏中。",
  },
  {
    id: "offline-usage",
    question: "可以離線使用嗎？",
    answer:
      "基本的瀏覽功能需要網路連線。但您已收藏的景點資訊和行程規劃可以離線查看。建議在有網路時先下載您需要的景點資料，以便在旅途中使用。",
  },
  {
    id: "data-sync",
    question: "我的資料會在不同裝置間同步嗎？",
    answer:
      "是的！只要您使用相同的帳號登入，您的收藏、行程規劃和使用偏好都會在所有裝置間自動同步。",
  },
];

export default function Support() {
  useSEO({
    title: "技術支援",
    description: "Mibu App 技術支援中心。常見問題解答、問題回報表單及聯絡方式。Email: chaosmibu@gmail.com"
  });

  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/mqekqqlp", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast({
          title: "訊息已送出",
          description: "我們會盡快回覆您的問題。",
        });
      } else {
        throw new Error("Failed to submit");
      }
    } catch {
      toast({
        title: "送出失敗",
        description: "請稍後再試，或直接發送 Email 給我們。",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitted(false);
  };

  return (
    <Layout>
      <article className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <header className="mb-12">
          <div className="w-16 h-1 bg-primary mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="heading-support">
            技術支援
          </h1>
          <p className="text-muted-foreground" data-testid="text-support-intro">
            遇到問題嗎？我們在這裡幫助您。
          </p>
        </header>

        <div className="space-y-16">
          <section className="bg-card rounded-lg border border-card-border p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground" data-testid="heading-contact-us">
                聯絡我們
              </h2>
            </div>
            <p className="text-foreground leading-relaxed mb-4">
              如有任何問題、建議或意見，歡迎透過以下方式與我們聯繫：
            </p>
            <a
              href="mailto:chaosmibu@gmail.com"
              className="inline-flex items-center gap-2 text-lg text-primary hover:underline font-medium"
              data-testid="link-support-email"
            >
              <Mail className="w-5 h-5" />
              chaosmibu@gmail.com
            </a>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6" data-testid="heading-faq">
              常見問題 FAQ
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item) => (
                <AccordionItem key={item.id} value={item.id} className="border-b border-border">
                  <AccordionTrigger
                    className="text-left text-foreground hover:text-primary py-4"
                    data-testid={`accordion-trigger-${item.id}`}
                  >
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent
                    className="text-muted-foreground leading-relaxed pb-4"
                    data-testid={`accordion-content-${item.id}`}
                  >
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6" data-testid="heading-report">
              回報問題
            </h2>
            <div className="bg-card rounded-lg border border-card-border p-6 md:p-8 max-w-2xl">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2" data-testid="text-submit-success">
                    感謝您的訊息！
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    我們已收到您的問題回報，將會盡快回覆您。
                  </p>
                  <Button onClick={resetForm} variant="outline" data-testid="button-submit-another">
                    提交另一個問題
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground">
                        姓名
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="請輸入您的姓名"
                        className="border-2 focus:border-primary"
                        data-testid="input-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@email.com"
                        className="border-2 focus:border-primary"
                        data-testid="input-email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-foreground">
                      主旨
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="請簡述您的問題"
                      className="border-2 focus:border-primary"
                      data-testid="input-subject"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-foreground">
                      訊息內容
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="請詳細描述您遇到的問題..."
                      rows={5}
                      className="border-2 focus:border-primary resize-none"
                      data-testid="textarea-message"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto"
                    data-testid="button-submit"
                  >
                    {isSubmitting ? (
                      "送出中..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        送出訊息
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </section>

          <section className="text-center py-8 border-t border-border">
            <p className="text-sm text-muted-foreground" data-testid="text-version">
              Mibu App 版本 1.0.0
            </p>
          </section>
        </div>
      </article>
    </Layout>
  );
}
