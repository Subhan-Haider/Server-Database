'use client';
import { 
    Terminal, 
    Copy, 
    CheckCircle2, 
    BookOpen, 
    Code2, 
    Link as LinkIcon,
    ChevronRight,
    Zap,
    Users,
    HardDrive
} from 'lucide-react';
import { useState } from 'react';

const installationSteps = [
    { title: 'Install SDK', command: 'npm install @aetherbase/sdk' },
    { title: 'Initialize Client', command: 'import { AetherBase } from "@aetherbase/sdk";\n\nconst db = new AetherBase({\n  apiKey: "ae_..._912k",\n  projectId: "aether-main-v2",\n  endpoint: "http://localhost:3001"\n});' },
    { title: 'Read Collection', command: 'const users = await db.collection("users").get();' },
    { title: 'Listen to Updates', command: 'db.collection("posts").onSnapshot((snapshot) => {\n  console.log("Live stream updated:", snapshot);\n});' },
];

export default function DocsPage() {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleCopy = (index: number, text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    }

    return (
        <div className="p-8 space-y-12 flex-1 overflow-y-auto">
            <header className="space-y-4">
                <div className="flex items-center gap-4 text-emerald-400">
                    <BookOpen className="w-8 h-8" />
                    <h1 className="text-4xl font-bold tracking-tight">Developer SDK Guide</h1>
                </div>
                <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
                    Everything you need to integrate <span className="text-white font-bold">AetherBase</span> into your application stack. Our ultra-lean JS/TS SDK handles authentication, database operations, and real-time streaming with zero overhead.
                </p>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                <main className="space-y-8">
                    {installationSteps.map((step, i) => (
                        <div key={step.title} className="space-y-4 group">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-xs font-bold text-zinc-500 group-hover:text-white transition-colors">
                                    {i + 1}
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 group-hover:text-emerald-400 transition-colors uppercase leading-none">
                                    {step.title}
                                </h3>
                            </div>
                            
                            <div className="relative glass rounded-2xl overflow-hidden border border-white/5 shadow-2xl shadow-black/80 ring-1 ring-white/0 group-hover:ring-white/10 transition-all">
                                <pre className="p-6 text-xs font-mono text-emerald-400 leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
                                    {step.command}
                                </pre>
                                <button 
                                    onClick={() => handleCopy(i, step.command)}
                                    className="absolute top-4 right-4 p-2 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-white transition-all active:scale-90"
                                >
                                    {copiedIndex === i ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    ))}
                </main>

                <aside className="space-y-8">
                    <div className="p-8 glass rounded-3xl space-y-6 relative group overflow-hidden border-indigo-500/10 hover:ring-1 hover:ring-indigo-500/20 transition-all cursor-pointer">
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full" />
                        <Code2 className="w-12 h-12 text-indigo-400" />
                        <div className="space-y-2">
                             <h4 className="text-xl font-bold uppercase tracking-tight">API Reference</h4>
                             <p className="text-sm text-zinc-500 leading-relaxed">
                                Explore full REST endpoint descriptions for complex backend integrations.
                             </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400 group-hover:gap-4 transition-all">
                            View REST API <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Realtime', icon: Zap, color: 'text-amber-500' },
                            { label: 'Cloud Auth', icon: Users, color: 'text-sky-500' },
                            { label: 'Storage', icon: HardDrive, color: 'text-emerald-500' },
                            { label: 'Gateway', icon: Terminal, color: 'text-rose-500' },
                        ].map(feature => (
                            <div key={feature.label} className="p-6 glass rounded-2xl flex flex-col gap-4 group/box hover:bg-white/[0.02] transition-colors cursor-pointer border-white/5">
                                <feature.icon className={`w-8 h-8 ${feature.color} opacity-40 group-hover/box:opacity-100 transition-all transform group-hover/box:scale-110`} />
                                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover/box:text-white transition-colors">{feature.label} Docs</span>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Library version: 1.0.0 (Latest)</span>
                        </div>
                        <LinkIcon className="w-4 h-4 text-zinc-800" />
                    </div>
                </aside>
            </div>
        </div>
    );
}
