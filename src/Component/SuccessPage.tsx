import React, { useMemo } from "react";
import { FiCheck, FiX, FiHome } from "react-icons/fi";

interface PaymentStatusPageProps {
  onNavigateHome?: () => void;
  onNavigateRetry?: () => void;
}

export const PaymentStatusPage: React.FC<PaymentStatusPageProps> = ({
  onNavigateHome = () => (window.location.href = "/"),
}) => {
  // Evaluates query params: ?status=success or ?status=failed / ?status=cancel
  const isSuccess = useMemo(() => {
    if (typeof window === "undefined") return true;
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status")?.toLowerCase();
    return status !== "failed" && status !== "cancel" && status !== "error";
  }, []);

  return (
    <div className="min-h-screen bg-[#ecf0eb] text-neutral-900 flex flex-col justify-between selection:bg-neutral-900 selection:text-white">
      {/* Top Navbar */}
      <header className="w-full px-6 pt-6">
        <div className="mx-auto max-w-7xl flex items-center justify-between rounded-full bg-white px-6 py-3.5 shadow-sm border border-neutral-200/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
              D
            </div>
            <span className="text-sm font-semibold tracking-tight">
              Digital Heroes
            </span>
          </div>

          <nav className="hidden sm:flex items-center gap-6 text-xs font-medium text-neutral-500">
            <button
              onClick={onNavigateHome}
              className="hover:text-black transition"
            >
              Home
            </button>
            <span className="hover:text-black transition cursor-pointer">
              Monthly
            </span>
            <span className="hover:text-black transition cursor-pointer">
              Charity
            </span>
            <span className="hover:text-black transition cursor-pointer">
              About
            </span>
          </nav>

          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white transition hover:bg-neutral-800"
          >
            <FiHome className="h-3.5 w-3.5" />
            Home
          </button>
        </div>
      </header>

      {/* Main Status Container */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 sm:p-10 shadow-sm border border-neutral-200/60 text-center">
          {/* Status Indicator Icon */}
          <div className="mx-auto mb-5 flex justify-center">
            {isSuccess ? (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f7ee] text-[#12a150]">
                <FiCheck className="h-8 w-8 stroke-[2.5]" />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
                <FiX className="h-8 w-8 stroke-[2.5]" />
              </div>
            )}
          </div>

          {/* Title & Message */}
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mb-2">
            {isSuccess ? "Payment Successful" : "Payment Failed"}
          </h1>
          <p className="text-sm text-neutral-500 leading-relaxed max-w-xs mx-auto mb-8">
            {isSuccess
              ? "Your subscription is now active. Your selected charity allocation and draw entry have been confirmed."
              : "We could not complete your transaction. No charges were deducted from your account."}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={onNavigateHome}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-200/80 bg-white hover:bg-neutral-50 px-5 py-3.5 text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <FiHome className="h-4 w-4" />
              Back to Home
            </button>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-neutral-400">
        Digital Heroes &copy; 2026. All rights reserved.
      </footer>
    </div>
  );
};

export default PaymentStatusPage;
