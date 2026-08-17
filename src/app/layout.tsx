import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { JsonLd } from "@/components/JsonLd";
import { Toaster } from "@/components/ui/sonner";
import { SITE_DESCRIPTION, SITE_NAME, SITE_NAME_EN, SITE_URL } from "@/lib/site";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} · 한국 영화관 스크린 비교`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "영화관 스크린 크기",
    "IMAX 스크린",
    "돌비시네마",
    "슈퍼플렉스",
    "CGV",
    "롯데시네마",
    "메가박스",
    "스크린 비교",
    SITE_NAME,
    SITE_NAME_EN,
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} · 한국 영화관 스크린 비교`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} · 한국 영화관 스크린 비교`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "iuYd8qmUvj8G7lWGtUSyVnzHxpaEvtys0hfhA0xXNnI",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            alternateName: SITE_NAME_EN,
            url: SITE_URL,
            description: SITE_DESCRIPTION,
            inLanguage: "ko-KR",
          }}
        />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <footer className="border-t py-8">
          <div className="mx-auto max-w-6xl px-4 text-center text-xs text-muted-foreground sm:px-6">
            스크린 규격은 참고용입니다. 리뉴얼·마스킹·실제 상영 비율에 따라 체감이 다를 수 있습니다.
            <br />
            출처·최종 확인일을 함께 표기하며, 제보는 승인 후 반영됩니다. *표시는 좌석배치·화면비 기반 추정입니다.
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
