import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import "../styles/morphism.css";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  const email = (location.state as any)?.email || searchParams.get("email") || "";
  const token = searchParams.get("token");

  // Auto-verify if token is provided
  useEffect(() => {
    if (token && !success) {
      verifyEmailWithToken(token);
    }
  }, [token]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [resendCountdown]);

  const verifyEmailWithToken = async (emailToken: string): Promise<void> => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: emailToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyEmailWithToken(verificationCode);
  };

  const handleResendEmail = async () => {
    if (!email) {
      setError("Email address is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/request-email-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend email");
      }

      setResendCountdown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="morphism-glass-light backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Email Verified!
              </h2>
              <p className="text-slate-600 mb-6">
                Your email has been successfully verified. You can now log in to your account.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-2 text-slate-900">
                Verify Your Email
              </h2>
              <p className="text-slate-600 mb-6">
                {email
                  ? `We've sent a verification link to ${email}`
                  : "Enter the verification code sent to your email"}
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Verification Code (from email)
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/50 border border-white/20 focus:border-indigo-400 focus:outline-none transition backdrop-blur-sm font-mono text-center tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Check your email for a 6-character verification code
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full btn-light mt-6 font-semibold transition"
                  disabled={isLoading || verificationCode.length < 6}
                >
                  {isLoading ? "Verifying..." : "Verify Email"}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm text-slate-600 mb-4">
                  Didn't receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResendEmail}
                  className="w-full px-4 py-2 rounded-lg bg-slate-200/50 hover:bg-slate-300/50 text-slate-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || resendCountdown > 0}
                >
                  {resendCountdown > 0
                    ? `Resend in ${resendCountdown}s`
                    : "Resend Code"}
                </button>
              </div>

              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                >
                  Back to Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
