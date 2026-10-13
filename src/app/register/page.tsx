import { Suspense } from "react";
import AuthForm from "@/src/components/auth-form";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="container-shell py-12">
          <p className="text-center text-sm text-slate-500">
            Бүртгэлийн хуудас ачааллаж байна...
          </p>
        </div>
      }
    >
      <div className="container-shell py-12">
        <AuthForm mode="register" />
      </div>
    </Suspense>
  );
}
