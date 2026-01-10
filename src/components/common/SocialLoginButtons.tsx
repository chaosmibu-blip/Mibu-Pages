"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { SiGoogle, SiApple } from "react-icons/si";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface SocialLoginButtonsProps {
  onSuccess: (token: string, user: User) => void;
  onError: (code: string, message: string) => void;
  disabled?: boolean;
}

export function SocialLoginButtons({ onSuccess, onError, disabled = false }: SocialLoginButtonsProps) {
  const { toast } = useToast();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [googleInitialized, setGoogleInitialized] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const handleSocialLogin = useCallback(async (provider: "google" | "apple", idToken: string) => {
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

      if (!res.ok || !result.success) {
        const errorCode = result.code || "UNKNOWN_ERROR";
        onError(errorCode, result.message || result.error || "登入失敗");
        return;
      }

      onSuccess(result.token, result.user);
    } catch (error) {
      onError("NETWORK_ERROR", "網路連線錯誤，請稍後再試");
    }
  }, [API_URL, onSuccess, onError]);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    let attempts = 0;
    const maxAttempts = 50;

    const initGoogle = () => {
      attempts++;
      const google = (window as any).google;
      
      if (!google?.accounts?.id) {
        if (attempts < maxAttempts) {
          setTimeout(initGoogle, 100);
        }
        return;
      }

      try {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: { credential: string }) => {
            setGoogleLoading(true);
            await handleSocialLogin("google", response.credential);
            setGoogleLoading(false);
          },
          ux_mode: "popup",
        });

        if (googleButtonRef.current) {
          google.accounts.id.renderButton(
            googleButtonRef.current,
            {
              type: "standard",
              theme: "outline",
              size: "large",
              text: "signin_with",
              shape: "rectangular",
              width: googleButtonRef.current.offsetWidth,
            }
          );
        }

        setGoogleInitialized(true);
      } catch (err) {
        console.error("Google Sign-In init error:", err);
      }
    };

    initGoogle();
  }, [handleSocialLogin]);

  const handleAppleLogin = async () => {
    const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
    
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
      <div className="relative w-full">
        <div 
          ref={googleButtonRef} 
          className="w-full [&>div]:!w-full [&>div>div]:!w-full"
          style={{ minHeight: "44px" }}
        />
        {!googleInitialized && (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <Button type="button" className="w-full" disabled data-testid="button-google-login">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              載入中...
            </Button>
          </div>
        )}
        {googleLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Button type="button" className="w-full" disabled data-testid="button-google-login">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              登入中...
            </Button>
          </div>
        )}
      </div>
      
      <Button
        type="button"
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
        {appleLoading ? "登入中..." : "使用 Apple 登入"}
      </Button>
    </div>
  );
}
