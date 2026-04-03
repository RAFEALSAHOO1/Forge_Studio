import { useState } from "react";
import { Settings, Bell, Lock, Database, Key, Save, AlertCircle, CheckCircle } from "lucide-react";

/**
 * System Settings Component
 * Admin system configuration and settings
 * Owner/maintainer panel for system preferences
 * Full morphism UI design
 */
export function SystemSettings() {
  const [settings, setSettings] = useState({
    appName: "Forge Studio",
    adminEmail: "admin@forgestudio.com",
    maintenanceMode: false,
    emailNotifications: true,
    autoBackup: true,
    backupInterval: "daily",
    maxUploadSize: 50,
    sessionTimeout: 24,
    multiFactorAuth: false,
    apiRateLimit: 1000,
  });

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setSaveStatus("saving");
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">System Settings</h2>
          <p className="text-gray-400">Configure Forge Studio system preferences and security</p>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={saveStatus === "saving"}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-300
            ${
              saveStatus === "success"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                : saveStatus === "saving"
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg"
            }`}
        >
          {saveStatus === "saving" && <span className="animate-spin">⚙️</span>}
          {saveStatus === "success" && <CheckCircle size={20} />}
          {saveStatus === "idle" && <Save size={20} />}
          {saveStatus === "success" ? "Saved!" : saveStatus === "saving" ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* General Settings */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Settings size={20} />
            General Settings
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Application Name</label>
              <input
                type="text"
                value={settings.appName}
                onChange={(e) => handleSettingChange("appName", e.target.value)}
                className="w-full px-4 py-2 backdrop-blur-md bg-white/5 border border-white/20 rounded-lg
                         text-white placeholder-gray-500 focus:outline-none focus:border-white/40 focus:bg-white/10"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Admin Email</label>
              <input
                type="email"
                value={settings.adminEmail}
                onChange={(e) => handleSettingChange("adminEmail", e.target.value)}
                className="w-full px-4 py-2 backdrop-blur-md bg-white/5 border border-white/20 rounded-lg
                         text-white placeholder-gray-500 focus:outline-none focus:border-white/40 focus:bg-white/10"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Max Upload Size (MB)</label>
              <input
                type="number"
                value={settings.maxUploadSize}
                onChange={(e) => handleSettingChange("maxUploadSize", parseInt(e.target.value))}
                className="w-full px-4 py-2 backdrop-blur-md bg-white/5 border border-white/20 rounded-lg
                         text-white placeholder-gray-500 focus:outline-none focus:border-white/40 focus:bg-white/10"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div>
                <p className="text-white font-medium">Maintenance Mode</p>
                <p className="text-gray-400 text-sm">Temporarily disable access for maintenance</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleSettingChange("maintenanceMode", e.target.checked)}
                  className="w-5 h-5"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Lock size={20} />
            Security Settings
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Session Timeout (Hours)</label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange("sessionTimeout", parseInt(e.target.value))}
                className="w-full px-4 py-2 backdrop-blur-md bg-white/5 border border-white/20 rounded-lg
                         text-white focus:outline-none focus:border-white/40 focus:bg-white/10"
              />
              <p className="text-gray-500 text-xs mt-1">How long before session expires</p>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">API Rate Limit (req/hour)</label>
              <input
                type="number"
                value={settings.apiRateLimit}
                onChange={(e) => handleSettingChange("apiRateLimit", parseInt(e.target.value))}
                className="w-full px-4 py-2 backdrop-blur-md bg-white/5 border border-white/20 rounded-lg
                         text-white focus:outline-none focus:border-white/40 focus:bg-white/10"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div>
                <p className="text-white font-medium">Multi-Factor Authentication</p>
                <p className="text-gray-400 text-sm">Require 2FA for admin accounts</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.multiFactorAuth}
                  onChange={(e) => handleSettingChange("multiFactorAuth", e.target.checked)}
                  className="w-5 h-5"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Backup & Database */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Database size={20} />
            Backup & Database
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div>
                <p className="text-white font-medium">Automatic Backups</p>
                <p className="text-gray-400 text-sm">Automatically backup database</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoBackup}
                  onChange={(e) => handleSettingChange("autoBackup", e.target.checked)}
                  className="w-5 h-5"
                />
              </label>
            </div>

            {settings.autoBackup && (
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Backup Frequency</label>
                <select
                  value={settings.backupInterval}
                  onChange={(e) => handleSettingChange("backupInterval", e.target.value)}
                  className="w-full px-4 py-2 backdrop-blur-md bg-white/5 border border-white/20 rounded-lg
                           text-white focus:outline-none focus:border-white/40 focus:bg-white/10"
                >
                  <option value="hourly">Every Hour</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}

            <div className="space-y-2">
              <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg
                               hover:shadow-lg transition-all duration-300">
                Backup Database Now
              </button>
              <button className="w-full px-4 py-3 bg-white/5 border border-white/20 text-gray-300 rounded-lg
                               hover:bg-white/10 transition-all">
                View Backup History
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Bell size={20} />
            Notifications
          </h3>

          <div className="space-y-3">
            {[
              { key: "emailNotifications", label: "Email Notifications", description: "Receive system alerts via email" },
              { key: "newOrders", label: "New Orders Alert", description: "Notify on new order placed" },
              { key: "userSignups", label: "User Signup Alert", description: "Notify on new user registration" },
              { key: "systemErrors", label: "System Errors Alert", description: "Notify on critical system errors" },
            ].map((notif) => (
              <div key={notif.key} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div>
                  <p className="text-white font-medium">{notif.label}</p>
                  <p className="text-gray-400 text-sm">{notif.description}</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notif.key === "emailNotifications" ? settings.emailNotifications : true}
                    onChange={(e) => handleSettingChange(notif.key, e.target.checked)}
                    className="w-5 h-5"
                  />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Key size={20} />
            Advanced Settings
          </h3>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-yellow-400 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-yellow-400 font-medium text-sm">Danger Zone</p>
                  <p className="text-gray-400 text-sm mt-1">These actions are irreversible and should be used with caution</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button className="w-full px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg
                               hover:bg-red-500/20 transition-all">
                Clear All Cache
              </button>
              <button className="w-full px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg
                               hover:bg-red-500/20 transition-all">
                Reset All Settings
              </button>
              <button className="w-full px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg
                               hover:bg-red-500/20 transition-all">
                Delete Database (⚠️ Irreversible)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Footer */}
      <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
        <div>
          <p className="text-gray-400 text-sm">Last saved: Today at 3:45 PM</p>
        </div>
        <button
          onClick={handleSaveSettings}
          className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg
                   hover:shadow-lg transition-all duration-300"
        >
          Save All Changes
        </button>
      </div>
    </div>
  );
}
