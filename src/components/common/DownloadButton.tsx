"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SiApple, SiGoogleplay } from "react-icons/si";

interface DownloadButtonProps {
  platform: "ios" | "android";
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function DownloadButton({
  platform,
  variant = "outline",
  size = "default",
  className = "",
}: DownloadButtonProps) {
  const { toast } = useToast();

  const handleClick = () => {
    if (platform === "ios") {
      window.open("https://apps.apple.com/us/app/mibu/id6756925221", "_blank");
    } else {
      toast({
        title: "敬請期待",
        description: "Android 版本即將推出，敬請期待！",
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
      data-testid={`button-download-${platform}`}
    >
      {platform === "ios" ? (
        <>
          <SiApple className="mr-2 h-4 w-4" />
          App Store
        </>
      ) : (
        <>
          <SiGoogleplay className="mr-2 h-4 w-4" />
          Google Play
        </>
      )}
    </Button>
  );
}
