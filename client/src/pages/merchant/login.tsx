import { useState, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSEO } from "@/hooks/use-seo";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Store, Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { DownloadButton } from "@/components/common/DownloadButton";
import { SocialLoginButtons } from "@/components/common/SocialLoginButtons";

const loginSchema = z.object({
  email: z.string().email("請輸入有效的電子郵件"),
  password: z.string().min(6, "密碼至少需要 6 個字元"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const errorMessages: Record<string, string> = {
  INVALID_CREDENTIALS: "帳號或密碼錯誤",
  PENDING_APPROVAL: "帳號審核中，請等待管理員核准",
  ROLE_MISMATCH: "此帳號不是商家帳號，請使用 App 登入",
  NEW_USER: "請下載 App 註冊商家帳號",
};

export default function MerchantLoginPage() {
  useSEO({
    title: "商家登入",
    description: "登入 Mibu 商家後台，管理您的店家資訊和訂閱方案。",
  });

  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const [isLoading, setIsLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const searchParams = new URLSearchParams(searchString);
  const redirectUrl = searchParams.get("redirect") || "/merchant/dashboard";

  const API_URL = import.meta.env.VITE_API_URL || "";

  const { data: authStatus, isLoading: authLoading } = useQuery<{ authenticated: boolean }>({
    queryKey: ["merchant-verify"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/merchant/verify`, {
        credentials: "include",
      });
      return res.json();
    },
  });

  useEffect(() => {
    if (!authLoading && authStatus?.authenticated) {
      setLocation(redirectUrl);
    }
  }, [authStatus, authLoading, redirectUrl, setLocation]);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginSuccess = () => {
    toast({
      title: "登入成功",
      description: "正在跳轉至商家後台...",
    });
    setLocation(redirectUrl);
  };

  const handleLoginError = (code: string, message: string) => {
    setErrorCode(code);
    toast({
      title: "登入失敗",
      description: errorMessages[code] || message,
      variant: "destructive",
    });
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorCode(null);

    try {
      const res = await fetch(`${API_URL}/api/merchant/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, target_role: "merchant" }),
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) {
        const code = result.code || "";
        handleLoginError(code, result.message || "登入失敗");
        return;
      }

      handleLoginSuccess();
    } catch (error) {
      handleLoginError("NETWORK_ERROR", "網路連線錯誤");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  const showDownloadPrompt = errorCode === "NEW_USER" || errorCode === "ROLE_MISMATCH";

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex">
        <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
          <div className="max-w-md text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Store className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Mibu 商家平台
            </h2>
            <p className="text-white/80 text-lg">
              管理訂閱，查看權限，提升您的店家曝光率
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center py-12 px-6">
          <div className="w-full max-w-md">
            <div className="text-center mb-8 lg:hidden">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Store className="h-8 w-8 text-primary" />
              </div>
              <h1
                className="text-2xl font-bold text-foreground"
                data-testid="heading-login"
              >
                商家登入
              </h1>
              <p className="text-muted-foreground mt-2">
                登入您的商家帳戶以管理店家資訊
              </p>
            </div>

            <div className="hidden lg:block mb-8">
              <h1
                className="text-2xl font-bold text-foreground"
                data-testid="heading-login-desktop"
              >
                歡迎回來
              </h1>
              <p className="text-muted-foreground mt-2">
                登入您的商家帳戶
              </p>
            </div>

            {showDownloadPrompt && (
              <Card className="mb-6 border-destructive/50 bg-destructive/5">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">
                        {errorCode === "NEW_USER" ? "尚未註冊" : "非商家帳號"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {errorCode === "NEW_USER" 
                          ? "請先下載 Mibu App 完成商家帳號註冊"
                          : "此帳號為一般旅客帳號，請使用 App 登入或註冊商家帳號"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <DownloadButton platform="ios" />
                    <DownloadButton platform="android" />
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>社群帳號登入</CardTitle>
                <CardDescription>
                  使用 Google 或 Apple 快速登入
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SocialLoginButtons
                  onSuccess={handleLoginSuccess}
                  onError={handleLoginError}
                  disabled={isLoading}
                />
              </CardContent>
            </Card>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  或使用電子郵件
                </span>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>帳戶登入</CardTitle>
                <CardDescription>
                  輸入您的電子郵件和密碼
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>電子郵件</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="email"
                                placeholder="your@email.com"
                                className="pl-10"
                                data-testid="input-email"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>密碼</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="password"
                                placeholder="••••••••"
                                className="pl-10"
                                data-testid="input-password"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                      data-testid="button-login"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          登入中...
                        </>
                      ) : (
                        <>
                          登入
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {!showDownloadPrompt && (
              <Card className="mt-6">
                <CardContent className="pt-6">
                  <p className="text-center text-sm text-muted-foreground mb-4">
                    還沒有商家帳號？請下載 App 完成商家註冊
                  </p>
                  <div className="flex gap-3 justify-center">
                    <DownloadButton platform="ios" />
                    <DownloadButton platform="android" />
                  </div>
                </CardContent>
              </Card>
            )}

            <p className="text-center text-sm text-muted-foreground mt-6">
              遇到問題？
              <a
                href="mailto:chaosmibu@gmail.com"
                className="text-primary hover:underline ml-1"
              >
                聯繫客服
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
