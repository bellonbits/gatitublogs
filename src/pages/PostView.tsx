import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { format } from 'date-fns';
import { Calendar, User, Clock, Share2, ArrowLeft, Terminal } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import Button from '../components/Button.tsx';

const PostView = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.5]);

  useEffect(() => {
    fetch(`/api/posts/${slug}`)
      .then(res => res.json())
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
      <div className="text-neon-green font-mono text-sm tracking-widest animate-pulse">EXTRACTING_DATA...</div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
      <Terminal className="w-16 h-16 text-deep-red animate-pulse" />
      <div className="text-white font-mono text-2xl">404: TRANSMISSION_LOST</div>
      <Link to="/">
        <Button variant="outline" className="border-white/10 text-white hover:border-white">RETURN_TO_BASE</Button>
      </Link>
    </div>
  );

  return (
    <article className="min-h-screen pb-32">
      {/* Cover Image Header */}
      <div className="h-[75vh] relative w-full overflow-hidden">
        <motion.div
          style={{ y, opacity }}
          className="absolute inset-0"
        >
          <img
            src={post.cover_image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80'}
            alt={post.title}
            className="w-full h-full object-cover filter brightness-[0.4] contrast-125"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/40 to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Link to="/" className="inline-flex items-center text-neon-green text-xs font-mono uppercase tracking-[0.3em] mb-8 hover:text-white transition-colors group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Archives
              </Link>

              <div className="mb-6">
                <span className="bg-neon-green/20 text-neon-green border border-neon-green/30 px-5 py-2 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] backdrop-blur-md">
                  {post.category}
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-10 leading-[1.1] tracking-tight text-glow max-w-4xl">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-8 text-cyber-gray font-mono text-[10px] uppercase tracking-[0.2em]">
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-neon-green" />
                  <span className="text-white">RE: P_GATITU</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-neon-green" />
                  <span>{format(new Date(post.created_at), 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-neon-green" />
                  <span>5 MIN READ</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-start mb-20 gap-10"
        >
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-6 text-neon-green/40">
              <div className="h-px w-10 bg-current" />
              <span className="font-mono text-[10px] uppercase tracking-[0.4em]">Intro Transmission</span>
            </div>
            <p className="text-2xl text-white leading-relaxed font-light">
              {post.excerpt}
            </p>
          </div>
          <div className="flex flex-col space-y-4">
            <Button variant="outline" size="sm" className="w-full border-white/5 bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] tracking-widest h-12">
              <Share2 className="w-4 h-4 mr-2" /> SHARE_SIGNAL
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="markdown-body prose-invert prose-lg max-w-none"
        >
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-green/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-xl border border-white/10 !bg-[#0b0f1a] !p-6"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className="bg-neon-green/10 text-neon-green px-1.5 py-0.5 rounded font-mono text-sm" {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </motion.div>

        {/* Tags */}
        {post.tags && (
          <div className="mt-24 pt-12 border-t border-white/5">
            <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-cyber-gray mb-8">// Associated Tags</h3>
            <div className="flex flex-wrap gap-3">
              {post.tags.split(',').map((tag: string) => (
                <span key={tag} className="px-5 py-2 bg-dark-card border border-white/5 rounded-full text-xs text-cyber-gray hover:text-neon-green hover:border-neon-green/30 transition-all cursor-pointer font-mono">
                  #{tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default PostView;
