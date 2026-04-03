import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { UserManagement } from "@/components/admin/UserManagement";
import { OrderTracking } from "@/components/admin/OrderTracking";
import { OrderSummary } from "@/components/admin/OrderSummary";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { AnalyticsOverview } from "@/components/admin/AnalyticsOverview";
import { Users, Package, BarChart3, Settings, TrendingUp, Home } from "lucide-react";

type AdminTab = "dashboard" | "users" | "orders" | "tracking" | "analytics" | "settings";

/**
 * Admin Panel Page
 * Restricted to owner/admin only
 * Manages orders, users, and system settings
 */
export default function AdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode; color: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={20} />, color: "from-blue-500 to-blue-600" },
    { id: "orders", label: "Orders", icon: <Package size={20} />, color: "from-emerald-500 to-emerald-600" },
    { id: "tracking", label: "Order Tracking", icon: <TrendingUp size={20} />, color: "from-purple-500 to-purple-600" },
    { id: "users", label: "Users", icon: <Users size={20} />, color: "from-orange-500 to-orange-600" },
    { id: "analytics", label: "Analytics", icon: <BarChart3 size={20} />, color: "from-pink-500 to-pink-600" },
    { id: "settings", label: "Settings", icon: <Settings size={20} />, color: "from-slate-500 to-slate-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
        <p className="text-gray-400">
          Welcome, <span className="text-blue-400 font-semibold">{user?.firstName || "Admin"}</span> - System Administrator
        </p>
      </div>

      {/* Tab Navigation - Morphism Effect */}
      <div className="mb-8">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-2 shadow-2xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl
                  transition-all duration-300 transform hover:scale-105
                  ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-blue-500/50`
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                {tab.icon}
                <span className="hidden sm:inline text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area - Morphism Effect Container */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {activeTab === "dashboard" && <AdminDashboard />}
        {activeTab === "orders" && <OrderSummary />}
        {activeTab === "tracking" && <OrderTracking />}
        {activeTab === "users" && <UserManagement />}
        {activeTab === "analytics" && <AnalyticsOverview />}
        {activeTab === "settings" && <SystemSettings />}
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Admin Panel v1.0 - Last updated: {new Date().toLocaleDateString()}</p>
        <p className="mt-2 text-xs text-gray-600">This page is only visible to administrators</p>
      </div>
    </div>
  );
}
