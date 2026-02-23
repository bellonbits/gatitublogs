import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { LayoutDashboard, FileText, Settings, LogOut, PlusCircle, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import clsx from 'clsx';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Posts', path: '/admin/posts', icon: FileText },
    { name: 'New Post', path: '/admin/posts/new', icon: PlusCircle },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-white flex font-mono">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-card border-r border-white/5 hidden md:flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-neon-green/10 border border-neon-green rounded flex items-center justify-center">
              <span className="text-neon-green font-bold">A</span>
            </div>
            <span className="text-xl font-bold tracking-tighter text-white">
              GATITU<span className="text-neon-green">.ADMIN</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={clsx(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all",
                location.pathname === link.path
                  ? "bg-neon-green/10 text-neon-green border border-neon-green/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <link.icon className="w-5 h-5" />
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center space-x-3 mb-4 px-4">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.username || 'Admin'}</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-deep-red/10 text-deep-red border border-deep-red/20 rounded-lg hover:bg-deep-red/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 relative">
        {/* Grain Overlay */}
        <div className="grain-overlay" />
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default AdminLayout;
