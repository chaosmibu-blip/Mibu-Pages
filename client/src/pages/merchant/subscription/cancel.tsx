import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";

export default function SubscriptionCancelPage() {
  useSEO({
    title: "付款取消",
    description: "您已取消 Mibu 商家訂閱付款流程。",
  });

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10 text-muted-foreground" />
          </div>

          <h1
            className="text-2xl font-bold mt-6 text-foreground"
            data-testid="heading-cancel"
          >
            付款已取消
          </h1>
          <p className="text-muted-foreground mt-2" data-testid="text-cancel-message">
            您已取消付款流程，尚未產生任何費用。
          </p>

          <p className="text-sm text-muted-foreground mt-4">
            如果您有任何疑問，歡迎聯繫我們的客服團隊。
          </p>

          <div className="mt-6 space-y-3">
            <Link href="/pricing">
              <Button className="w-full" data-testid="button-retry">
                重新選擇方案
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full" data-testid="button-go-home">
                返回首頁
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
