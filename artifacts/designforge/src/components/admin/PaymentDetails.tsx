import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";

interface Transaction {
  id: number;
  transactionId: string;
  orderId: number;
  amount: string;
  processingFee: string;
  netAmount: string;
  currency: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
  isRefunded: boolean;
  refundAmount: string;
}

export function PaymentDetails() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchPaymentData();
  }, [filterStatus, startDate, endDate]);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.append("status", filterStatus);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      // Fetch summary
      const summaryRes = await apiClient.get(`/dashboard/payments/summary?${params}`);
      setSummary(summaryRes.data);

      // Fetch detailed list
      const listRes = await apiClient.get(`/dashboard/payments/list?${params}`);
      setTransactions(listRes.data.transactions);
    } catch (error) {
      console.error("Failed to fetch payment data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "refunded":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const filteredTransactions = transactions.filter((txn) =>
    searchTerm === ""
      ? true
      : txn.transactionId.includes(searchTerm) ||
        txn.orderId.toString().includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-400">Loading payment data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-400">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(summary.totalRevenue)}</div>
              <p className="text-xs text-gray-400 mt-1">{summary.totalTransactions} transactions</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-400">Processing Fees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(summary.totalProcessingFees)}
              </div>
              <p className="text-xs text-gray-400 mt-1">Total costs</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-400">Net Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(summary.netRevenue)}</div>
              <p className="text-xs text-gray-400 mt-1">After fees</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-400">Refunds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(summary.totalRefunds)}</div>
              <p className="text-xs text-gray-400 mt-1">{summary.refundedCount} refunded</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 border-pink-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-pink-400">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {((summary.completedCount / (summary.completedCount + summary.failedCount)) * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-gray-400 mt-1">Successful payments</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>View and manage all payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search transaction ID or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>

              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white/5 border-white/10"
              />

              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Transaction ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Fee</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Net</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-sm text-gray-300 font-mono">{txn.transactionId.slice(0, 8)}...</td>
                    <td className="px-6 py-4 text-sm text-gray-300">#{txn.orderId}</td>
                    <td className="px-6 py-4 text-sm text-white font-semibold">
                      {formatCurrency(parseFloat(txn.amount))}
                    </td>
                    <td className="px-6 py-4 text-sm text-orange-400">
                      -{formatCurrency(parseFloat(txn.processingFee))}
                    </td>
                    <td className="px-6 py-4 text-sm text-emerald-400">
                      {formatCurrency(parseFloat(txn.netAmount))}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Badge className={`${getStatusColor(txn.status)} border`}>
                        {txn.status}
                      </Badge>
                      {txn.isRefunded && (
                        <>
                          <br />
                          <Badge className="mt-1 bg-blue-500/20 text-blue-400 border-blue-500/30 border">
                            Refunded: {formatCurrency(parseFloat(txn.refundAmount))}
                          </Badge>
                        </>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(txn.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
