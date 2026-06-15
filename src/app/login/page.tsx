import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AuthForm from "@/components/AuthForm";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/profile");

  return (
    <div className="max-w-sm mx-auto">
      <AuthForm />
    </div>
  );
}
