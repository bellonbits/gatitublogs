import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { animate as anime } from 'animejs';
import PostCard from '../components/PostCard.tsx';
import Button from '../components/Button.tsx';
import { ArrowRight, Code, Cpu, Layers } from 'lucide-react';

const Home = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading && titleRef.current) {
      anime(titleRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 2000,
        ease: 'outExpo'
      });
    }
  }, [loading]);

  const featuredPost = posts[0];
  const latestPosts = posts.slice(1);

  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: y1 }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 filter contrast-125 saturate-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-transparent to-dark-bg" />

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1
              ref={titleRef}
              className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold font-mono tracking-tighter mb-8 text-white text-glow selection:bg-neon-green selection:text-black leading-none"
            >
              GATITU<span className="text-neon-green">.TECH</span>
            </h1>
            <p className="text-lg md:text-2xl text-cyber-gray font-light mb-12 max-w-3xl mx-auto leading-relaxed px-4">
              Architecting the future through high-performance systems and
              <span className="text-white font-medium"> cinematic engineering.</span>
              <span className="block text-[10px] sm:text-xs mt-6 text-neon-green font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] opacity-80 animate-pulse">
                [ CONNECTION ESTABLISHED // SIGNAL STABLE ]
              </span>
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button size="lg" className="group relative overflow-hidden bg-white text-black hover:text-white transition-colors duration-500">
                <span className="relative z-10 flex items-center">
                  Initialize Feed
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-neon-green translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Button>
              <Button variant="outline" size="lg" className="border-white/20 hover:border-white text-white">
                View Archives
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,255,65,0.05)_0%,transparent_70%)]" />
        </div>
      </section>

      {/* Featured Story */}
      {featuredPost && (
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="flex items-center space-x-4 mb-12">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-ping" />
              <h2 className="text-sm font-mono uppercase tracking-[0.4em] text-white/60">Pinned Transmission</h2>
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </div>
          <PostCard post={featuredPost} featured />
        </motion.section>
      )}

      {/* Latest Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-16">
          <div className="space-y-1">
            <h2 className="text-4xl font-bold font-mono text-white tracking-tight">LATEST SIGNAL</h2>
            <div className="h-1 w-20 bg-neon-green" />
          </div>
          <Button variant="ghost" size="sm" className="text-cyber-gray hover:text-white">Access Full Logs</Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-dark-card/50 animate-pulse rounded-2xl border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {latestPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Technical Categories */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-dark-card/30 backdrop-blur-sm border-y border-white/5" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-sm font-mono uppercase tracking-[0.5em] text-neon-green mb-4">// System Modules</h2>
            <h3 className="text-5xl font-bold text-white tracking-tight">Explore the Architecture</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Artificial Intelligence', icon: Cpu, color: 'text-neon-green', desc: 'LLMs, RAG, and Neural Systems' },
              { name: 'Backend Engineering', icon: Layers, color: 'text-blue-400', desc: 'High-performance Distributed Systems' },
              { name: 'Frontend Design', icon: Code, color: 'text-purple-400', desc: 'Immersive and Reactive Interfaces' },
              { name: 'Cyber Security', icon: Layers, color: 'text-deep-red', desc: 'Securing the Neural Network' },
            ].map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="p-8 border border-white/5 rounded-2xl bg-dark-bg/50 backdrop-blur-md hover:border-neon-green/30 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <cat.icon className="w-20 h-20" />
                </div>
                <cat.icon className={`w-12 h-12 mb-6 ${cat.color} group-hover:scale-110 transition-transform duration-500`} />
                <h3 className="text-xl font-bold text-white mb-3">{cat.name}</h3>
                <p className="text-sm text-cyber-gray font-mono leading-relaxed">{cat.desc}</p>
                <div className="mt-8 flex items-center text-xs font-mono text-neon-green opacity-0 group-hover:opacity-100 transition-opacity">
                  ENTER MODULE <ArrowRight className="w-3 h-3 ml-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
