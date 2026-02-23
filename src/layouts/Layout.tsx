import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';
import { motion, AnimatePresence } from 'motion/react';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-dark-bg text-white relative overflow-hidden font-sans">
      {/* Background Layers */}
      <div className="grid-background" />
      <div className="grain-overlay" />
      
      {/* Ambient Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-neon-green/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-deep-red/5 rounded-full blur-[150px]" />
      </div>

      <Navbar />
      
      <main className="relative z-10 pt-20 min-h-[calc(100vh-80px)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -15, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
