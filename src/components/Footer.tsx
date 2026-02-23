import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-card border-t border-white/5 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold font-mono text-white mb-4">GATITU.TECH</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Exploring the intersection of code, systems, and intelligence through a cinematic lens.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold font-mono text-white mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-neon-green transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-neon-green transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-neon-green transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold font-mono text-white mb-4">Newsletter</h3>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter email..."
                className="bg-dark-bg border border-white/10 rounded-l px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-green w-full"
              />
              <button className="bg-neon-green text-dark-bg font-bold px-4 py-2 rounded-r hover:bg-neon-green/90 transition-colors">
                Join
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/5 text-center text-gray-500 text-xs font-mono">
          © {new Date().getFullYear()} Gatitu Blogs Tech. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
