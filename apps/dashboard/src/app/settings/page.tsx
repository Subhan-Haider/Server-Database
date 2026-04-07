'use client';
import { 
    Settings, 
    Save, 
    Trash2, 
    Link as LinkIcon, 
    Globe, 
    Zap, 
    AlertCircle,
    Info,
    ChevronDown,
    Building2,
    Mail,
    Bell,
    ShieldAlert,
    Webhook,
    Database
} from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="p-8 space-y-8 flex-1 overflow-y-auto">
            <header className="flex items-center justify-between">
                 <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-4">
                        <Settings className="w-8 h-8 text-zinc-500" /> Platform Configuration
                    </h1>
                    <p className="text-zinc-400">Manage project preferences and integration endpoints.</p>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row gap-8">
                <main className="flex-1 space-y-8">
                    {/* General Settings */}
                    <div className="glass rounded-3xl p-8 space-y-8 relative overflow-hidden group hover:ring-1 hover:ring-white/5 transition-all">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 leading-none">Project Identity</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Display Name</label>
                                <input 
                                    defaultValue="Production Backend" 
                                    className="w-full h-12 bg-[#1e1e24] px-4 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-white/10 transition-all shadow-inner shadow-black/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Project Identifier (ID)</label>
                                <div className="relative group/id cursor-help">
                                    <input 
                                        readOnly
                                        value="aether-main-v2" 
                                        className="w-full h-12 bg-[#09090b] px-4 rounded-xl text-sm font-bold border border-white/5 text-zinc-600 outline-none"
                                    />
                                    <LinkIcon className="w-4 h-4 text-zinc-800 absolute right-4 top-1/2 -translate-y-1/2 group-hover/id:text-white transition-colors" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enterprise Features */}
                    <div className="glass rounded-3xl p-8 space-y-8 border-indigo-500/10">
                        <div className="flex items-center gap-3 mb-4">
                            <Zap className="w-5 h-5 text-indigo-400" />
                            <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400">Enterprise Features</h3>
                        </div>

                        {/* Audit Logging */}
                        <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-4">
                                <ShieldAlert className="w-8 h-8 text-emerald-500" />
                                <div>
                                    <h4 className="text-sm font-bold text-white">Forensic Audit Logging</h4>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Record immutable history of all mutations</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                            </label>
                        </div>

                        {/* Webhooks */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Webhook className="w-8 h-8 text-fuchsia-500" />
                                <div>
                                    <h4 className="text-sm font-bold text-white">Asynchronous Webhooks</h4>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Push real-time events to external endpoints</p>
                                </div>
                            </div>
                            <div className="bg-[#1e1e24] p-4 rounded-xl border border-white/5 space-y-4">
                                <div className="flex gap-4">
                                    <input placeholder="https://api.example.com/v1/webhook" className="flex-1 bg-black/50 px-4 py-3 rounded-lg text-xs font-mono text-zinc-300 outline-none focus:ring-1 ring-fuchsia-500/50" defaultValue="https://aether-analytics.app/hook" />
                                    <button className="px-6 py-2 bg-fuchsia-600/20 text-fuchsia-400 hover:bg-fuchsia-600/40 rounded-lg text-xs font-bold uppercase transition-all">Add Endpoint</button>
                                </div>
                                <div className="text-[10px] text-zinc-500 uppercase tracking-widest flex gap-2">
                                    <span className="bg-fuchsia-500/10 text-fuchsia-400 px-2 py-1 rounded">document.created</span>
                                    <span className="bg-fuchsia-500/10 text-fuchsia-400 px-2 py-1 rounded">document.updated</span>
                                    <span className="bg-fuchsia-500/10 text-fuchsia-400 px-2 py-1 rounded">file.uploaded</span>
                                </div>
                            </div>
                        </div>

                        {/* Schemas */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Database className="w-8 h-8 text-cyan-500" />
                                <div>
                                    <h4 className="text-sm font-bold text-white">Strict Schema Validation</h4>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Enforce Zod data shapes at the protocol level</p>
                                </div>
                            </div>
                            <textarea 
                                rows={4}
                                className="w-full bg-[#1e1e24] border border-white/5 p-4 rounded-xl text-xs font-mono text-zinc-300 outline-none focus:ring-1 ring-cyan-500/50 resize-none"
                                defaultValue={`{\n  "users": "z.object({ name: z.string(), age: z.number() })",\n  "posts": "z.object({ title: z.string() })"\n}`}
                            />
                        </div>
                    </div>

                    <button className="flex items-center gap-2 px-8 py-4 bg-white text-black text-xs font-bold uppercase rounded-xl hover:bg-zinc-200 transition-all active:scale-95 shadow-lg shadow-white/5">
                        <Save className="w-4 h-4" /> Save Enterprise Config
                    </button>

                    {/* Danger Zone */}
                    <div className="p-8 glass rounded-3xl border-rose-500/10 space-y-6 relative group overflow-hidden bg-gradient-to-br from-rose-500/5 via-transparent to-transparent">
                         <div className="flex items-center gap-4">
                            <Trash2 className="w-6 h-6 text-rose-500" />
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-rose-500">Hazardous Operations</h3>
                                <p className="text-xs text-zinc-600 font-medium">Permanently remove this project and all associated data.</p>
                            </div>
                         </div>
                         <div className="p-6 bg-black/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-rose-500/10">
                            <ul className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter list-disc list-inside space-y-1">
                                <li>Wipes 4.2GB of storage</li>
                                <li>Deactivates 142 sockets</li>
                                <li>Revokes 3 API Keys</li>
                            </ul>
                            <button className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold uppercase rounded-xl transition-all shadow-lg shadow-rose-900/50 hover:-translate-y-0.5">
                                Delete Infrastructure
                            </button>
                         </div>
                    </div>
                </main>

                <aside className="w-full lg:w-96 space-y-8">
                     <div className="p-8 glass rounded-3xl space-y-6 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent border-white/5">
                        <Zap className="w-10 h-10 text-amber-500" />
                        <h4 className="text-lg font-bold uppercase tracking-tight">System Global Status</h4>
                        <div className="space-y-4">
                            {[
                                { name: 'Next.js Frontend', state: 'active' },
                                { name: 'Fastify API Server', state: 'active' },
                                { name: 'MongoDB Instance', state: 'optimal' },
                                { name: 'Redis Pub/Sub', state: 'connected' },
                                { name: 'BullMQ Workers', state: 'listening' }
                            ].map(sys => (
                                <div key={sys.name} className="flex justify-between items-center px-1">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{sys.name}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter text-emerald-500">{sys.state}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
