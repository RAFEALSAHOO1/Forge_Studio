import { useState } from "react";
import { MapPin, Calendar, Clock, Package, Eye, Check, X } from "lucide-react";

interface Order {
  id: number;
  customerName: string;
  orderDate: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: number;
  total: number;
  trackingId: string;
  lastUpdate: string;
  estimatedDelivery: string;
}

/**
 * Advanced Order Tracking Component
 * Real-time order tracking with detailed information
 * Full morphism UI design
 */
export function OrderTracking() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1001,
      customerName: "John Doe",
      orderDate: "2024-03-20",
      status: "shipped",
      items: 1,
      total: 150,
      trackingId: "FDX-2024-001",
      lastUpdate: "2024-03-22 14:30",
      estimatedDelivery: "2024-03-25",
    },
    {
      id: 1002,
      customerName: "Sarah Smith",
      orderDate: "2024-03-21",
      status: "processing",
      items: 2,
      total: 280,
      trackingId: "FDX-2024-002",
      lastUpdate: "2024-03-22 10:15",
      estimatedDelivery: "2024-03-26",
    },
    {
      id: 1003,
      customerName: "Mike Johnson",
      orderDate: "2024-03-18",
      status: "delivered",
      items: 1,
      total: 95,
      trackingId: "FDX-2024-003",
      lastUpdate: "2024-03-21 16:45",
      estimatedDelivery: "2024-03-21",
    },
    {
      id: 1004,
      customerName: "Emily Brown",
      orderDate: "2024-03-22",
      status: "pending",
      items: 3,
      total: 450,
      trackingId: "FDX-2024-004",
      lastUpdate: "2024-03-22 09:00",
      estimatedDelivery: "2024-03-27",
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredOrders = filterStatus === "all" ? orders : orders.filter((o) => o.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "from-yellow-500 to-yellow-600";
      case "processing":
        return "from-blue-500 to-blue-600";
      case "shipped":
        return "from-purple-500 to-purple-600";
      case "delivered":
        return "from-emerald-500 to-emerald-600";
      case "cancelled":
        return "from-red-500 to-red-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <Check />;
      case "cancelled":
        return <X />;
      default:
        return <Package />;
    }
  };

  const updateOrderStatus = (orderId: number, newStatus: Order["status"]) => {
    setOrders(
      orders.map((o) =>
        o.id === orderId
          ? { ...o, status: newStatus, lastUpdate: new Date().toLocaleString() }
          : o
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Order Tracking</h2>
        <p className="text-gray-400">Real-time tracking and status updates for all orders</p>
      </div>

      {/* Filter Buttons - Morphism */}
      <div className="flex flex-wrap gap-3">
        {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
              filterStatus === status
                ? `bg-gradient-to-r ${getStatusColor(status)} text-white shadow-lg`
                : "bg-white/5 text-gray-400 border border-white/20 hover:border-white/40"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            onClick={() => setSelectedOrder(order)}
            className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6
                     hover:bg-white/10 hover:border-white/20 transition-all duration-300
                     cursor-pointer transform hover:scale-102 hover:shadow-xl group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white font-bold text-lg">Order #{order.id}</h3>
                <p className="text-gray-400 text-sm">{order.customerName}</p>
              </div>
              <div className={`px-3 py-2 rounded-lg bg-gradient-to-r ${getStatusColor(order.status)} text-white text-sm font-medium`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-gray-500 text-xs mb-1">Tracking ID</p>
                <p className="text-white font-mono text-sm">{order.trackingId}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Items</p>
                <p className="text-white font-bold text-lg">{order.items}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Total</p>
                <p className="text-emerald-400 font-bold">${order.total}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Order Date</p>
                <p className="text-white text-sm">{order.orderDate}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-2 mb-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3 text-sm">
                <Clock size={16} className="text-blue-400" />
                <span className="text-gray-300">Last Update: <span className="text-white">{order.lastUpdate}</span></span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar size={16} className="text-emerald-400" />
                <span className="text-gray-300">Est. Delivery: <span className="text-white">{order.estimatedDelivery}</span></span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedOrder(order);
                }}
                className="flex-1 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/50
                         hover:bg-blue-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Eye size={16} />
                View Details
              </button>
              {order.status !== "delivered" && order.status !== "cancelled" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const statuses: Order["status"][] = ["pending", "processing", "shipped", "delivered"];
                    const currentIndex = statuses.indexOf(order.status);
                    if (currentIndex < statuses.length - 1) {
                      updateOrderStatus(order.id, statuses[currentIndex + 1]);
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/50
                           hover:bg-emerald-500/30 transition-all"
                >
                  Next Status
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">Order #{selectedOrder.id}</h3>
              <p className="text-gray-400">Detailed order information</p>
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              className="text-gray-400 hover:text-white text-3xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Customer Information</p>
                <p className="text-white font-bold text-lg mb-3">{selectedOrder.customerName}</p>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-400">Order Date: <span className="text-white">{selectedOrder.orderDate}</span></p>
                  <p className="text-gray-400">Tracking ID: <span className="text-white font-mono">{selectedOrder.trackingId}</span></p>
                  <p className="text-gray-400">Total Amount: <span className="text-emerald-400 font-bold">${selectedOrder.total}</span></p>
                </div>
              </div>

              {/* Status History */}
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-3">Status History</p>
                <div className="space-y-3">
                  {["pending", "processing", "shipped", "delivered"].map((status, idx) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder.id, status as Order["status"])}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                        selectedOrder.status === status
                          ? `bg-gradient-to-r ${getStatusColor(status)} text-white`
                          : "bg-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded ${selectedOrder.status === status ? "bg-white/20" : "bg-white/10"}`}>
                          {getStatusIcon(status)}
                        </div>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-3">Shipping Information</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Last Update</p>
                    <p className="text-white">{selectedOrder.lastUpdate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Estimated Delivery</p>
                    <p className="text-white">{selectedOrder.estimatedDelivery}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Number of Items</p>
                    <p className="text-white font-bold">{selectedOrder.items}</p>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-3">Quick Actions</p>
                <div className="space-y-2">
                  <button className="w-full px-3 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 transition-all text-sm">
                    Send Notification
                  </button>
                  <button className="w-full px-3 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded-lg hover:bg-purple-500/30 transition-all text-sm">
                    Print Label
                  </button>
                  <button className="w-full px-3 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-all text-sm">
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedOrder(null)}
            className="w-full px-4 py-2 bg-white/5 border border-white/20 text-gray-300 rounded-lg hover:bg-white/10 transition-all"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
