'use client';
import { 
    DownloadCloud, 
    Link as LinkIcon, 
    MoreVertical, 
    Plus, 
    Search, 
    Trash2, 
    FolderOpen,
    FileText,
    Image as ImageIcon,
    FileCode,
    ChevronDown,
    Activity
} from 'lucide-react';

const mockFiles = [
    { id: '1', name: 'user-avatar-12.png', type: 'image', size: '2.4MB', uploadedAt: '12m ago', url: '#' },
    { id: '2', name: 'app-config-backup.json', type: 'json', size: '12KB', uploadedAt: '2h ago', url: '#' },
    { id: '3', name: 'legal-docs-final.pdf', type: 'pdf', size: '12.8MB', uploadedAt: '1d ago', url: '#' },
    { id: '4', name: 'hero-banner-main.webp', type: 'image', size: '4.2MB', uploadedAt: '3d ago', url: '#' },
];

export default function StoragePage() {
    return (
        <div className="p-8 space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">File Storage</h1>
                    <p className="text-zinc-400">Securely store and serve your application assets.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold rounded-xl hover:bg-zinc-200 transition-all active:scale-95">
                        <Plus className="w-5 h-5" /> Upload File
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 glass text-sm font-semibold rounded-lg hover:bg-white/5 transition-colors">
                        <Activity className="w-4 h-4" /> Quotas
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Storage Used', value: '4.2 GB', total: '10 GB', color: 'bg-emerald-500' },
                    { label: 'Bandwidth', value: '12.4 GB', total: '50 GB', color: 'bg-sky-500' },
                    { label: 'Requests', value: '1.2M', total: '10M', color: 'bg-amber-500' },
                    { label: 'Files', value: '124', total: '∞', color: 'bg-indigo-500' },
                ].map(stat => (
                    <div key={stat.label} className="p-6 glass rounded-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest leading-none">{stat.label}</span>
                            <span className="text-xs font-mono text-zinc-400">{stat.value}</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div className={`h-full ${stat.color} transition-all duration-1000`} style={{width: '42%'}} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex-1 glass rounded-3xl overflow-hidden shadow-2xl shadow-black/80">
                <div className="p-6 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4 bg-[#1e1e24] px-4 py-2 rounded-xl">
                        <Search className="w-4 h-4 text-zinc-500" />
                        <input 
                            placeholder="Filter your file repository..." 
                            className="bg-transparent border-none outline-none text-sm w-96 placeholder:text-zinc-600 font-medium"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
                    {mockFiles.map(file => (
                        <div key={file.id} className="glass rounded-2xl p-5 group relative hover:ring-1 hover:ring-white/20 transition-all cursor-pointer">
                            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded"><LinkIcon className="w-3 h-3" /></button>
                                <button className="p-1.5 bg-zinc-800 hover:bg-rose-500 text-white rounded"><Trash2 className="w-3 h-3" /></button>
                            </div>
                            
                            <div className="aspect-square bg-zinc-900/50 rounded-xl flex items-center justify-center mb-4 border border-white/5">
                                {file.type === 'image' ? <ImageIcon className="w-10 h-10 text-emerald-400/50" /> : <FileText className="w-10 h-10 text-sky-400/50" />}
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm font-bold truncate group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{file.name}</p>
                                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono italic">
                                    <span className="uppercase">{file.size}</span>
                                    <span>{file.uploadedAt}</span>
                                </div>
                            </div>

                            <button className="mt-4 w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-2">
                                <DownloadCloud className="w-3 h-3" /> Get Assets
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
