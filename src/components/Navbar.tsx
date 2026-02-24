import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Terminal, Code, Cpu, Layers, User, Sparkles } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import Button from './Button.tsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/', icon: Terminal },
    { name: 'AI Systems', path: '/category/ai', icon: Cpu },
    { name: 'Gatitu AI', path: '/ai', icon: Sparkles },
    { name: 'Backend', path: '/category/backend', icon: Layers },
    { name: 'Frontend', path: '/category/frontend', icon: Code },
    { name: 'Architect', path: '/about', icon: User },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-dark-bg/60 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 180 }}
              className="w-10 h-10 bg-neon-green/10 border border-neon-green/30 rounded-lg flex items-center justify-center group-hover:bg-neon-green/20 transition-colors shadow-[0_0_15px_rgba(0,255,65,0.1)]"
            >
              <Terminal className="w-6 h-6 text-neon-green" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-bold font-mono tracking-tighter text-white leading-none">
                GATITU<span className="text-neon-green">.TECH</span>
              </span>
              <span className="text-[8px] font-mono text-neon-green/60 uppercase tracking-[0.4em] mt-1 hidden sm:block">
                // System v4.0.2
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={clsx(
                    "relative px-4 py-2 flex items-center space-x-2 text-xs font-mono uppercase tracking-widest transition-colors",
                    isActive ? "text-neon-green" : "text-cyber-gray hover:text-white"
                  )}
                >
                  <link.icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-neon-green shadow-[0_0_10px_rgba(0,255,65,0.5)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Social / Action Buttons */}
          <div className="hidden md:flex items-center ml-4 pl-4 border-l border-white/10">
            <Link to="/ai">
              <Button size="sm" variant="outline" className="h-9 font-mono text-[10px] tracking-widest border-neon-green/30 text-neon-green">
                GATEWAY_OPEN
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-cyber-gray hover:text-white focus:outline-none bg-white/5 rounded-lg border border-white/5"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-card/95 backdrop-blur-2xl border-b border-white/5 overflow-hidden"
          >
            <div className="px-4 py-8 space-y-2">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={clsx(
                    "flex items-center space-x-4 px-4 py-4 rounded-xl text-sm font-mono uppercase tracking-widest transition-all",
                    location.pathname === link.path
                      ? "text-neon-green bg-neon-green/10 border border-neon-green/20"
                      : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
