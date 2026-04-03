import { useState, useEffect } from "react";
import { BarChart3, Users, Package, TrendingUp, Activity, AlertCircle } from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  activeDesigns: number;
  systemHealth: number;
}

/**
 * Admin Dashboard
 * Overview of key metrics and system status
 * Displays with morphism effects
 */
export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 24,
    totalOrders: 128,
    totalRevenue: 5240,
    pendingOrders: 8,
    activeDesigns: 156,
    systemHealth: 98,
  });

  useEffect(() => {
    // Simulate fetching real data from API
    // In production: fetch('/api/admin/stats')
    const loadStats = async () => {
      // Mock data - replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      // setStats would be called with real data
    };
    loadStats();
  }, []);

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: <Users className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600",
      trend: "+12% this month",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: <Package className="w-8 h-8" />,
      color: "from-emerald-500 to-emerald-600",
      trend: "+8% this month",
    },
    {
      label: "Revenue",
      value: `$${stats.totalRevenue}`,
      icon: <TrendingUp className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600",
      trend: "+24% this month",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      icon: <AlertCircle className="w-8 h-8" />,
      color: "from-orange-500 to-orange-600",
      trend: "Requires attention",
    },
    {
      label: "Active Designs",
      value: stats.activeDesigns,
      icon: <BarChart3 className="w-8 h-8" />,
      color: "from-pink-500 to-pink-600",
      trend: "+45 new designs",
    },
    {
      label: "System Health",
      value: `${stats.systemHealth}%`,
      icon: <Activity className="w-8 h-8" />,
      color: "from-green-500 to-green-600",
      trend: "All systems operational",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h2>
        <p className="text-gray-400">System metrics and real-time statistics</p>
      </div>

      {/* Stats Grid - Morphism Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="group backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6
                       hover:bg-white/10 hover:border-white/20 transition-all duration-300
                       transform hover:scale-105 hover:shadow-xl"
          >
            {/* Color Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 
                           group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white
                               shadow-lg shadow-blue-500/20 group-hover:shadow-lg group-hover:shadow-current/50`}>
                  {stat.icon}
                </div>
              </div>

              <h3 className="text-gray-300 text-sm font-medium mb-2">{stat.label}</h3>
              <p className="text-3xl font-bold text-white mb-3">{stat.value}</p>

              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>

        <div className="space-y-3">
          {[
            { action: "New order received", time: "2 minutes ago", user: "Sarah Johnson" },
            { action: "User registered", time: "15 minutes ago", user: "Mike Smith" },
            { action: "Design updated", time: "1 hour ago", user: "admin@forgestudio.com" },
            { action: "Payment processed", time: "3 hours ago", user: "Emily Brown" },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div>
                <p className="text-white font-medium">{activity.action}</p>
                <p className="text-gray-500 text-sm">{activity.user}</p>
              </div>
              <span className="text-gray-400 text-sm">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">System Status</h3>
          <div className="space-y-3">
            {[
              { service: "Database", status: "operational", uptime: "99.8%" },
              { service: "API Server", status: "operational", uptime: "99.9%" },
              { service: "Email Service", status: "operational", uptime: "100%" },
              { service: "File Storage", status: "operational", uptime: "99.5%" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-300">{item.service}</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-400 text-sm">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 
                             text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/50
                             transition-all duration-300 transform hover:scale-105">
              Send Newsletter
            </button>
            <button className="p-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 
                             text-white text-sm font-medium hover:shadow-lg hover:shadow-emerald-500/50
                             transition-all duration-300 transform hover:scale-105">
              Generate Report
            </button>
            <button className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 
                             text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/50
                             transition-all duration-300 transform hover:scale-105">
              Backup Database
            </button>
            <button className="p-3 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 
                             text-white text-sm font-medium hover:shadow-lg hover:shadow-pink-500/50
                             transition-all duration-300 transform hover:scale-105">
              View Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
