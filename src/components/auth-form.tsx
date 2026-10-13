"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { endpoints, saveToken } from "@/src/lib/api";
import { errorMessage } from "@/src/lib/utils";
export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  async function submit(form: FormData) {
    setBusy(true);
    setError("");
    const body: Record<string, string> = {};
    ["name", "email", "phone", "password", "password_confirmation"].forEach(
      (key) => {
        const v = form.get(key);
        if (v) body[key] = String(v);
      }
    );
    try {
      const result: any =
        mode === "login"
          ? await endpoints.login({
              email: body.email,
              password: body.password,
            })
          : await endpoints.register(body);
      const token =
        result?.token ??
        result?.access_token ??
        result?.data?.token ??
        result?.data?.access_token;
      if (token) saveToken(String(token));
      else if (mode === "register") {
        setError(
          "Бүртгэл үүссэн байж магадгүй. API token буцаасан эсэхийг шалгана уу. Нэвтрэх хэсгээр орж үзээрэй."
        );
        setBusy(false);
        return;
      } else
        throw new Error(
          "API хариунд нэвтрэх token олдсонгүй. Login response schema-г шалгана уу."
        );
      const destination = params.get("returnTo");
      router.push(
        destination?.startsWith("/") && !destination.startsWith("//")
          ? destination
          : "/profile"
      );
      router.refresh();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void submit(new FormData(e.currentTarget));
      }}
      className="card mx-auto w-full max-w-md p-6 sm:p-8"
    >
      <div className="mb-6">
        <p className="text-sm font-bold text-indigo-600">SUTAINBUYANT</p>
        <h1 className="mt-2 text-2xl font-black">
          {mode === "login" ? "Тавтай морил" : "Бүртгэл үүсгэх"}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {mode === "login"
            ? "Үргэлжлүүлэхийн тулд нэвтэрнэ үү."
            : "Хэрэглэгчийн мэдээллээ оруулна уу."}
        </p>
      </div>
      {mode === "register" && (
        <label className="form-label">
          Нэр
          <input
            name="name"
            required
            className="field mt-1"
            autoComplete="name"
          />
        </label>
      )}
      <label className="form-label mt-4">
        И-мэйл
        <input
          name="email"
          type="email"
          required
          className="field mt-1"
          autoComplete="email"
        />
      </label>
      {mode === "register" && (
        <label className="form-label mt-4">
          Утас
          <input name="phone" className="field mt-1" autoComplete="tel" />
        </label>
      )}
      <label className="form-label mt-4">
        Нууц үг
        <input
          name="password"
          type="password"
          required
          minLength={6}
          className="field mt-1"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />
      </label>
      {mode === "register" && (
        <label className="form-label mt-4">
          Нууц үг давтах
          <input
            name="password_confirmation"
            type="password"
            required
            minLength={6}
            className="field mt-1"
            autoComplete="new-password"
          />
        </label>
      )}
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
        >
          {error}
        </p>
      )}
      <button disabled={busy} className="btn-primary mt-6 w-full">
        {busy
          ? "Түр хүлээнэ үү..."
          : mode === "login"
          ? "Нэвтрэх"
          : "Бүртгүүлэх"}
      </button>
      <p className="mt-5 text-center text-sm text-slate-500">
        {mode === "login" ? "Бүртгэлгүй юу?" : "Бүртгэлтэй юу?"}{" "}
        <Link
          className="font-bold text-indigo-600"
          href={mode === "login" ? "/register" : "/login"}
        >
          {mode === "login" ? "Бүртгүүлэх" : "Нэвтрэх"}
        </Link>
      </p>
    </form>
  );
}
