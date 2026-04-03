import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/morphism.css";

export default function RequestPasswordReset() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email) {
        throw new Error("Email is required");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }

      const response = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Check Your Email
              </h2>
              <p className="text-slate-600 mb-6">
                We have sent a password reset link to <strong>{email}</strong>.
                The link expires in 1 hour.
              </p>
              <p className="text-sm text-slate-500 mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="btn-light w-full font-semibold"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-2 text-slate-900">
                Forgot Password?
              </h2>
              <p className="text-slate-600 mb-6">
                Enter your email and we'll send you a link to reset your password.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/50 border border-white/20 focus:border-indigo-400 focus:outline-none transition backdrop-blur-sm"
                    placeholder="you@example.com"
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-light mt-6 font-semibold transition"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>

                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
