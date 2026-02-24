import { Code, Terminal, Cpu, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

const About = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 200, 400], [1, 0.5, 0.2]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <header className="text-center mb-32 relative">
        <motion.div
          style={{ opacity }}
          className="absolute -top-10 left-1/2 -translate-x-1/2 text-neon-green/20 w-full font-mono text-[100px] font-bold leading-none pointer-events-none select-none"
        >
          ARCHITECT
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-bold font-mono text-white mb-8 tracking-tighter"
        >
          About the <span className="text-neon-green">Architect</span>
        </motion.h1>
        <p className="text-xl text-cyber-gray max-w-2xl mx-auto font-light leading-relaxed">
          Building digital cathedrals in the age of <span className="text-white italic">silicon and light.</span>
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-40">
        <motion.div className="relative group perspective-1000">
          <motion.div
            style={{ y }}
            className="absolute inset-0 bg-neon-green/20 rounded-3xl transform rotate-6 scale-105 blur-2xl group-hover:bg-neon-green/30 transition-all duration-700"
          />
          <motion.div
            style={{ y }}
            className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] bg-dark-card"
          >
            <img
              src="/architect.jpeg"
              alt="Architect Photo"
              className="w-full h-[600px] object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ease-in-out scale-110 group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-60" />

            {/* HUD Elements */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between font-mono text-[10px] text-neon-green">
              <span>SCAN_IDENT: RE-P.GATITU</span>
              <span className="flex items-center"><Sparkles className="w-3 h-3 mr-2 animate-pulse" /> BIO_AUTHENTICATED</span>
            </div>
          </motion.div>
        </motion.div>

        <div className="space-y-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white font-mono flex items-center tracking-tight">
              <Terminal className="w-8 h-8 mr-4 text-neon-green p-1.5 bg-neon-green/10 rounded-lg" />
              System Philosophy
            </h2>
            <p className="text-cyber-gray text-lg leading-relaxed font-light">
              I believe that code is more than just instructions for a machine; it's a form of <span className="text-white font-medium">modern storytelling.</span>
              Every function, every class, and every system architecture tells a narrative of problem-solving,
              efficiency, and human ingenuity.
            </p>
            <p className="text-cyber-gray text-lg leading-relaxed font-light">
              My work focuses on the intersection of high-performance backend systems, immersive frontend experiences,
              and the emerging frontier of <span className="text-neon-green font-mono">artificial intelligence.</span>
            </p>
          </motion.div>

          <div className="pt-10 border-t border-white/5 grid grid-cols-2 gap-8">
            <div>
              <div className="text-neon-green font-mono text-2xl font-bold mb-1">10+</div>
              <div className="text-[10px] text-cyber-gray uppercase tracking-widest">Years Experience</div>
            </div>
            <div>
              <div className="text-white font-mono text-2xl font-bold mb-1">500k+</div>
              <div className="text-[10px] text-cyber-gray uppercase tracking-widest">Lines of Code</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { title: 'Frontend Systems', icon: Code, desc: 'React, Tailwind, Motion, WebGL' },
          { title: 'Backend Core', icon: Terminal, desc: 'Node.js, Rust, Go, SQL/NoSQL' },
          { title: 'AI Engineering', icon: Cpu, desc: 'Transformers, RAG, Neural Nets' },
        ].map((skill, idx) => (
          <motion.div
            key={skill.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-dark-card/50 backdrop-blur-md p-10 rounded-3xl border border-white/5 hover:border-neon-green/30 transition-all duration-500 group relative"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-neon-green/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
            <skill.icon className="w-10 h-10 text-cyber-gray group-hover:text-neon-green mb-8 transition-colors duration-500" />
            <h3 className="text-xl font-bold text-white mb-4 tracking-tight">{skill.title}</h3>
            <p className="text-sm text-cyber-gray font-mono leading-relaxed opacity-80">{skill.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default About;
