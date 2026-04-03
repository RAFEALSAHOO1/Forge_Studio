import { useState } from "react";
import { Plus, Trash2, Eye, Edit, Search, ChevronDown } from "lucide-react";

interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
  status: "active" | "suspended" | "pending";
  joinDate: string;
  orders: number;
  profileImage?: string;
}

/**
 * User Management Component
 * Add, remove, edit, and manage user profiles
 * Full morphism UI design
 */
export function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([
    {
      id: 1,
      email: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
      role: "user",
      status: "active",
      joinDate: "2024-01-15",
      orders: 5,
    },
    {
      id: 2,
      email: "sarah.smith@example.com",
      firstName: "Sarah",
      lastName: "Smith",
      role: "user",
      status: "active",
      joinDate: "2024-02-20",
      orders: 12,
    },
    {
      id: 3,
      email: "mike.johnson@example.com",
      firstName: "Mike",
      lastName: "Johnson",
      role: "user",
      status: "suspended",
      joinDate: "2024-01-10",
      orders: 3,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [newUserForm, setNewUserForm] = useState<{
    email: string;
    firstName: string;
    lastName: string;
    role: "user" | "admin";
  }>({
    email: "",
    firstName: "",
    lastName: "",
    role: "user",
  });

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (newUserForm.email && newUserForm.firstName && newUserForm.lastName) {
      const newUser: UserProfile = {
        id: Math.max(...users.map((u) => u.id), 0) + 1,
        ...newUserForm,
        status: "pending",
        joinDate: new Date().toISOString().split("T")[0],
        orders: 0,
      };
      setUsers([...users, newUser]);
      setNewUserForm({ email: "", firstName: "", lastName: "", role: "user" });
      setShowAddUser(false);
    }
  };

  const handleDeleteUser = (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const handleToggleSuspend = (id: number) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? {
              ...u,
              status: u.status === "suspended" ? "active" : "suspended",
            }
          : u
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
      case "suspended":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">User Management</h2>
          <p className="text-gray-400">Manage user accounts and permissions ({users.length} users)</p>
        </div>
        <button
          onClick={() => setShowAddUser(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600
                   text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50
                   transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
        >
          <Plus size={20} />
          Add New User
        </button>
      </div>

      {/* Search Bar - Morphism */}
      <div className="relative">
        <Search className="absolute left-4 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 backdrop-blur-md bg-white/5 border border-white/20
                   rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/40
                   focus:bg-white/10 transition-all duration-300"
        />
      </div>

      {/* Add User Modal - Morphism */}
      {showAddUser && (
        <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white">Add New User</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="Email address"
              value={newUserForm.email}
              onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
              className="px-4 py-2 backdrop-blur-md bg-white/5 border border-white/20 rounded-lg
                       text-white placeholder-gray-500 focus:outline-none focus:border-white/40
                       focus:bg-white/10 transition-all"
            />
            <input
              type="text"
              placeholder="First Name"
              value={newUserForm.firstName}
              onChange={(e) => setNewUserForm({ ...newUserForm, firstName: e.target.value })}
              className="px-4 py-2 backdrop-blur-md bg-white/5 border border-white/20 rounded-lg
                       text-white placeholder-gray-500 focus:outline-none focus:border-white/40
                       focus:bg-white/10 transition-all"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={newUserForm.lastName}
              onChange={(e) => setNewUserForm({ ...newUserForm, lastName: e.target.value })}
              className="px-4 py-2 backdrop-blur-md bg-white/5 border border-white/20 rounded-lg
                       text-white placeholder-gray-500 focus:outline-none focus:border-white/40
                       focus:bg-white/10 transition-all"
            />
            <select
              value={newUserForm.role}
              onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as "user" | "admin" })}
              className="px-4 py-2 backdrop-blur-md bg-white/5 border border-white/20 rounded-lg
                       text-white focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddUser}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white
                       rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Create User
            </button>
            <button
              onClick={() => setShowAddUser(false)}
              className="px-4 py-2 bg-white/5 text-gray-300 border border-white/20 rounded-lg
                       hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Users Table - Morphism */}
      <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Orders</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Joined</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {user.firstName[0]}
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/50">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{user.orders}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{user.joinDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleToggleSuspend(user.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.status === "suspended"
                            ? "hover:bg-emerald-500/20 text-emerald-400"
                            : "hover:bg-red-500/20 text-red-400"
                        }`}
                        title={user.status === "suspended" ? "Activate" : "Suspend"}
                      >
                        <ChevronDown size={16} className={user.status === "suspended" ? "" : "rotate-180"} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                        title="Delete user"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-6 space-y-4">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold text-white">User Details</h3>
            <button
              onClick={() => setSelectedUser(null)}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="text-white font-medium">{selectedUser.email}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Name</p>
              <p className="text-white font-medium">{selectedUser.firstName} {selectedUser.lastName}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Role</p>
              <p className="text-white font-medium">{selectedUser.role}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Status</p>
              <p className="text-white font-medium">{selectedUser.status}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Orders</p>
              <p className="text-white font-medium">{selectedUser.orders}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Join Date</p>
              <p className="text-white font-medium">{selectedUser.joinDate}</p>
            </div>
          </div>

          <button onClick={() => setSelectedUser(null)} className="px-4 py-2 bg-white/5 text-gray-300 border border-white/20 rounded-lg hover:bg-white/10 transition-all">
            Close
          </button>
        </div>
      )}
    </div>
  );
}
