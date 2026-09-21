import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  FiArrowRight,
  FiLock,
  FiMail,
  FiUser,
  FiEye,
  FiEyeOff,
  FiCheck,
} from "react-icons/fi";
import { signUp } from "../Services/auth.service";
import { Link, useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agree: false,
  });
  const navigate = useNavigate();

  const signUpMutation = useMutation({
    mutationFn: () => signUp(formData.email, formData.password, formData.name),

    onSuccess: (data) => {
      console.log("Signup successful:", data);
      navigate("/select-charity");
    },

    onError: (error: any) => {
      console.error("Signup failed:", error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agree) return;
    signUpMutation.mutate();
  };

  return (
    <main className="min-h-screen w-full bg-[#edf2ee] text-neutral-900 flex flex-col justify-between p-4 sm:p-8 antialiased selection:bg-neutral-900 selection:text-white">
      {/* Top Header Bar */}
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
            Already a member?
          </span>
          <Link
            to="/login"
            className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            Log in ↗
          </Link>
        </div>
      </header>

      {/* Main Registration Card */}
      <div className="w-full max-w-5xl mx-auto my-auto py-8">
        <div className="relative rounded-[2rem] border-2 border-black bg-white p-8 sm:p-12 md:p-14 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          {/* Header Pill Badge */}
          <div className="absolute -top-3.5 left-8 bg-black text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <span>★</span>
            <span>Join The Movement</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Form */}
            <div className="lg:col-span-7">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950">
                  Play with purpose.
                </h1>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Turn your monthly Stableford scores into life-changing charity
                  funding and monthly reward draws.
                </p>
              </div>

              {/* Error Message */}
              {signUpMutation.isError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
                  {(signUpMutation.error as any)?.message ||
                    "Registration failed. Please check your details and try again."}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="name"
                    className="block text-xs font-bold uppercase tracking-wider text-neutral-700"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jordan Spieth"
                      className="w-full rounded-xl border border-neutral-300 bg-neutral-50/50 pl-11 pr-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>

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
                      placeholder="jordan@example.com"
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

                {/* Terms and Privacy Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="agree"
                      checked={formData.agree}
                      onChange={handleChange}
                      required
                      className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-black accent-black focus:ring-black"
                    />
                    <span className="text-xs text-neutral-600 leading-snug">
                      I agree to the{" "}
                      <span className="text-neutral-950 font-semibold underline underline-offset-2">
                        Terms of Service
                      </span>{" "}
                      and{" "}
                      <span className="text-neutral-950 font-semibold underline underline-offset-2">
                        Privacy Policy
                      </span>
                      .
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={signUpMutation.isPending || !formData.agree}
                  className="w-full mt-2 flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-neutral-800 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  <span>
                    {signUpMutation.isPending
                      ? "Creating account..."
                      : "Continue to Charity Selection"}
                  </span>
                  <FiArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Right Column: Platform Pillar List */}
            <div className="lg:col-span-5 flex flex-col gap-3 self-center">
              <div className="rounded-2xl border border-neutral-200 bg-[#f7f9f7] p-5">
                <div className="flex items-center gap-2.5 text-sm font-bold text-neutral-900">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black text-white text-xs">
                    <FiCheck className="stroke-[3]" />
                  </span>
                  <span>Minimum 10% direct allocation</span>
                </div>
                <p className="mt-1.5 pl-7 text-xs text-neutral-500 leading-relaxed">
                  Every active membership directly fuels verified partner
                  charity initiatives.
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-[#f7f9f7] p-5">
                <div className="flex items-center gap-2.5 text-sm font-bold text-neutral-900">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black text-white text-xs">
                    <FiCheck className="stroke-[3]" />
                  </span>
                  <span>Rolling 5-score tracking</span>
                </div>
                <p className="mt-1.5 pl-7 text-xs text-neutral-500 leading-relaxed">
                  Log Stableford scores (1–45 points) anywhere and keep your
                  profile verified.
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-[#f7f9f7] p-5">
                <div className="flex items-center gap-2.5 text-sm font-bold text-neutral-900">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black text-white text-xs">
                    <FiCheck className="stroke-[3]" />
                  </span>
                  <span>Tiered monthly prize pools</span>
                </div>
                <p className="mt-1.5 pl-7 text-xs text-neutral-500 leading-relaxed">
                  Compete for community rewards and rollovers without
                  gatekeeping or outdated rules.
                </p>
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
