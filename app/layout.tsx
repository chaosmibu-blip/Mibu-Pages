import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Mibu - 旅遊扭蛋",
    template: "%s | Mibu",
  },
  description: "用旅遊扭蛋的方式探索世界，發現隱藏的好去處。Mibu 讓每趟旅程都充滿驚喜！",
  keywords: ["旅遊", "扭蛋", "景點", "旅行", "探索", "Mibu"],
  authors: [{ name: "查爾斯有限公司" }],
  openGraph: {
    title: "Mibu - 旅遊扭蛋",
    description: "用旅遊扭蛋的方式探索世界，發現隱藏的好去處。",
    url: "https://mibu-travel.com",
    siteName: "Mibu",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "https://mibu-travel.com/icon.jpg",
        width: 512,
        height: 512,
        alt: "Mibu - 旅遊扭蛋",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Mibu - 旅遊扭蛋",
    description: "用旅遊扭蛋的方式探索世界，發現隱藏的好去處。",
    images: ["https://mibu-travel.com/icon.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.jpg" />
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        />
        <script
          src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
          async
          defer
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
