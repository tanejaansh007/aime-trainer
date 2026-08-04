import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function Header() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-slate-900">
          AMC<span className="text-indigo-600">Trainer</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/review" className="text-slate-600 hover:text-slate-900">
            Review
          </Link>
          {user ? (
            <>
              <Link href="/profile" className="text-slate-600 hover:text-slate-900">
                Profile
              </Link>
              <span className="text-slate-400 hidden sm:inline">
                {user.name || user.email}
              </span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="text-slate-600 hover:text-slate-900"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-700"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
