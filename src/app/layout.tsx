import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "스크린미터 · 한국 영화관 스크린 비교",
  description:
    "CGV·롯데시네마·메가박스 상영관 스크린 크기를 면적과 규격으로 비교하고, 사용자 제보로 업데이트합니다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <footer className="border-t py-8">
          <div className="mx-auto max-w-6xl px-4 text-center text-xs text-muted-foreground sm:px-6">
            스크린 규격은 참고용입니다. 리뉴얼·마스킹·실제 상영 비율에 따라 체감이 다를 수 있습니다.
            <br />
            출처·최종 확인일을 함께 표기하며, 제보는 승인 후 반영됩니다.
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
