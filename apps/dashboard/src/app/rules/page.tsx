'use client';
import { useState } from 'react';
import { 
    Save, 
    RefreshCcw, 
    Play, 
    CheckCircle2, 
    AlertCircle,
    Info,
    ChevronDown,
} from 'lucide-react';

const exampleRules = `allow read: if auth.uid != null;
allow write: if auth.role == 'admin';

service aether {
  collection users {
    allow read: if true;
    allow write: if request.auth.uid == resource.id;
  }
}`;

export default function RulesPage() {
    const [rules, setRules] = useState(exampleRules);
    const [status, setStatus] = useState<'saved' | 'saving' | 'error' | 'idle'>('idle');

    const handleSave = () => {
        setStatus('saving');
        setTimeout(() => setStatus('saved'), 1000);
    }

    return (
        <div className="h-screen flex flex-col">
            <header className="p-8 border-b border-[#1e1e24] flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Security Rules</h1>
                    <p className="text-zinc-400">Declarative access control for your database.</p>
                </div>
                <div className="flex items-center gap-3">
                    {status === 'saved' && <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mr-4">
                        <CheckCircle2 className="w-4 h-4" /> Changes deployed
                    </div>}
                    <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50" disabled={status === 'saving'}>
                        {status === 'saving' ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {status === 'saving' ? 'Deploying...' : 'Deploy Changes'}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 glass text-sm font-semibold rounded-lg">
                        <Play className="w-4 h-4" /> Run Tests
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Editor Section */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="h-full glass rounded-2xl flex flex-col overflow-hidden">
                        <div className="p-3 border-b border-white/5 bg-[#1e1e24]/50 flex items-center justify-between">
                            <span className="text-xs font-mono text-zinc-500 font-medium">rules.aether</span>
                            <span className="text-[10px] text-zinc-600 bg-black/40 px-2 py-0.5 rounded uppercase tracking-tighter">Draft</span>
                        </div>
                        <div className="flex-1 relative font-mono text-sm">
                            <div className="absolute left-0 top-0 bottom-0 w-12 bg-zinc-900/40 text-zinc-700 flex flex-col items-center pt-4 text-xs gap-1 leading-5 select-none opacity-50">
                                {Array.from({length: 20}).map((_, i) => <div key={i}>{i+1}</div>)}
                            </div>
                            <textarea 
                                value={rules}
                                onChange={(e) => setRules(e.target.value)}
                                className="w-full h-full bg-transparent p-4 pl-16 outline-none resize-none text-zinc-300 transition-colors focus:text-white leading-relaxed"
                                spellCheck="false"
                            />
                        </div>
                    </div>
                </main>

                {/* Sidebar Helper */}
                <aside className="w-80 border-l border-[#1e1e24] bg-[#09090b]/50 p-6 space-y-6 overflow-y-auto">
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-wide text-zinc-500">
                           <Info className="w-4 h-4" /> Guide
                        </h3>
                        <p className="text-xs text-zinc-400 group leading-relaxed">
                            Rules follow a simple declarative syntax. Use <span className="text-emerald-400 font-mono">auth</span> to access the current session and <span className="text-emerald-400 font-mono">resource</span> for existing data.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-500">Quick Snippets</h3>
                        {[
                            'Authenticated only',
                            'Ownership check',
                            'Admin read only',
                            'Locked collection'
                        ].map(snippet => (
                            <button key={snippet} className="w-full text-left p-3 glass rounded-xl text-xs hover:bg-white/5 transition-all flex items-center justify-between group">
                                {snippet}
                                <ChevronDown className="w-3 h-3 text-zinc-600 group-hover:text-white" />
                            </button>
                        ))}
                    </div>

                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase">
                            <AlertCircle className="w-4 h-4" /> Warning
                        </div>
                        <p className="text-[10px] text-rose-400/80 leading-relaxed">
                            Removing ownership checks can expose sensitive data to all users in the project. Always test before deploying to production.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}
