import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { apiClient } from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";

interface GrowthData {
  revenueGrowth: Array<{
    date: string;
    revenue: number;
    growth: number;
  }>;
  orderGrowth: Array<{
    date: string;
    orders: number;
    growth: number;
  }>;
  customerGrowth: Array<{
    date: string;
    newCustomers: number;
    returning: number;
  }>;
}

export function GrowthAnalysis() {
  const [data, setData] = useState<GrowthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrowthData();
  }, []);

  const fetchGrowthData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/dashboard/analytics/growth");
      setData(res.data);
    } catch (error) {
      console.error("Failed to fetch growth data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-400">Loading growth analysis...</div>
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

  return (
    <div className="space-y-6">
      {/* Revenue Growth */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle>Revenue Growth Trend</CardTitle>
          <CardDescription>Monthly revenue and growth percentage</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data.revenueGrowth}>
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
                formatter={(value: any, name: string) => {
                  if (name === "revenue") return [formatCurrency(value), "Revenue"];
                  if (name === "growth") return [`${value.toFixed(2)}%`, "Growth"];
                  return [value, name];
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", r: 4 }}
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="growth"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
                name="Growth %"
                yAxisId="right"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Order Growth */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle>Order Growth Trend</CardTitle>
          <CardDescription>Total orders and growth percentage</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data.orderGrowth}>
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
                formatter={(value: any, name: string) => {
                  if (name === "growth") return [`${value.toFixed(2)}%`, "Growth"];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar dataKey="orders" fill="#8b5cf6" name="Orders" radius={8} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Customer Growth */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle>Customer Growth</CardTitle>
          <CardDescription>New vs returning customers</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data.customerGrowth}>
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
              />
              <Legend />
              <Bar dataKey="newCustomers" fill="#ec4899" name="New Customers" radius={8} />
              <Bar dataKey="returning" fill="#06b6d4" name="Returning Customers" radius={8} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-emerald-400">Avg Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {(data.revenueGrowth.reduce((sum, d) => sum + d.growth, 0) / data.revenueGrowth.length).toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-blue-400">Total Orders (12mo)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {data.orderGrowth.reduce((sum, d) => sum + d.orders, 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 border-pink-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-pink-400">Total New Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {data.customerGrowth.reduce((sum, d) => sum + d.newCustomers, 0)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
