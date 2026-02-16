import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { GraduationCap, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    const success = await login(email, password);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left — Branding */}
      <div className="hidden w-1/2 items-center justify-center gradient-hero p-12 lg:flex">
        <div className="max-w-md animate-fade-in">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
              <GraduationCap className="h-7 w-7 text-accent-foreground" />
            </div>
            <span className="font-display text-3xl font-bold text-primary-foreground">
              Talentra
            </span>
          </div>
          <h2 className="mb-4 font-display text-4xl font-bold leading-tight text-primary-foreground">
            Campus Recruitment,
            <br />
            <span className="text-accent">Simplified.</span>
          </h2>
          <p className="text-lg text-primary-foreground/70">
            Streamline your placement process from eligibility checks to final
            offers. One platform for students, admins, and recruiters.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { n: "2,400+", l: "Students Placed" },
              { n: "180+", l: "Companies" },
              { n: "95%", l: "Placement Rate" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-lg bg-primary-foreground/10 p-4 backdrop-blur"
              >
                <p className="font-display text-xl font-bold text-primary-foreground">
                  {s.n}
                </p>
                <p className="text-xs text-primary-foreground/60">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex w-full flex-col items-center justify-center px-8 lg:w-1/2">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-2 flex items-center gap-2 lg:hidden">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">
              Talentra
            </span>
          </div>
          <h3 className="font-display text-2xl font-bold text-foreground">
            Welcome back
          </h3>
          <p className="mb-8 text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
