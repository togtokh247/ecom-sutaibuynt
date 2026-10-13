"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AccountGuard from "@/src/components/account-guard";
import { endpoints, one, saveToken } from "@/src/lib/api";
import { errorMessage } from "@/src/lib/utils";
function ProfileContent() {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  useEffect(() => {
    endpoints
      .profile()
      .then((r) => setProfile(one(r, "profile") || r))
      .catch((e) => setError(errorMessage(e)));
  }, []);
  async function update(form: FormData) {
    setBusy(true);
    setError("");
    setMessage("");
    const body: Record<string, string> = {};
    ["name", "email", "phone"].forEach((k) => {
      const v = form.get(k);
      if (v !== null) body[k] = String(v);
    });
    try {
      const r = await endpoints.updateProfile(body);
      setProfile(one(r, "profile") || r);
      setMessage("Профайл шинэчлэгдлээ.");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  async function password(form: FormData) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await endpoints.changePassword({
        current_password: String(form.get("current_password") || ""),
        password: String(form.get("password") || ""),
        password_confirmation: String(form.get("password_confirmation") || ""),
      });
      setMessage("Нууц үг шинэчлэгдлээ.");
      (document.getElementById("password-form") as HTMLFormElement)?.reset();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    setBusy(true);
    try {
      await endpoints.logout();
    } catch {
    } finally {
      saveToken(null);
      router.replace("/");
      router.refresh();
      setBusy(false);
    }
  }
  return (
    <div className="container-shell py-8">
      <h1 className="text-3xl font-black">Миний профайл</h1>
      <p className="mt-2 text-sm text-slate-500">
        Хувийн мэдээлэл болон нууц үгээ удирдах.
      </p>
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
        >
          {error}
        </p>
      )}
      {message && (
        <p
          role="status"
          className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700"
        >
          {message}
        </p>
      )}
      <div className="mt-6 grid items-start gap-5 lg:grid-cols-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void update(new FormData(e.currentTarget));
          }}
          className="card p-5"
        >
          <h2 className="mb-4 font-extrabold">Хувийн мэдээлэл</h2>
          {["name", "email", "phone"].map((k) => (
            <label key={k} className="form-label mt-3">
              {({ name: "Нэр", email: "И-мэйл", phone: "Утас" } as any)[k]}
              <input
                name={k}
                type={k === "email" ? "email" : "text"}
                defaultValue={profile?.[k] || ""}
                className="field mt-1"
              />
            </label>
          ))}
          <button disabled={busy} className="btn-primary mt-5 w-full">
            Мэдээлэл хадгалах
          </button>
        </form>
        <form
          id="password-form"
          onSubmit={(e) => {
            e.preventDefault();
            void password(new FormData(e.currentTarget));
          }}
          className="card p-5"
        >
          <h2 className="mb-4 font-extrabold">Нууц үг солих</h2>
          <label className="form-label">
            Одоогийн нууц үг
            <input
              name="current_password"
              type="password"
              required
              className="field mt-1"
            />
          </label>
          <label className="form-label mt-3">
            Шинэ нууц үг
            <input
              name="password"
              type="password"
              minLength={8}
              required
              className="field mt-1"
            />
          </label>
          <label className="form-label mt-3">
            Шинэ нууц үг давтах
            <input
              name="password_confirmation"
              type="password"
              minLength={8}
              required
              className="field mt-1"
            />
          </label>
          <button disabled={busy} className="btn-primary mt-5 w-full">
            Нууц үг шинэчлэх
          </button>
        </form>
      </div>
      <button
        disabled={busy}
        onClick={logout}
        className="btn-secondary mt-5 text-rose-600"
      >
        Гарах
      </button>
    </div>
  );
}
export default function ProfilePage() {
  return (
    <AccountGuard>
      <ProfileContent />
    </AccountGuard>
  );
}
