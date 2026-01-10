import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { SiGoogle, SiApple } from "react-icons/si";

interface SocialLoginButtonsProps {
  onSuccess: () => void;
  onError: (code: string, message: string) => void;
  disabled?: boolean;
}

export function SocialLoginButtons({ onSuccess, onError, disabled = false }: SocialLoginButtonsProps) {
  const { toast } = useToast();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "";

  const handleSocialLogin = async (provider: "google" | "apple", idToken: string) => {
    const endpoint = provider === "google" ? "/api/auth/google" : "/api/auth/apple";
    
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          targetPortal: "merchant",
        }),
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        const errorCode = result.code || "UNKNOWN_ERROR";
        onError(errorCode, result.message || "登入失敗");
        return;
      }

      onSuccess();
    } catch (error) {
      onError("NETWORK_ERROR", "網路連線錯誤，請稍後再試");
    }
  };

  const handleGoogleLogin = async () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      toast({
        title: "設定錯誤",
        description: "Google 登入尚未設定完成",
        variant: "destructive",
      });
      return;
    }

    setGoogleLoading(true);

    try {
      const google = (window as any).google;
      
      if (!google?.accounts?.id) {
        toast({
          title: "載入失敗",
          description: "Google 登入元件載入失敗，請重新整理頁面",
          variant: "destructive",
        });
        return;
      }

      google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: { credential: string }) => {
          await handleSocialLogin("google", response.credential);
          setGoogleLoading(false);
        },
      });

      google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setGoogleLoading(false);
          toast({
            title: "Google 登入",
            description: "請允許彈出視窗或稍後再試",
            variant: "destructive",
          });
        }
      });
    } catch (error) {
      setGoogleLoading(false);
      toast({
        title: "登入失敗",
        description: "Google 登入發生錯誤",
        variant: "destructive",
      });
    }
  };

  const handleAppleLogin = async () => {
    const clientId = import.meta.env.VITE_APPLE_CLIENT_ID;
    
    if (!clientId) {
      toast({
        title: "設定錯誤",
        description: "Apple 登入尚未設定完成",
        variant: "destructive",
      });
      return;
    }

    setAppleLoading(true);

    try {
      const AppleID = (window as any).AppleID;
      
      if (!AppleID?.auth) {
        toast({
          title: "載入失敗",
          description: "Apple 登入元件載入失敗，請重新整理頁面",
          variant: "destructive",
        });
        setAppleLoading(false);
        return;
      }

      AppleID.auth.init({
        clientId,
        scope: "name email",
        redirectURI: window.location.origin + "/merchant/login",
        usePopup: true,
      });

      const response = await AppleID.auth.signIn();
      await handleSocialLogin("apple", response.authorization.id_token);
    } catch (error: any) {
      if (error?.error !== "popup_closed_by_user") {
        toast({
          title: "登入失敗",
          description: "Apple 登入發生錯誤",
          variant: "destructive",
        });
      }
    } finally {
      setAppleLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleLogin}
        disabled={disabled || googleLoading || appleLoading}
        data-testid="button-google-login"
      >
        {googleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <SiGoogle className="mr-2 h-4 w-4" />
        )}
        使用 Google 登入
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleAppleLogin}
        disabled={disabled || googleLoading || appleLoading}
        data-testid="button-apple-login"
      >
        {appleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <SiApple className="mr-2 h-4 w-4" />
        )}
        使用 Apple 登入
      </Button>
    </div>
  );
}
