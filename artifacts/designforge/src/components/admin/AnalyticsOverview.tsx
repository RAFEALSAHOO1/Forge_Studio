import { BarChart3, LineChart, PieChart, TrendingUp, Users, Eye } from "lucide-react";

/**
 * Analytics Overview Component
 * Detailed analytics and insights
 * Advanced charts and metrics with morphism design
 */
export function AnalyticsOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Analytics Overview</h2>
        <p className="text-gray-400">Comprehensive analytics and user insights</p>
      </div>

      {/* Top Metrics - Morphism Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Page Views", value: "12,548", change: "+23%", icon: "👁️" },
          { label: "Unique Visitors", value: "2,847", change: "+18%", icon: "👥" },
          { label: "Avg. Session", value: "4m 32s", change: "+5%", icon: "⏱️" },
          { label: "Bounce Rate", value: "32.5%", change: "-8%", icon: "📊" },
        ].map((metric, index) => (
          <div key={index} className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{metric.icon}</span>
              <span className="text-sm font-medium text-emerald-400">{metric.change}</span>
            </div>
            <p className="text-gray-400 text-sm mb-1">{metric.label}</p>
            <p className="text-2xl font-bold text-white">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Traffic Sources - Morphism */}
      <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <BarChart3 size={20} />
          Traffic Sources
        </h3>

        <div className="space-y-4">
          {[
            { source: "Organic Search", visitors: 4200, percentage: 45 },
            { source: "Direct Traffic", visitors: 2100, percentage: 22 },
            { source: "Social Media", visitors: 1890, percentage: 20 },
            { source: "Referral Links", visitors: 930, percentage: 10 },
            { source: "Other", visitors: 280, percentage: 3 },
          ].map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">{item.source}</span>
                <span className="text-white font-bold">{item.visitors}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${
                    [
                      "from-blue-500 to-blue-600",
                      "from-emerald-500 to-emerald-600",
                      "from-purple-500 to-purple-600",
                      "from-pink-500 to-pink-600",
                      "from-orange-500 to-orange-600",
                    ][index]
                  }`}
                  style={{ width: `${item.percentage * 3.33}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Growth - Morphism */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Users size={20} />
            User Growth
          </h3>

          <div className="space-y-4">
            {[
              { period: "This Week", users: 127, trend: "↑" },
              { period: "This Month", users: 542, trend: "↑" },
              { period: "This Quarter", users: 1204, trend: "↑" },
              { period: "This Year", users: 3847, trend: "↑" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <span className="text-gray-300">{item.period}</span>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 text-xl">{item.trend}</span>
                  <span className="text-white font-bold">{item.users}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Analytics - Morphism */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <PieChart size={20} />
            Device Breakdown
          </h3>

          <div className="space-y-4">
            {[
              { device: "Desktop", percentage: 54, users: 3200 },
              { device: "Mobile", percentage: 38, users: 2250 },
              { device: "Tablet", percentage: 8, users: 475 },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">{item.device}</span>
                  <span className="text-white font-bold">{item.percentage}% ({item.users})</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${
                      [
                        "from-blue-500 to-blue-600",
                        "from-purple-500 to-purple-600",
                        "from-pink-500 to-pink-600",
                      ][index]
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Eye size={20} />
          Engagement Metrics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { metric: "Avg. Pages/Session", value: "3.2", unit: "pages" },
            { metric: "Avg. Session Duration", value: "4m 32s", unit: "minutes" },
            { metric: "Return Visitor Rate", value: "42%", unit: "percent" },
            { metric: "Goals Completed", value: "847", unit: "goals" },
          ].map((item, index) => (
            <div
              key={index}
              className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg p-4 text-center"
            >
              <p className="text-gray-400 text-xs mb-2">{item.metric}</p>
              <p className="text-2xl font-bold text-white mb-1">{item.value}</p>
              <p className="text-gray-500 text-xs">{item.unit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Pages */}
      <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Popular Pages</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300">Page</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-300">Views</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-300">Unique</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-300">Bounce</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-300">Avg Time</th>
              </tr>
            </thead>
            <tbody>
              {[
                { page: "/", views: 4500, unique: 3200, bounce: "28%", time: "2m 45s" },
                { page: "/browse", views: 3200, unique: 2100, bounce: "32%", time: "3m 12s" },
                { page: "/designs", views: 2800, unique: 1900, bounce: "38%", time: "1m 58s" },
                { page: "/about", views: 1200, unique: 980, bounce: "45%", time: "1m 15s" },
              ].map((item, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-6 py-3 text-white font-medium">{item.page}</td>
                  <td className="px-6 py-3 text-right text-white">{item.views}</td>
                  <td className="px-6 py-3 text-right text-white">{item.unique}</td>
                  <td className="px-6 py-3 text-right text-red-400">{item.bounce}</td>
                  <td className="px-6 py-3 text-right text-white">{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
