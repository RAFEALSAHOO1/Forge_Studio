import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { apiClient } from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";

interface ProfitLossData {
  profitTrend: Array<{
    date: string;
    revenue: number;
    costs: number;
    grossProfit: number;
    netProfit: number;
    margin: number;
  }>;
  costBreakdown: {
    processingFees: number;
    refunds: number;
  };
  summary: {
    totalRevenue: number;
    totalCosts: number;
    totalProfit: number;
    averageMargin: number;
  };
}

const COLORS = ["#f97316", "#ef4444"];

export function ProfitLossAnalysis() {
  const [data, setData] = useState<ProfitLossData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("monthly");

  useEffect(() => {
    fetchProfitLossData();
  }, [period]);

  const fetchProfitLossData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/dashboard/analytics/profitloss?period=${period}`);
      setData(res.data);
    } catch (error) {
      console.error("Failed to fetch profit/loss data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-400">Loading profit & loss analysis...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle>No Data Available</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const costBreakdownData = [
    {
      name: "Processing Fees",
      value: data.costBreakdown.processingFees,
    },
    {
      name: "Refunds",
      value: data.costBreakdown.refunds,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-emerald-400">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(data.summary.totalRevenue)}
            </div>
            <p className="text-xs text-gray-400 mt-1">12-month total</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-orange-400">Total Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(data.summary.totalCosts)}
            </div>
            <p className="text-xs text-gray-400 mt-1">12-month total</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-green-400">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(data.summary.totalProfit)}
            </div>
            <p className="text-xs text-gray-400 mt-1">Bottom line</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-blue-400">Avg Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {data.summary.averageMargin.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-400 mt-1">Profit ratio</p>
          </CardContent>
        </Card>
      </div>

      {/* Profit Trend */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle>Profit & Loss Trend</CardTitle>
          <CardDescription>Revenue vs costs over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data.profitTrend}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorCosts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                tick={{ fontSize: 12 }}
                tickFormatter={(date) => new Date(date).toLocaleDateString("en-US", { month: "short" })}
              />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #ffffff20",
                  borderRadius: "8px",
                }}
                formatter={(value: any) => formatCurrency(value)}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="costs"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorCosts)"
                name="Costs"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Profit Margin and Net Profit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profit Line Chart */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle>Net Profit Trend</CardTitle>
            <CardDescription>Monthly net profit performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.profitTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(date) => new Date(date).toLocaleDateString("en-US", { month: "short" })}
                />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #ffffff20",
                    borderRadius: "8px",
                  }}
                  formatter={(value: any) => formatCurrency(value)}
                />
                <Line
                  type="monotone"
                  dataKey="netProfit"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ fill: "#22c55e", r: 5 }}
                  name="Net Profit"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Profit Margin Chart */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle>Profit Margin %</CardTitle>
            <CardDescription>Monthly margin percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.profitTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(date) => new Date(date).toLocaleDateString("en-US", { month: "short" })}
                />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #ffffff20",
                    borderRadius: "8px",
                  }}
                  formatter={(value: any) => `${value.toFixed(2)}%`}
                />
                <Bar
                  dataKey="margin"
                  fill="#3b82f6"
                  radius={8}
                  name="Margin %"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle>Cost Breakdown</CardTitle>
          <CardDescription>12-month cost distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={costBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="lg:col-span-2 flex flex-col justify-center space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Processing Fees</span>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-white font-semibold">
                      {formatCurrency(data.costBreakdown.processingFees)}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{
                      width: `${
                        (data.costBreakdown.processingFees /
                          (data.costBreakdown.processingFees +
                            data.costBreakdown.refunds)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Refunds</span>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-white font-semibold">
                      {formatCurrency(data.costBreakdown.refunds)}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width: `${
                        (data.costBreakdown.refunds /
                          (data.costBreakdown.processingFees +
                            data.costBreakdown.refunds)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4 mt-4">
                <div className="text-sm text-gray-400 mb-1">Total Profit Margin</div>
                <div className="text-3xl font-bold text-green-400">
                  {data.summary.averageMargin.toFixed(1)}%
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {data.summary.totalProfit > 0
                    ? "Strong profitability - keep it up!"
                    : "Review costs to improve profitability"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
