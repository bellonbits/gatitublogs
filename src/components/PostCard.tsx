import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Eye, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface PostCardProps {
  post: {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    cover_image: string;
    category: string;
    created_at: string;
    views: number;
    reading_time?: string;
  };
  featured?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, featured = false }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-dark-card/50 backdrop-blur-sm hover:border-neon-green/30 transition-all duration-500 perspective-1000 ${featured ? 'md:col-span-2 md:row-span-1' : ''
        }`}
    >
      <Link to={`/post/${post.slug}`} className="flex flex-col h-full">
        <div className={`relative overflow-hidden ${featured ? 'h-[400px]' : 'h-64'}`}>
          <motion.img
            src={post.cover_image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80'}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75 group-hover:brightness-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/90 via-transparent to-transparent" />

          <div className="absolute top-6 left-6 flex space-x-2">
            <span className="bg-neon-green/20 text-neon-green border border-neon-green/30 px-4 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] backdrop-blur-md shadow-[0_0_15px_rgba(0,255,65,0.1)]">
              {post.category}
            </span>
          </div>
        </div>

        <div className="p-8 flex-1 flex flex-col relative z-10">
          <div className="flex items-center space-x-6 text-[10px] text-cyber-gray mb-4 font-mono uppercase tracking-widest">
            <div className="flex items-center space-x-2">
              <Calendar className="w-3 h-3 text-neon-green/60" />
              <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-3 h-3 text-neon-green/60" />
              <span>{post.views} VIEWS</span>
            </div>
          </div>

          <h3 className={`font-bold text-white mb-4 group-hover:text-neon-green transition-colors duration-300 leading-tight ${featured ? 'text-4xl' : 'text-2xl'
            }`}>
            {post.title}
          </h3>

          <p className="text-cyber-gray text-sm line-clamp-2 mb-8 leading-relaxed font-light">
            {post.excerpt || 'Accessing neural logs for this transmission. Encryption stable...'}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center text-white text-xs font-mono uppercase tracking-[0.3em] font-semibold group-hover:text-neon-green transition-colors">
              <span>Read transmission</span>
              <motion.div
                initial={{ x: 0 }}
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="ml-3"
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </div>

            <div className="w-8 h-[1px] bg-white/10 group-hover:w-16 group-hover:bg-neon-green transition-all duration-500" />
          </div>
        </div>

        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </Link>
    </motion.div>
  );
};

export default PostCard;
