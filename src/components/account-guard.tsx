"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getToken } from "@/src/lib/api";
export default function AccountGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!getToken())
      router.replace(`/login?returnTo=${encodeURIComponent(pathname)}`);
    else setReady(true);
  }, [router, pathname]);
  if (!ready)
    return (
      <div className="container-shell py-20 text-center text-sm text-slate-500">
        Нэвтрэлтийг шалгаж байна...
      </div>
    );
  return <>{children}</>;
}
