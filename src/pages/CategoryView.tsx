import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import PostCard from '../components/PostCard.tsx';
import { Layers, ArrowLeft } from 'lucide-react';

const CategoryView = () => {
  const { category } = useParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts?category=${category}`)
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-20"
      >
        <Link to="/" className="inline-flex items-center text-neon-green text-[10px] font-mono uppercase tracking-[0.3em] mb-8 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          SYSTEM_HOME
        </Link>

        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-neon-green/5 rounded-2xl flex items-center justify-center border border-neon-green/20 shadow-[0_0_20px_rgba(0,255,65,0.05)]">
            <Layers className="w-10 h-10 text-neon-green" />
          </div>
          <div>
            <h1 className="text-5xl font-bold font-mono uppercase tracking-tighter text-white">
              {category}<span className="text-neon-green">.SYS</span>
            </h1>
            <p className="text-cyber-gray mt-2 font-mono text-xs tracking-widest uppercase opacity-60">
              // DATA_SECTOR: {category} // ARCHIVE_READY
            </p>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 bg-dark-card/50 animate-pulse rounded-2xl border border-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.length > 0 ? (
            posts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center py-40 border border-white/5 rounded-3xl bg-dark-card/30">
              <div className="text-gray-500 font-mono text-sm tracking-widest uppercase">
                [!] NO_TRANSMISSIONS_DETECTED_IN_THIS_SECTOR
              </div>
              <Link to="/" className="inline-block mt-8 text-neon-green hover:underline font-mono text-xs uppercase tracking-widest">
                Re-scan other sectors
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryView;
