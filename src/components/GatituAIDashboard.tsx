import React, { useState, useEffect, useRef } from 'react';
import {
    Plus, MessageSquare, Archive, Library, LayoutGrid,
    Image as ImageIcon, Presentation, Code,
    Settings, Share2, Mic, ArrowUp, Paperclip,
    Sparkles, BrainCircuit, ClipboardList, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Graph, InteractableNote } from './generative-ui';
import RecipeCard from './RecipeCard';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    renderedComponent?: React.ReactNode;
}

const GatituAIDashboard: React.FC = () => {
    const [isGatituSidebarOpen, setIsGatituSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Chat');
    const [messages, setMessages] = useState<Message[]>([]);
    const [value, setValue] = useState('');
    const [isPending, setIsPending] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    useEffect(() => {
        if (!isPending) {
            scrollToBottom();
        }
    }, [isPending]);

    const handleSubmit = async (customValue?: string) => {
        const text = customValue || value;
        if (!text || isPending) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
        setMessages(prev => [...prev, userMsg]);
        setValue('');
        setIsPending(true);

        const assistantId = (Date.now() + 1).toString();
        const assistantMsg: Message = { id: assistantId, role: 'assistant', content: '' };
        setMessages(prev => [...prev, assistantMsg]);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        ...messages.map(m => ({ role: m.role, content: m.content })),
                        { role: 'user', content: text }
                    ]
                })
            });

            if (!response.ok) throw new Error('Failed to connect to Groq');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullContent = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                if (data.content) {
                                    fullContent += data.content;

                                    // Parse for generative UI patterns
                                    let renderedComponent = null;
                                    if (fullContent.includes('```json [RECIPE_CARD]')) {
                                        try {
                                            const match = fullContent.match(/```json \[RECIPE_CARD\]\n([\s\S]*?)\n```/);
                                            if (match) {
                                                const props = JSON.parse(match[1]);
                                                renderedComponent = <RecipeCard {...props} />;
                                            }
                                        } catch (e) { console.error('GenUI fail', e); }
                                    } else if (fullContent.includes('```json [GRAPH]')) {
                                        try {
                                            const match = fullContent.match(/```json \[GRAPH\]\n([\s\S]*?)\n```/);
                                            if (match) {
                                                const props = JSON.parse(match[1]);
                                                renderedComponent = <Graph {...props} />;
                                            }
                                        } catch (e) { console.error('GenUI fail', e); }
                                    }

                                    setMessages(prev => prev.map(m =>
                                        m.id === assistantId ? { ...m, content: fullContent, renderedComponent } : m
                                    ));
                                }
                            } catch (e) {
                                console.error('Error parsing SSE chunk', e);
                            }
                        }
                    }
                }
            }
        } catch (err: any) {
            console.error('[GatituAI] Submit error:', err);
            setMessages(prev => prev.map(m =>
                m.id === assistantId ? { ...m, content: `Error: ${err.message}` } : m
            ));
        } finally {
            setIsPending(false);
        }
    };

    const handleNewChat = () => {
        setMessages([]);
        setValue('');
    };

    const actionChips = [
        { label: 'Create Image', icon: ImageIcon, prompt: "Could you generate a creative architectural visualization concept for a floating eco-city?" },
        { label: 'Presentation', icon: Presentation, prompt: "Help me prepare a keynote presentation about the future of AI in sustainable urban design." },
        { label: 'Code Analysis', icon: Code, prompt: "Can you help me debug this React component and optimize its rendering performance?" },
    ];

    const featureCards = [
        {
            title: 'Image Generator',
            desc: 'Create high-quality images instantly from text.',
            icon: ImageIcon,
            action: 'Create Image',
            prompt: "Could you generate a creative architectural visualization concept for a floating eco-city?"
        },
        {
            title: 'AI Presentation',
            desc: 'Turn ideas into engaging, professional presentations.',
            icon: Presentation,
            action: 'Make Slides',
            prompt: "Help me prepare a keynote presentation about the future of AI in sustainable urban design."
        },
        {
            title: 'Dev Assistant',
            desc: 'Generate clean, production ready code in seconds.',
            icon: Code,
            action: 'Generate Code',
            prompt: "Can you help me debug this React component and optimize its rendering performance?"
        },
    ];

    return (
        <div className="flex h-[calc(100vh-80px)] w-full bg-[#09080b] text-[#d1d5db] overflow-hidden font-sans relative">
            {/* Mobile Sidebar Toggle */}
            <button
                onClick={() => setIsGatituSidebarOpen(!isGatituSidebarOpen)}
                className="lg:hidden absolute top-4 left-4 z-50 p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-all shadow-xl"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Sidebar */}
            <aside className={clsx(
                "fixed lg:relative inset-y-0 left-0 w-72 zyricon-glass border-r border-white/5 flex flex-col p-6 z-40 transition-transform duration-300 transform lg:translate-x-0",
                isGatituSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center space-x-3 opacity-50 grayscale hover:grayscale-0 transition-all">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                        </div>
                        <span className="text-sm font-mono tracking-widest text-gray-500 uppercase">Gateway_Nexus</span>
                    </div>
                    <button onClick={() => setIsGatituSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <button
                    onClick={handleNewChat}
                    className="flex items-center space-x-3 w-full bg-purple-500/10 hover:bg-purple-500/20 transition-all p-3 rounded-xl mb-8 border border-purple-500/20 group shadow-[0_0_15px_rgba(168,85,247,0.05)]"
                >
                    <Plus className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
                    <span className="font-mono text-xs uppercase tracking-widest font-bold">New Chat</span>
                </button>

                <nav className="flex-1 space-y-6">
                    <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400/50 font-bold px-4 mb-4 font-mono">Features</p>
                        <NavItem icon={MessageSquare} label="Chat" active={activeTab === 'Chat'} onClick={() => setActiveTab('Chat')} />
                        <NavItem icon={Archive} label="Archived" active={activeTab === 'Archived'} onClick={() => setActiveTab('Archived')} />
                        <NavItem icon={Library} label="Library" active={activeTab === 'Library'} onClick={() => setActiveTab('Library')} />
                    </div>

                    <div className="space-y-2 pt-4">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400/50 font-bold px-4 mb-4 font-mono">Workspaces</p>
                        <NavItem icon={LayoutGrid} label="New Project" active={activeTab === 'New Project'} onClick={() => setActiveTab('New Project')} />
                        <NavItem icon={ImageIcon} label="Image" active={activeTab === 'Image'} onClick={() => setActiveTab('Image')} />
                        <NavItem icon={Presentation} label="Presentation" active={activeTab === 'Presentation'} onClick={() => setActiveTab('Presentation')} />
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative flex flex-col p-8 overflow-hidden bg-black">
                <header className="flex justify-between items-center px-4 mb-8">
                    <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:bg-white/10 cursor-pointer transition-all">
                        <span className="text-sm font-medium">Llama 3 (Groq Direct)</span>
                        <ArrowUp className="w-4 h-4 rotate-180 text-gray-500" />
                    </div>

                    <div className="flex items-center space-x-3">
                        <button className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:bg-white/10 transition-all text-sm">
                            <Settings className="w-4 h-4" />
                            <span>Configuration</span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-4 w-full flex flex-col items-center">
                    <div className="w-full max-w-4xl flex-1 flex flex-col">
                        {messages.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center -mt-12">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-12 text-center"
                                >
                                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tighter font-mono">GATITU<span className="text-purple-500">.AI</span></h1>
                                    <p className="text-gray-500 font-mono text-xs uppercase tracking-[0.3em]">Groq Direct Implementation // v5.0.0</p>
                                </motion.div>

                                <div className="flex flex-wrap justify-center gap-4 mb-2">
                                    {actionChips.map(chip => (
                                        <button
                                            key={chip.label}
                                            onClick={() => handleSubmit(chip.prompt)}
                                            className="flex items-center space-x-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
                                        >
                                            <div className="p-2 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
                                                <chip.icon className="w-4 h-4 text-purple-400" />
                                            </div>
                                            <span className="text-xs font-light text-gray-400">{chip.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-12 px-4 pb-12">
                                    {featureCards.map((card) => (
                                        <button
                                            key={card.title}
                                            onClick={() => handleSubmit(card.prompt)}
                                            className="zyricon-glass p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group text-left"
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="p-3 bg-white/5 rounded-xl group-hover:text-purple-500 transition-colors">
                                                    <card.icon className="w-6 h-6" />
                                                </div>
                                            </div>
                                            <h3 className="text-white font-bold mb-2">{card.title}</h3>
                                            <p className="text-sm text-gray-500 leading-relaxed font-medium">{card.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="w-full space-y-8 py-8">
                                {messages.map((message) => (
                                    <div key={message.id} className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={clsx(
                                            "max-w-[80%] rounded-3xl p-5 zyricon-glass border border-white/5",
                                            message.role === 'user' ? "bg-purple-600/30 text-white shadow-[0_0_20px_rgba(147,51,234,0.15)]" : ""
                                        )}>
                                            <div className="text-sm font-light leading-relaxed whitespace-normal text-gray-300">
                                                <ReactMarkdown
                                                    components={{
                                                        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-white mt-8 mb-4 tracking-tight" {...props} />,
                                                        h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-white mt-6 mb-3 tracking-tight" {...props} />,
                                                        h3: ({ node, ...props }) => <h3 className="text-lg font-semibold text-white mt-5 mb-2" {...props} />,
                                                        p: ({ node, ...props }) => <p className="mb-4 last:mb-0 leading-relaxed" {...props} />,
                                                        ul: ({ node, ...props }) => <ul className="list-disc mb-4 pl-5 space-y-2 marker:text-purple-500" {...props} />,
                                                        ol: ({ node, ...props }) => <ol className="list-decimal mb-4 pl-5 space-y-2 marker:text-purple-500 font-mono marker:text-sm" {...props} />,
                                                        li: ({ node, ...props }) => <li className="pl-1 leading-relaxed" {...props} />,
                                                        strong: ({ node, ...props }) => <strong className="font-semibold text-purple-100 bg-white/5 px-1 rounded" {...props} />,
                                                        a: ({ node, ...props }) => <a className="text-purple-400 hover:text-purple-300 underline underline-offset-4 decoration-purple-500/30 hover:decoration-purple-400 transition-all font-medium" {...props} />,
                                                        blockquote: ({ node, ...props }) => <blockquote className="border-l-2 border-purple-500 pl-4 py-2 my-5 bg-purple-500/5 text-gray-400 rounded-r-xl italic" {...props} />,
                                                        code({ node, inline, className, children, ...props }: any) {
                                                            const match = /language-(\w+)/.exec(className || '')
                                                            return !inline && match ? (
                                                                <div className="rounded-xl overflow-hidden mt-6 mb-6 border border-white/10 shadow-2xl bg-[#09080b]">
                                                                    <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10 zyricon-glass">
                                                                        <span className="text-xs font-mono text-gray-400 capitalize">{match[1]}</span>
                                                                        <div className="flex space-x-2">
                                                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors cursor-pointer"></div>
                                                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 hover:bg-yellow-400 transition-colors cursor-pointer"></div>
                                                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 hover:bg-green-400 transition-colors cursor-pointer"></div>
                                                                        </div>
                                                                    </div>
                                                                    <SyntaxHighlighter
                                                                        {...props}
                                                                        PreTag="div"
                                                                        children={String(children).replace(/\n$/, '')}
                                                                        language={match[1]}
                                                                        style={vscDarkPlus}
                                                                        customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent', fontSize: '0.875rem' }}
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <code {...props} className="bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded-md font-mono text-[13px] border border-purple-500/20">
                                                                    {children}
                                                                </code>
                                                            )
                                                        }
                                                    }}
                                                >
                                                    {message.content.replace(/```json \[(RECIPE_CARD|GRAPH)\][\s\S]*?```/g, '').trim()}
                                                </ReactMarkdown>
                                            </div>
                                            {message.renderedComponent && (
                                                <div className="mt-6">
                                                    {message.renderedComponent}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isPending && (
                                    <div className="flex flex-col items-start">
                                        <div className="zyricon-glass border border-white/5 p-4 rounded-3xl flex items-center space-x-2">
                                            <div className="flex space-x-1">
                                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" />
                                            </div>
                                            <span className="text-xs font-mono text-gray-500 animate-pulse uppercase tracking-widest">Thinking...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full flex justify-center px-4 pb-4 pt-4 bg-gradient-to-t from-[#09080b] via-[#09080b]/80 to-transparent relative z-10 -mt-10">
                    <div className="w-full max-w-3xl">
                        <div className="zyricon-glass border border-white/10 rounded-3xl p-2 pl-4 shadow-2xl flex items-end space-x-2 relative transition-all focus-within:border-purple-500/40 focus-within:shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                            <Sparkles className="w-5 h-5 text-purple-500 mb-3.5 hidden sm:block" />
                            <textarea
                                value={value}
                                onChange={(e) => {
                                    setValue(e.target.value);
                                    e.target.style.height = 'auto';
                                    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit();
                                    }
                                }}
                                placeholder="Ask Anything..."
                                className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 resize-none min-h-[48px] max-h-[150px] text-base py-3 scrollbar-hide"
                                rows={1}
                            />
                            <div className="flex items-center space-x-2 mb-1 pr-1">
                                <button className="p-2 text-gray-500 hover:text-white transition-colors rounded-xl hover:bg-white/5 hidden sm:block">
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleSubmit()}
                                    disabled={!value || isPending}
                                    className="p-2.5 bg-purple-500 text-white rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:bg-purple-500/80 disabled:opacity-50 transition-all"
                                >
                                    <ArrowUp className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const NavItem: React.FC<{ icon: any, label: string, active?: boolean, onClick?: () => void }> = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all border ${active ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]' : 'text-gray-500 hover:bg-white/5 hover:text-white border-transparent'}`}
    >
        <Icon className="w-4 h-4" />
        <span className="text-[10px] font-mono uppercase tracking-widest">{label}</span>
    </button>
);

export default GatituAIDashboard;
