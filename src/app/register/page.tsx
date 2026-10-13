import AuthForm from "@/src/components/auth-form";
export default function RegisterPage() {
  return (
    <div className="container-shell py-12">
      <AuthForm mode="register" />
    </div>
  );
}
