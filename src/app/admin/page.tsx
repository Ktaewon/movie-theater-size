import type { Metadata } from "next";
import { AdminPanel } from "@/components/AdminPanel";

export const metadata: Metadata = {
  title: "제보 관리",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">제보 관리</h1>
        <p className="text-sm text-muted-foreground">
          기본 개발 키는 <code className="rounded bg-muted px-1.5 py-0.5">dev-admin</code> 입니다.
          배포 시 <code className="rounded bg-muted px-1.5 py-0.5">ADMIN_KEY</code> 환경변수를
          설정하세요.
        </p>
      </div>
      <AdminPanel />
    </div>
  );
}
