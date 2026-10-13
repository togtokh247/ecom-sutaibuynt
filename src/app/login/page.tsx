import { Suspense } from "react";
import AuthForm from "@/src/components/auth-form";
export default function LoginPage() {
  return (
    <div className="container-shell py-12">
      <Suspense fallback={<div className="text-center">Ачааллаж байна...</div>}>
        <AuthForm mode="login" />
      </Suspense>
    </div>
  );
}
