"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SocialLoginButtons } from "@/components/common/SocialLoginButtons";
import { AlertCircle, Info } from "lucide-react";
import { useAuth, sanitizeRedirectUrl } from "@/hooks/useAuth";

const errorMessages: Record<string, { title: string; description: string }> = {
  ROLE_MISMATCH: {
    title: "帳號類型不符",
    description: "此帳號為一般用戶帳號，請使用商家帳號登入。如需申請商家帳號，請下載 App 進行申請。",
  },
  OAUTH_NEW_USER_TRAVELER_ONLY: {
    title: "帳號不存在",
    description: "此帳號尚未註冊為商家。請先下載 Mibu App 申請商家帳號。",
  },
  NEW_USER: {
    title: "帳號不存在",
    description: "此帳號尚未註冊。請先下載 Mibu App 申請商家帳號。",
  },
  INVALID_CREDENTIALS: {
    title: "登入失敗",
    description: "帳號或密碼錯誤，請重新嘗試。",
  },
  PENDING_APPROVAL: {
    title: "審核中",
    description: "您的商家帳號正在審核中，請耐心等待。審核通過後將以電子郵件通知。",
  },
  NETWORK_ERROR: {
    title: "網路錯誤",
    description: "無法連線至伺服器，請檢查網路連線後重試。",
  },
  AUTH_FAILED: {
    title: "驗證失敗",
    description: "登入驗證失敗，請確認您的帳號已在 Mibu App 中註冊為商家。",
  },
  UNKNOWN_ERROR: {
    title: "登入失敗",
    description: "登入過程發生錯誤，請稍後再試。如果持續發生，請聯繫客服。",
  },
};

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoggedIn } = useAuth();
  const [error, setError] = useState<{ code: string; message: string } | null>(null);

  const redirectTo = sanitizeRedirectUrl(searchParams.get('redirect'));

  useEffect(() => {
    if (isLoggedIn) {
      router.push(redirectTo);
    }
  }, [isLoggedIn, redirectTo, router]);

  const handleSuccess = (token: string, user: { id: string; email: string; name: string; role: string }) => {
    login(token, user);
    router.push(redirectTo);
  };

  const handleError = (code: string, message: string) => {
    setError({ code, message });
  };

  const errorInfo = error ? errorMessages[error.code] || { title: "錯誤", description: error.message } : null;

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-12 px-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl" data-testid="login-title">商家登入</CardTitle>
          <CardDescription>
            使用 Google 或 Apple 帳號登入商家後台
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && errorInfo && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{errorInfo.title}</AlertTitle>
              <AlertDescription>{errorInfo.description}</AlertDescription>
            </Alert>
          )}

          <SocialLoginButtons
            onSuccess={handleSuccess}
            onError={handleError}
          />

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>還沒有商家帳號？</AlertTitle>
            <AlertDescription>
              請先下載 Mibu App 申請商家帳號，審核通過後即可使用網頁版管理後台。
            </AlertDescription>
          </Alert>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              登入即表示您同意我們的{" "}
              <Link href="/terms" className="text-primary hover:underline">
                服務條款
              </Link>{" "}
              和{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                隱私權政策
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function MerchantLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center">
        <div className="text-muted-foreground">載入中...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
