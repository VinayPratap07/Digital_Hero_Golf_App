import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { FiArrowRight, FiLock, FiMail, FiEye, FiEyeOff } from "react-icons/fi";
import { logIn } from "../Services/auth.service";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../Lib/SupaBase";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: () => logIn(formData.email, formData.password),

    onSuccess: async (data) => {
      const { data: subscription, error: subscriptionError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (subscriptionError) {
        console.error(subscriptionError.message);
        return;
      }

      navigate("/");
    },

    onError: (error: any) => {
      console.error("Login failed:", error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <main className="min-h-screen w-full bg-[#edf2ee] text-neutral-900 flex flex-col justify-between p-4 sm:p-8 antialiased selection:bg-neutral-900 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-2">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center text-xs font-black text-white">
            D
          </div>
          <span className="text-[15px] font-bold tracking-tight text-neutral-900">
            Digital Heroes
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 hidden sm:inline">
            Don't have an account?
          </span>
          <Link
            to="/Signup"
            className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            Register ↗
          </Link>
        </div>
      </header>

      {/* Main Container Card */}
      <div className="w-full max-w-4xl mx-auto my-auto py-8">
        <div className="relative rounded-[2rem] border-2 border-black bg-white p-8 sm:p-12 md:p-14 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          {/* Badge */}
          <div className="absolute -top-3.5 left-8 bg-black text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <span>★</span>
            <span>Member Access</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Form */}
            <div className="lg:col-span-7">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950">
                  Welcome back.
                </h1>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Log in to track your rounds, view monthly charity pools, and
                  verify your leaderboard standing.
                </p>
              </div>

              {loginMutation.isError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
                  {(loginMutation.error as any)?.message ||
                    "Invalid credentials. Please verify and try again."}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Email Address */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold uppercase tracking-wider text-neutral-700"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="player@digitalheroes.com"
                      className="w-full rounded-xl border border-neutral-300 bg-neutral-50/50 pl-11 pr-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-bold uppercase tracking-wider text-neutral-700"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••••••"
                      className="w-full rounded-xl border border-neutral-300 bg-neutral-50/50 pl-11 pr-11 py-3 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors p-1"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-4 w-4" />
                      ) : (
                        <FiEye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full mt-2 flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-neutral-800 active:scale-[0.99] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  <span>
                    {loginMutation.isPending ? "Signing in..." : "Sign In"}
                  </span>
                  <FiArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Right Column: Key Platform Proof Metrics */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 self-center">
              <div className="rounded-2xl border border-neutral-200 bg-[#f7f9f7] p-5 text-center">
                <span className="block text-2xl font-black tracking-tight text-neutral-950">
                  10%+
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-500">
                  Charity Pledge
                </span>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-[#f7f9f7] p-5 text-center">
                <span className="block text-2xl font-black tracking-tight text-neutral-950">
                  5
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-500">
                  Scores Retained
                </span>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-[#f7f9f7] p-5 text-center">
                <span className="block text-2xl font-black tracking-tight text-neutral-950">
                  40%
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-500">
                  5-Match Pool
                </span>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-[#f7f9f7] p-5 text-center">
                <span className="block text-2xl font-black tracking-tight text-neutral-950">
                  100%
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-500">
                  Verified Proof
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-neutral-400 py-2">
        © {new Date().getFullYear()} Digital Heroes. All rights reserved.
      </footer>
    </main>
  );
}
