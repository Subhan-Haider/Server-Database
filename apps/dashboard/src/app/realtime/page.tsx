'use client';
import { 
    Zap, 
    Activity, 
    Terminal, 
    Link as LinkIcon, 
    RefreshCcw, 
    CheckCircle2, 
    Clock,
    Globe,
    ChevronDown,
    ZapOff,
    MoreVertical
} from 'lucide-react';

const mockLogs = [
    { id: '1', event: 'doc.updated', collection: 'posts', user: 'admin@aetherbase.com', status: 'delivered', time: '12s ago' },
    { id: '2', event: 'coll.subscribed', collection: 'users', user: 'anon-342', status: 'pending', time: '45s ago' },
    { id: '3', event: 'doc.deleted', collection: 'comments', user: 'moderator-01', status: 'delivered', time: '2m ago' },
    { id: '4', event: 'presence.online', collection: 'n/a', user: 'dev-team@github.com', status: 'delivered', time: '5m ago' },
];

export default function RealtimePage() {
    return (
        <div className="p-8 space-y-8 flex-1 overflow-y-auto">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-4">
                        <Zap className="w-8 h-8 text-yellow-500 animate-pulse" /> Realtime Pulse
                    </h1>
                    <p className="text-zinc-400">Live event broadcasting and connection monitoring.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest rounded-lg border border-emerald-500/20 flex items-center gap-2">
                        <Activity className="w-3 h-3" /> Live
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 glass text-sm font-semibold rounded-lg hover:bg-white/5 transition-colors">
                        <Terminal className="w-4 h-4" /> Watch Logs
                    </button>
                    <button className="p-2 glass rounded-lg hover:bg-white/5 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {[
                    { label: 'Active Sockets', value: '142', icon: LinkIcon, color: 'text-indigo-400' },
                    { label: 'Avg Latency', value: '24ms', icon: Clock, color: 'text-emerald-400' },
                    { label: 'Throughput', value: '1.2k/s', icon: Globe, color: 'text-sky-400' },
                ].map(stat => (
                    <div key={stat.label} className="p-6 glass rounded-2xl flex items-center gap-4 border border-white/5 hover:ring-1 hover:ring-white/10 transition-all cursor-default">
                        <div className={`p-4 bg-white/5 rounded-xl ${stat.color} shadow-lg shadow-black/50`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest leading-none">{stat.label}</p>
                            <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <main className="flex-1 space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 px-1">Live Event Stream</h3>
                    <div className="glass rounded-3xl overflow-hidden border border-white/5">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/[0.02] text-xs font-bold text-zinc-600 uppercase tracking-wider">
                                        <th className="px-6 py-4">Event Type</th>
                                        <th className="px-6 py-4">Context</th>
                                        <th className="px-6 py-4">Origin</th>
                                        <th className="px-6 py-4 text-right">State</th>
                                        <th className="px-6 py-4 text-right">Age</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 font-medium">
                                    {mockLogs.map(log => (
                                        <tr key={log.id} className="group hover:bg-white/[0.01] transition-all cursor-crosshair active:scale-[0.99] group/row">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${log.event.startsWith('doc') ? 'bg-indigo-400' : 'bg-emerald-400'} animate-pulse`} />
                                                    <span className="text-sm font-bold tracking-tight group-hover/row:text-white transition-colors">{log.event}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-mono text-zinc-500 bg-zinc-900 border border-white/5 px-2 py-1 rounded truncate max-w-[120px] block uppercase tracking-tighter">
                                                    {log.collection}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs italic text-zinc-600 truncate max-w-[180px]">
                                                {log.user}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter ${log.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'}`}>
                                                    {log.status === 'delivered' ? <CheckCircle2 className="w-3 h-3" /> : <RefreshCcw className="w-3 h-3 animate-spin" />}
                                                    {log.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-[10px] text-zinc-600">
                                                {log.time}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>

                <aside className="w-full lg:w-96 space-y-8">
                    <div className="p-8 glass rounded-3xl space-y-6 relative overflow-hidden group shadow-2xl shadow-indigo-500/5">
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Activity className="w-10 h-10 text-indigo-400" />
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold uppercase tracking-tight">Active Presence</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                                Realtime engine leverages <span className="text-indigo-400 font-bold">Redis Pub/Sub</span> for ultra-low latency broadcasting across distributed server instances.
                            </p>
                        </div>
                        <div className="p-4 bg-zinc-900 rounded-2xl flex items-center justify-between group/btn cursor-pointer active:scale-95 transition-all">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest group-hover/btn:text-white transition-colors">Presence System</span>
                            <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                        </div>
                    </div>

                    <div className="p-8 glass rounded-3xl border-white/5 space-y-6 hover:ring-1 hover:ring-yellow-500/10 transition-all">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Infrastructure</h4>
                            <div className="px-2 py-0.5 bg-zinc-800 text-zinc-500 text-[10px] font-mono rounded tracking-tighter">v.2.4.1</div>
                        </div>
                        <div className="space-y-4">
                            {[
                                { name: 'Redis Adapter', status: 'connected' },
                                { name: 'Socket Server', status: 'optimal' },
                                { name: 'Pub/Sub Stream', status: 'standby' }
                            ].map(serv => (
                                <div key={serv.name} className="flex items-center justify-between px-2">
                                    <span className="text-xs font-bold text-zinc-300 uppercase tracking-tight">{serv.name}</span>
                                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-tighter text-zinc-500 font-bold italic">
                                        {serv.status}
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
