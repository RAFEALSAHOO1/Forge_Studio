import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiClient } from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";

interface AnalyticsRow {
  date: string;
  revenue: number;
  orders: number;
  avgOrder: number;
  costs: number;
  fees: number;
  refunds: number;
  grossProfit: number;
  netProfit: number;
  margin: number;
  successRate: number;
  newCustomers: number;
  repeatRate: number;
  growth: number;
}

export function AnalysisTable() {
  const [data, setData] = useState<AnalyticsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("monthly");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchAnalyticsData();
  }, [period]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/dashboard/analytics/table?period=${period}`);
      setData(res.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortBy as keyof AnalyticsRow];
    const bVal = b[sortBy as keyof AnalyticsRow];

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }

    const numA = typeof aVal === "number" ? aVal : 0;
    const numB = typeof bVal === "number" ? bVal : 0;

    return sortOrder === "asc" ? numA - numB : numB - numA;
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const SortableHeader = ({ label, column }: { label: string; column: string }) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-gray-300 cursor-pointer hover:bg-white/5 transition"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-2">
        {label}
        {sortBy === column && (sortOrder === "asc" ? " ↑" : " ↓")}
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-400">Loading analytics data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Business Analytics Table</CardTitle>
              <CardDescription>Detailed performance metrics and KPIs</CardDescription>
            </div>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-32 bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/3">
                  <SortableHeader label="Date" column="date" />
                  <SortableHeader label="Revenue" column="revenue" />
                  <SortableHeader label="Orders" column="orders" />
                  <SortableHeader label="Avg Order" column="avgOrder" />
                  <SortableHeader label="Processing Fees" column="fees" />
                  <SortableHeader label="Refunds" column="refunds" />
                  <SortableHeader label="Gross Profit" column="grossProfit" />
                  <SortableHeader label="Net Profit" column="netProfit" />
                  <SortableHeader label="Margin %" column="margin" />
                  <SortableHeader label="Success Rate %" column="successRate" />
                  <SortableHeader label="New Customers" column="newCustomers" />
                  <SortableHeader label="Repeat Rate %" column="repeatRate" />
                  <SortableHeader label="Growth %" column="growth" />
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="px-4 py-3 text-gray-300 font-mono text-xs">
                      {new Date(row.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-emerald-400 font-semibold">
                      {formatCurrency(row.revenue)}
                    </td>
                    <td className="px-4 py-3 text-blue-400 font-semibold">{row.orders}</td>
                    <td className="px-4 py-3 text-purple-400">
                      {formatCurrency(row.avgOrder)}
                    </td>
                    <td className="px-4 py-3 text-orange-400">
                      -{formatCurrency(row.fees)}
                    </td>
                    <td className="px-4 py-3 text-red-400">
                      -{formatCurrency(row.refunds)}
                    </td>
                    <td className="px-4 py-3 text-yellow-400 font-semibold">
                      {formatCurrency(row.grossProfit)}
                    </td>
                    <td className="px-4 py-3 text-green-400 font-semibold">
                      {formatCurrency(row.netProfit)}
                    </td>
                    <td className={`px-4 py-3 font-semibold ${row.margin >= 50 ? "text-green-400" : row.margin >= 30 ? "text-yellow-400" : "text-red-400"}`}>
                      {row.margin.toFixed(2)}%
                    </td>
                    <td className={`px-4 py-3 font-semibold ${row.successRate >= 95 ? "text-green-400" : row.successRate >= 90 ? "text-yellow-400" : "text-red-400"}`}>
                      {row.successRate.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-pink-400">{row.newCustomers}</td>
                    <td className="px-4 py-3 text-cyan-400">
                      {row.repeatRate.toFixed(2)}%
                    </td>
                    <td className={`px-4 py-3 font-semibold ${row.growth >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {row.growth >= 0 ? "+" : ""}{row.growth.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        <div className="bg-white/5 border border-white/10 rounded-lg p-3">
          <div className="text-gray-400 mb-1">Revenue</div>
          <div className="text-emerald-400 font-semibold">Total sales</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-3">
          <div className="text-gray-400 mb-1">Success Rate</div>
          <div className="text-cyan-400 font-semibold">% completed</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-3">
          <div className="text-gray-400 mb-1">Net Profit</div>
          <div className="text-green-400 font-semibold">After costs</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-3">
          <div className="text-gray-400 mb-1">Margin %</div>
          <div className="text-yellow-400 font-semibold">Profit ratio</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-3">
          <div className="text-gray-400 mb-1">Repeat Rate</div>
          <div className="text-pink-400 font-semibold">Customer loyalty</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-3">
          <div className="text-gray-400 mb-1">Growth %</div>
          <div className="text-cyan-400 font-semibold">MoM change</div>
        </div>
      </div>
    </div>
  );
}
