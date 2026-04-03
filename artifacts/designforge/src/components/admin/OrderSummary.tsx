import { useState } from "react";
import { TrendingUp, DollarSign, ShoppingCart, Calendar, Filter, Download } from "lucide-react";

interface OrderData {
  date: string;
  orders: number;
  revenue: number;
  avgOrderValue: number;
  items: number;
}

/**
 * Order Summary Component
 * Comprehensive order analytics and summary
 * Morphism UI design
 */
export function OrderSummary() {
  const [orderData] = useState<OrderData[]>([
    { date: "2024-03-15", orders: 12, revenue: 1800, avgOrderValue: 150, items: 24 },
    { date: "2024-03-16", orders: 15, revenue: 2250, avgOrderValue: 150, items: 28 },
    { date: "2024-03-17", orders: 10, revenue: 1500, avgOrderValue: 150, items: 18 },
    { date: "2024-03-18", orders: 18, revenue: 2700, avgOrderValue: 150, items: 35 },
    { date: "2024-03-19", orders: 14, revenue: 2100, avgOrderValue: 150, items: 26 },
    { date: "2024-03-20", orders: 16, revenue: 2400, avgOrderValue: 150, items: 32 },
    { date: "2024-03-21", orders: 20, revenue: 3000, avgOrderValue: 150, items: 40 },
  ]);

  const [dateRange, setDateRange] = useState("7days");

  const totals = {
    totalOrders: orderData.reduce((sum, d) => sum + d.orders, 0),
    totalRevenue: orderData.reduce((sum, d) => sum + d.revenue, 0),
    avgOrderValue: Math.round(orderData.reduce((sum, d) => sum + d.avgOrderValue, 0) / orderData.length),
    totalItems: orderData.reduce((sum, d) => sum + d.items, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Order Summary</h2>
          <p className="text-gray-400">Order statistics and revenue analytics</p>
        </div>

        {/* Date Range Filter */}
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 backdrop-blur-md bg-white/5 border border-white/20 rounded-lg
                     text-white focus:outline-none focus:border-white/40"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 backdrop-blur-md bg-white/5 border border-white/20
                           rounded-lg text-white hover:bg-white/10 transition-all">
            <Download size={20} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Summary Cards - Morphism */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Orders",
            value: totals.totalOrders,
            icon: <ShoppingCart className="w-6 h-6" />,
            color: "from-blue-500 to-blue-600",
            change: "+8%",
          },
          {
            label: "Total Revenue",
            value: `$${totals.totalRevenue}`,
            icon: <DollarSign className="w-6 h-6" />,
            color: "from-emerald-500 to-emerald-600",
            change: "+12%",
          },
          {
            label: "Avg Order Value",
            value: `$${totals.avgOrderValue}`,
            icon: <TrendingUp className="w-6 h-6" />,
            color: "from-purple-500 to-purple-600",
            change: "+3%",
          },
          {
            label: "Total Items",
            value: totals.totalItems,
            icon: <Calendar className="w-6 h-6" />,
            color: "from-orange-500 to-orange-600",
            change: "+15%",
          },
        ].map((card, index) => (
          <div
            key={index}
            className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6
                     hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${card.color} text-white`}>
                {card.icon}
              </div>
              <span className="text-emerald-400 text-sm font-medium">{card.change}</span>
            </div>
            <p className="text-gray-400 text-sm mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Orders by Date Table - Morphism */}
      <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Filter size={20} />
            Daily Order Statistics
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Orders</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Items</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Revenue</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Avg Value</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Performance</th>
              </tr>
            </thead>
            <tbody>
              {orderData.map((data, index) => {
                const performancePercent = (data.revenue / 3000) * 100;
                return (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{data.date}</td>
                    <td className="px-6 py-4 text-right text-white">{data.orders}</td>
                    <td className="px-6 py-4 text-right text-white">{data.items}</td>
                    <td className="px-6 py-4 text-right text-emerald-400 font-bold">${data.revenue}</td>
                    <td className="px-6 py-4 text-right text-white">${data.avgOrderValue}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <div className="w-full max-w-xs bg-white/10 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all"
                            style={{ width: `${performancePercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Top Orders</h3>
          <div className="space-y-3">
            {[
              { id: 1001, customer: "John Doe", amount: "$450", items: 3 },
              { id: 1002, customer: "Sarah Smith", amount: "$380", items: 2 },
              { id: 1003, customer: "Mike Johnson", amount: "$320", items: 2 },
            ].map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div>
                  <p className="text-white font-medium">#{order.id}</p>
                  <p className="text-gray-400 text-sm">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-bold">{order.amount}</p>
                  <p className="text-gray-400 text-sm">{order.items} items</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Order Status</h3>
          <div className="space-y-3">
            {[
              { status: "Delivered", count: 95, color: "from-emerald-500 to-emerald-600" },
              { status: "Shipped", count: 18, color: "from-blue-500 to-blue-600" },
              { status: "Processing", count: 12, color: "from-purple-500 to-purple-600" },
              { status: "Pending", count: 8, color: "from-yellow-500 to-yellow-600" },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-300">{item.status}</p>
                  <p className="text-white font-bold">{item.count}</p>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${item.color}`}
                    style={{ width: `${(item.count / 133) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
