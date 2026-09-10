import { login } from "./actions";

export const metadata = {
  title: "Login | Admin",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 text-cream">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-semibold text-cream">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-cream/50">
            Sign in to manage your portfolio content
          </p>
        </div>

        <form
          action={login}
          className="space-y-4 rounded-2xl border border-white/10 bg-card p-6 shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
        >
          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-cream/50"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-white/10 bg-bg px-3.5 py-2.5 text-sm text-cream outline-none transition-colors focus:border-gold/60"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-cream/50"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-white/10 bg-bg px-3.5 py-2.5 text-sm text-cream outline-none transition-colors focus:border-gold/60"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-gold-light"
          >
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}
