import React, { useState } from 'react';
import {
    Plus, MessageSquare, Archive, Library, LayoutGrid,
    Image as ImageIcon, Presentation, Code,
    Settings, Share2, Mic, ArrowUp, Paperclip,
    Sparkles, BrainCircuit, ClipboardList, Menu, X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTambo, useTamboThreadInput, useTamboConfig } from '@tambo-ai/react';
import clsx from 'clsx';
import { useEffect } from 'react';

const GatituAIDashboard: React.FC = () => {
    const [isGatituSidebarOpen, setIsGatituSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Chat');
    const { messages } = useTambo();
    const { value, setValue, submit, isPending } = useTamboThreadInput();
    const config = useTamboConfig();

    useEffect(() => {
        console.log('[GatituAI] Messages:', messages);
        console.log('[GatituAI] Config:', config);
    }, [messages, config]);

    const handleAction = async (prompt: string) => {
        try {
            setValue(prompt);
            // Wait for state to update
            setTimeout(async () => {
                console.log('[GatituAI] Submitting via action:', prompt);
                await submit();
            }, 100);
        } catch (err) {
            console.error('[GatituAI] Action submit error:', err);
        }
    };

    const handleSubmit = async () => {
        try {
            console.log('[GatituAI] Submitting message:', value);
            await submit();
        } catch (err) {
            console.error('[GatituAI] Submit error:', err);
        }
    };

    const handleNewChat = () => {
        // Usually Tambo threads are managed via URL or context
        // For now we'll just clear the input and notify user functionality is ready
        setValue('');
        window.location.reload(); // Simple way to start fresh if state is volatile
    };
    const [activeWorkspace, setActiveWorkspace] = useState('New Project');

    const actionChips = [
        { label: 'Create Image', icon: ImageIcon },
        { label: 'Brainstorm', icon: BrainCircuit },
        { label: 'Make a plan', icon: ClipboardList },
    ];

    const featureCards = [
        {
            title: 'Image Generator',
            desc: 'Create high-quality images instantly from text.',
            icon: ImageIcon,
            action: 'Create Image'
        },
        {
            title: 'AI Presentation',
            desc: 'Turn ideas into engaging, professional presentations.',
            icon: Presentation,
            action: 'Make Slides'
        },
        {
            title: 'Dev Assistant',
            desc: 'Generate clean, production ready code in seconds.',
            icon: Code,
            action: 'Generate Code'
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

            {/* Sidebar - Responsive Backdrop */}
            {isGatituSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
                    onClick={() => setIsGatituSidebarOpen(false)}
                />
            )}

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

                <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-purple-900/40 to-[#09080b] border border-purple-500/20 relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
                    <p className="text-white font-bold text-sm mb-1">Upgrade to premium</p>
                    <p className="text-[10px] text-gray-400 mb-4 leading-tight">Boost productivity with seamless automation and responsive AI, built to adapt to your needs.</p>
                    <button className="w-full py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-sm font-medium border border-white/5">Upgrade</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative flex flex-col p-8 overflow-hidden bg-black">
                {/* Background Glows */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] zyricon-radial-glow -z-10 opacity-50" />

                {/* Header */}
                <header className="flex justify-between items-center px-4 mb-8">
                    <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:bg-white/10 cursor-pointer transition-all">
                        <span className="text-sm font-medium">Llama 3 (Groq)</span>
                        <ArrowUp className="w-4 h-4 rotate-180 text-gray-500" />
                    </div>

                    <div className="flex items-center space-x-3">
                        <button className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:bg-white/10 transition-all text-sm">
                            <Settings className="w-4 h-4" />
                            <span>Configuration</span>
                        </button>
                        <button className="flex items-center space-x-2 bg-purple-500 px-4 py-2 rounded-xl hover:bg-purple-500/80 transition-all text-sm font-medium shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                            <Share2 className="w-4 h-4" />
                            <span>Export</span>
                        </button>
                    </div>
                </header>

                {/* Messaging Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-4 w-full flex flex-col items-center">
                    <div className="w-full max-w-4xl flex-1 flex flex-col">
                        {messages.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center -mt-12">
                                {/* Hero Section */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-12 text-center animate-float"
                                >
                                    <div className="relative w-20 h-20 mx-auto mb-8">
                                        <div className="absolute inset-0 bg-purple-500/40 rounded-full blur-xl animate-pulse" />
                                        <div className="relative w-full h-full bg-gradient-to-tr from-purple-500 to-blue-400 rounded-full p-1">
                                            <div className="w-full h-full bg-[#09080b] rounded-full flex items-center justify-center">
                                                <Sparkles className="w-10 h-10 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 text-glow tracking-tighter font-mono">GATITU<span className="text-purple-500">.AI</span></h1>
                                    <p className="text-cyber-gray max-w-lg mx-auto font-mono text-xs uppercase tracking-[0.3em]">Groq-Powered Intelligence // v4.0.2</p>
                                </motion.div>

                                {/* Action Chips */}
                                <div className="flex flex-wrap justify-center gap-4 mb-2">
                                    {actionChips.map((chip) => (
                                        <button
                                            key={chip.label}
                                            onClick={() => handleAction(chip.label)}
                                            className="flex items-center space-x-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all group"
                                        >
                                            <chip.icon className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                                            <span className="text-sm font-medium tracking-wide">{chip.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="w-full space-y-8 py-8">
                                {messages.map((message) => (
                                    <div key={message.id} className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[85%] p-5 rounded-3xl ${message.role === 'user' ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.2)]' : 'zyricon-glass border border-white/5 text-[#d1d5db]'}`}>
                                            <div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
                                                {typeof message.content === 'string'
                                                    ? message.content
                                                    : Array.isArray(message.content)
                                                        ? message.content.map((part, i) => (part.type === 'text' ? part.text : null))
                                                        : String(message.content)
                                                }
                                            </div>
                                        </div>
                                        {(message as any).renderedComponent && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="w-full mt-4"
                                            >
                                                {(message as any).renderedComponent}
                                            </motion.div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Input & Features Center Container */}
                <div className="w-full flex flex-col items-center px-4 pb-8">
                    {/* Search Input Box */}
                    <div className="w-full max-w-3xl">
                        <div className="zyricon-glass border border-white/10 rounded-2xl p-4 shadow-2xl">
                            <div className="flex items-start space-x-3 mb-4">
                                <Sparkles className="w-5 h-5 text-purple-500 mt-1" />
                                <textarea
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            submit();
                                        }
                                    }}
                                    placeholder="Ask Anything..."
                                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 resize-none h-20 text-lg scrollbar-hide"
                                />
                            </div>

                            <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                <div className="flex items-center space-x-4">
                                    <button className="flex items-center space-x-2 text-gray-500 hover:text-white transition-colors text-sm font-medium">
                                        <Paperclip className="w-4 h-4" />
                                        <span className="hidden sm:inline">Attach</span>
                                    </button>
                                    <button className="flex items-center space-x-2 text-gray-500 hover:text-white transition-colors text-sm font-medium">
                                        <Settings className="w-4 h-4" />
                                        <span className="hidden sm:inline">Settings</span>
                                    </button>
                                    <button className="flex items-center space-x-2 text-gray-500 hover:text-white transition-colors text-sm font-medium">
                                        <LayoutGrid className="w-4 h-4" />
                                        <span className="hidden sm:inline">Options</span>
                                    </button>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <button className="p-2 text-gray-500 hover:text-white transition-colors rounded-xl bg-white/5">
                                        <Mic className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!value || isPending}
                                        className="p-2 bg-purple-500 text-white rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:bg-purple-500/80 disabled:opacity-50 transition-all"
                                    >
                                        <ArrowUp className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature Cards - Only show on Home */}
                    {messages.length === 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-12">
                            {featureCards.map((card) => (
                                <div
                                    key={card.title}
                                    onClick={() => handleAction(card.title)}
                                    className="zyricon-glass p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 bg-white/5 rounded-xl group-hover:text-purple-500 transition-colors">
                                            <card.icon className="w-6 h-6" />
                                        </div>
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 bg-white/5 px-2 py-1 rounded-md">{card.action}</span>
                                    </div>
                                    <h3 className="text-white font-bold mb-2">{card.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed font-medium">{card.desc}</p>
                                </div>
                            ))}
                        </div>
                    )}
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
