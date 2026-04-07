'use client';
import { 
    Plus, 
    Key, 
    Trash2, 
    RefreshCcw, 
    Link as LinkIcon, 
    Activity,
    Lock,
    Unlock,
    Info,
    ChevronDown,
} from 'lucide-react';
import { useState } from 'react';

const mockKeys = [
    { id: '1', label: 'Main Backend SDK', key: 'ae_842k_..._912k', status: 'active', lastUsed: '2m ago', createdAt: '2023-01-12' },
    { id: '2', label: 'Frontend Client (Web)', key: 'ae_742x_..._124f', status: 'active', lastUsed: '10m ago', createdAt: '2023-02-15' },
    { id: '3', label: 'Mobile App (iOS)', key: 'ae_912f_..._241d', status: 'revoked', lastUsed: '4d ago', createdAt: '2023-03-20' },
];

export default function APIKeysPage() {
    const [keys, setKeys] = useState(mockKeys);

    return (
        <div className="p-8 space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-4">
                        <Key className="w-8 h-8 text-zinc-500" /> API Access Tokens
                    </h1>
                    <p className="text-zinc-400">Secure entry points for your project applications.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold rounded-xl hover:bg-zinc-200 transition-all active:scale-95 shadow-lg shadow-white/10">
                        <Plus className="w-5 h-5" /> Generate Key
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 glass text-sm font-semibold rounded-lg hover:bg-white/5 transition-colors">
                        <Info className="w-4 h-4" /> Usage Docs
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 px-1 flex items-center gap-2">
                       <Activity className="w-4 h-4" /> Active Keys
                    </h3>
                    <div className="space-y-4">
                        {keys.map(k => (
                            <div key={k.id} className={`p-6 glass rounded-2xl border-l-4 transition-all relative group shadow-2xl shadow-black/80 ${k.status === 'active' ? 'border-emerald-500/50 hover:bg-white/[0.02]' : 'border-zinc-800 opacity-50 grayscale hover:opacity-100 transition-opacity'}`}>
                                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                                    <button className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"><RefreshCcw className="w-3 h-3" /></button>
                                    <button className="p-2 bg-zinc-800 hover:bg-rose-500 text-white rounded-lg transition-colors"><Trash2 className="w-3 h-3" /></button>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-white uppercase tracking-tight">{k.label}</p>
                                            <p className="text-[10px] text-zinc-600 font-mono italic">Created at {k.createdAt}</p>
                                        </div>
                                        <div className={`p-2 rounded-lg bg-zinc-900 border border-white/5 ${k.status === 'active' ? 'text-emerald-500' : 'text-zinc-600'}`}>
                                            {k.status === 'active' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                        </div>
                                    </div>
                                    
                                    <div className="bg-black/50 rounded-xl p-4 flex items-center justify-between group/key cursor-pointer hover:bg-black/80 transition-all active:scale-[0.99]">
                                        <span className="font-mono text-xs text-zinc-400 group-hover/key:text-emerald-400 transition-colors tracking-widest">
                                            {k.key}
                                        </span>
                                        <LinkIcon className="w-3 h-3 text-zinc-700 group-hover/key:text-white transition-all transform group-hover/key:scale-110" />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 w-1/3 opacity-20" />
                                        </div>
                                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">Last used {k.lastUsed}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-8 glass rounded-3xl space-y-6 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent border-indigo-500/10">
                        <Activity className="w-12 h-12 text-indigo-400" />
                        <div className="space-y-2">
                             <h3 className="text-xl font-bold uppercase tracking-tight">Key Security Protocol</h3>
                             <p className="text-sm text-zinc-400 leading-relaxed">
                                API keys provide full database access by default. Never expose them in client-side code unless specific <span className="text-emerald-400 font-bold underline cursor-help hover:text-emerald-300 transition-colors">security rules</span> are in place to restrict access.
                             </p>
                        </div>
                        <ul className="space-y-3 text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                            <li className="flex items-center gap-3 hover:text-white transition-colors cursor-default"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50" /> Rotate keys every 90 days</li>
                            <li className="flex items-center gap-3 hover:text-white transition-colors cursor-default"><div className="w-1.5 h-1.5 bg-sky-500 rounded-full shadow-lg shadow-sky-500/50" /> Limit by IP or Domain</li>
                            <li className="flex items-center gap-3 hover:text-white transition-colors cursor-default"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-lg shadow-amber-500/50" /> Monitor usage anomalies</li>
                        </ul>
                    </div>

                    <div className="p-8 glass rounded-3xl border-white/5 flex items-center justify-between group hover:bg-white/[0.02] cursor-pointer transition-all">
                        <div className="space-y-1">
                             <h4 className="text-sm font-bold uppercase tracking-widest">Restrict Origin</h4>
                             <p className="text-xs text-zinc-500 font-medium">Add HTTP referrers to prevent unauthorized usage.</p>
                        </div>
                        <ChevronDown className="w-5 h-5 text-zinc-600 group-hover:text-white transition-transform group-hover:translate-y-1" />
                    </div>
                </div>
            </div>
        </div>
    );
}
