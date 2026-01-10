import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Shield, FileText, HelpCircle, MapPin, Dice6, Compass } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";

export default function Home() {
  useSEO({
    title: "旅行扭蛋 App - 隨機探索旅遊目的地",
    description: "Mibu 是一款創新的旅行扭蛋 App，讓您隨機抽取驚喜旅遊行程、收集世界各地景點、輕鬆規劃完美旅程。由查爾斯有限公司開發。"
  });

  return (
    <Layout>
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <Dice6 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="heading-home">
            Mibu
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-tagline">
            旅行扭蛋 App - 讓每一次旅行都充滿驚喜
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-16">
          <div className="bg-card rounded-lg border border-card-border p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Dice6 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">隨機抽取行程</h3>
            <p className="text-sm text-muted-foreground">
              像扭蛋一樣抽取旅遊目的地，探索意想不到的驚喜
            </p>
          </div>

          <div className="bg-card rounded-lg border border-card-border p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">收集景點</h3>
            <p className="text-sm text-muted-foreground">
              建立您的專屬景點收藏，記錄每一次美好回憶
            </p>
          </div>

          <div className="bg-card rounded-lg border border-card-border p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Compass className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">規劃旅程</h3>
            <p className="text-sm text-muted-foreground">
              輕鬆規劃完整行程，讓旅行更加順暢
            </p>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-card-border p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6 text-center" data-testid="heading-quick-links">
            快速連結
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/privacy">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2" data-testid="button-privacy">
                <Shield className="w-5 h-5 text-primary" />
                <span>隱私權政策</span>
              </Button>
            </Link>
            <Link href="/terms">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2" data-testid="button-terms">
                <FileText className="w-5 h-5 text-primary" />
                <span>使用條款</span>
              </Button>
            </Link>
            <Link href="/support">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2" data-testid="button-support">
                <HelpCircle className="w-5 h-5 text-primary" />
                <span>技術支援</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            由{" "}
            <span className="text-foreground font-medium">查爾斯有限公司</span>{" "}
            開發與維護
          </p>
        </div>
      </section>
    </Layout>
  );
}
