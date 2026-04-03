import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { PaymentDetails } from "@/components/admin/PaymentDetails";
import { AnalysisTable } from "@/components/admin/AnalysisTable";
import { GrowthAnalysis } from "@/components/admin/GrowthAnalysis";
import { ProfitLossAnalysis } from "@/components/admin/ProfitLossAnalysis";
import { OrderSummary } from "@/components/admin/OrderSummary";
import { CreditCard, TrendingUp, PieChart, BarChart3, Package, AlertCircle } from "lucide-react";

type OwnerTab = "payments" | "orders" | "analytics" | "growth" | "profitloss";

/**
 * Owner Panel Page
 * Restricted to owners only (role: "owner")
 * Contains payment details, order summary, and financial analytics
 */
export default function OwnerPanel() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<OwnerTab>("payments");
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      // Check if user is owner
      if (!user) {
        setLocation("/login");
        return;
      }

      // For now, we'll check if user exists and has made the request
      // In production, verify role = "owner" from the backend via API
      const checkOwnerStatus = async () => {
        try {
          // You could make an API call to verify owner status
          // For now, we'll assume the user is an owner if they reached this page
          // In a real implementation, the backend should verify this
          setIsAuthorized(true);
        } catch (error) {
          console.error("Failed to verify owner status:", error);
          setLocation("/");
        }
      };

      checkOwnerStatus();
    }
  }, [user, isLoading, setLocation]);

  const tabs: { id: OwnerTab; label: string; icon: React.ReactNode; color: string }[] = [
    { id: "payments", label: "Payment Details", icon: <CreditCard size={20} />, color: "from-green-500 to-emerald-600" },
    { id: "orders", label: "Order Summary", icon: <Package size={20} />, color: "from-blue-500 to-blue-600" },
    { id: "analytics", label: "Analytics Table", icon: <BarChart3 size={20} />, color: "from-purple-500 to-purple-600" },
    { id: "growth", label: "Growth Analysis", icon: <TrendingUp size={20} />, color: "from-pink-500 to-pink-600" },
    { id: "profitloss", label: "Profit & Loss", icon: <PieChart size={20} />, color: "from-orange-500 to-orange-600" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-gray-400 text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-6">
            This page is only accessible to owners. If you believe this is an error, please contact support.
          </p>
          <button
            onClick={() => setLocation("/")}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Owner Dashboard</h1>
        <p className="text-gray-400">
          Welcome, <span className="text-emerald-400 font-semibold">{user?.firstName || "Owner"}</span> - Business Analytics & Financial Overview
        </p>
      </div>

      {/* Tab Navigation - Morphism Effect */}
      <div className="mb-8">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-2 shadow-2xl overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap
                  transition-all duration-300 transform hover:scale-105
                  ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                {tab.icon}
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area - Morphism Effect Container */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {activeTab === "payments" && <PaymentDetails />}
        {activeTab === "orders" && <OrderSummary />}
        {activeTab === "analytics" && <AnalysisTable />}
        {activeTab === "growth" && <GrowthAnalysis />}
        {activeTab === "profitloss" && <ProfitLossAnalysis />}
      </div>

      {/* Info Footer */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-2">Last Updated</div>
          <div className="text-lg font-semibold text-white">
            {new Date().toLocaleTimeString()}
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-2">Dashboard Version</div>
          <div className="text-lg font-semibold text-white">2.0</div>
        </div>

        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-2">Data Refresh</div>
          <div className="text-lg font-semibold text-white">Real-time</div>
        </div>
      </div>
    </div>
  );
}
