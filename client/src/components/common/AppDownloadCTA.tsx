import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { SiApple } from "react-icons/si";
import { FaGooglePlay } from "react-icons/fa";
import { Smartphone, Sparkles } from "lucide-react";

interface AppDownloadCTAProps {
  variant?: "default" | "compact";
  className?: string;
}

export function AppDownloadCTA({ variant = "default", className = "" }: AppDownloadCTAProps) {
  const { toast } = useToast();

  const handleIOSClick = () => {
    window.open("https://apps.apple.com/app/mibu", "_blank");
  };

  const handleAndroidClick = () => {
    toast({
      title: "敬請期待",
      description: "Android 版本即將推出，敬請期待！",
    });
  };

  if (variant === "compact") {
    return (
      <div className={`flex flex-col sm:flex-row items-center gap-3 ${className}`}>
        <Button onClick={handleIOSClick} variant="outline" data-testid="button-download-ios">
          <SiApple className="mr-2 h-4 w-4" />
          App Store
        </Button>
        <Button onClick={handleAndroidClick} variant="outline" data-testid="button-download-android">
          <FaGooglePlay className="mr-2 h-4 w-4" />
          Google Play
        </Button>
      </div>
    );
  }

  return (
    <section className={`py-12 md:py-16 bg-primary/5 ${className}`}>
      <div className="max-w-5xl mx-auto px-6">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-1 p-8 md:p-10 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium mb-4">
                  <Sparkles className="h-4 w-4" />
                  免費下載
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  用 Mibu 探索更多
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  下載 Mibu App，用旅遊扭蛋的方式發現隱藏的好去處。
                  讓每一趟旅程都充滿驚喜！
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Button
                    size="lg"
                    onClick={handleIOSClick}
                    data-testid="button-cta-ios"
                  >
                    <SiApple className="mr-2 h-5 w-5" />
                    App Store 下載
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleAndroidClick}
                    data-testid="button-cta-android"
                  >
                    <FaGooglePlay className="mr-2 h-5 w-5" />
                    Google Play 下載
                  </Button>
                </div>
              </div>
              <div className="hidden md:flex w-64 h-64 bg-gradient-to-br from-primary/20 to-primary/5 items-center justify-center">
                <Smartphone className="h-24 w-24 text-primary/40" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
