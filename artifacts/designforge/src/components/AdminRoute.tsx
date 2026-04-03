import { ReactNode } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

interface AdminRouteProps {
  children: ReactNode;
}

/**
 * AdminRoute Component
 * Protects admin routes - only allows owner/admin access
 * Redirects non-admin users to home page
 */
export function AdminRoute({ children }: AdminRouteProps) {
  const { user, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-xl font-semibold">Loading...</div>
          <div className="text-gray-500">Verifying access...</div>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    const [, setLocation] = useLocation();
    setLocation("/login");
    return null;
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 text-center max-w-md shadow-2xl">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-300 mb-6">
            You do not have permission to access this area. This page is reserved for administrators only.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
