import React from 'react';
import { Settings, Shield, User, Bell } from 'lucide-react';

const AdminSettings = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-mono text-white text-glow">System Configuration</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Settings */}
                <div className="bg-dark-card p-8 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="p-3 bg-purple-500/10 rounded-xl group-hover:text-purple-400">
                            <User className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-white font-mono">Profile Nexus</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Admin Identity</label>
                            <input type="text" value="admin" disabled className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white font-mono opacity-50 cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Transmission Key</label>
                            <input type="password" value="********" disabled className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white font-mono opacity-50 cursor-not-allowed" />
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-dark-card p-8 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="p-3 bg-blue-500/10 rounded-xl group-hover:text-blue-400">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-white font-mono">Security Protocols</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                            <div>
                                <p className="text-white font-medium">Two-Factor Encryption</p>
                                <p className="text-xs text-gray-500">Add an extra layer of security to the nexus.</p>
                            </div>
                            <div className="w-12 h-6 bg-gray-700 rounded-full relative cursor-pointer opacity-50">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-gray-500 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-dark-card p-8 rounded-2xl border border-white/5 hover:border-neon-green/30 transition-all group">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="p-3 bg-neon-green/10 rounded-xl group-hover:text-neon-green">
                            <Bell className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-white font-mono">Alert Configurations</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                            <div>
                                <p className="text-white font-medium">Transmission Alerts</p>
                                <p className="text-xs text-gray-500">Notify when new blog entries are intercepted.</p>
                            </div>
                            <div className="w-12 h-6 bg-neon-green/20 rounded-full relative cursor-pointer border border-neon-green/30">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-neon-green rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Info */}
                <div className="bg-dark-card p-8 rounded-2xl border border-white/5 hover:border-deep-red/30 transition-all group">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="p-3 bg-deep-red/10 rounded-xl group-hover:text-red-400">
                            <Settings className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-white font-mono">Core Diagnostics</h2>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm py-2 border-b border-white/5">
                            <span className="text-gray-500 font-mono text-xs uppercase">Engine</span>
                            <span className="text-white font-mono">Gatitu-Nexus v4.0.2</span>
                        </div>
                        <div className="flex justify-between text-sm py-2 border-b border-white/5">
                            <span className="text-gray-500 font-mono text-xs uppercase">Runtime</span>
                            <span className="text-white font-mono">Vite / React</span>
                        </div>
                        <div className="flex justify-between text-sm py-2">
                            <span className="text-gray-500 font-mono text-xs uppercase">Uptime</span>
                            <span className="text-neon-green font-mono">99.9%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                <p className="text-purple-400 font-mono text-xs uppercase tracking-widest text-center">Settings are currently in a read-only telemetry state.</p>
            </div>
        </div>
    );
};

export default AdminSettings;
