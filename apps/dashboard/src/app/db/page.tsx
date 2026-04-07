'use client';
import { useState } from 'react';
import { 
    Plus, 
    Search, 
    MoreVertical, 
    Trash2, 
    Edit3, 
    Link as LinkIcon,
    Terminal,
    ChevronDown,
    FolderPlus
} from 'lucide-react';

const mockCollections = [
    { name: 'users', count: 124, id: '1' },
    { name: 'posts', count: 24, id: '2' },
    { name: 'comments', count: 98, id: '3' },
    { name: 'settings', count: 2, id: '4' },
];

const mockDocuments = [
    { _id: '64ac32f1b4a1c', data: { name: 'John Doe', email: 'john@example.com', role: 'admin' }, createdAt: '2023-07-10' },
    { _id: '64ac32f1b4a2d', data: { name: 'Jane Smith', email: 'jane@smith.io', role: 'user' }, createdAt: '2023-07-11' },
    { _id: '64ac32f1b4a3e', data: { name: 'Bob Wilson', email: 'bob@wilson.com', role: 'editor' }, createdAt: '2023-07-12' },
];

export default function DatabasePage() {
    const [selectedCollection, setSelectedCollection] = useState('users');

    return (
        <div className="h-screen flex flex-col">
            <header className="p-8 border-b border-[#1e1e24] flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Database Viewer</h1>
                    <p className="text-zinc-400">Browse and manage collections in real-time.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-zinc-200 transition-colors">
                        <Plus className="w-4 h-4" /> New Collection
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 glass text-sm font-semibold rounded-lg">
                        <Terminal className="w-4 h-4" /> Shell
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Collections Sidebar */}
                <aside className="w-72 border-r border-[#1e1e24] bg-[#09090b]/50 overflow-y-auto p-4 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Collections</p>
                    </div>

                    <div className="relative mb-2 px-2">
                        <Search className="w-4 h-4 text-zinc-500 absolute left-5 top-1/2 -translate-y-1/2" />
                        <input 
                            placeholder="Filter..." 
                            className="w-full bg-[#1e1e24] border-none rounded-lg py-2 pl-9 text-xs focus:ring-1 focus:ring-white/20 transition-all outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        {mockCollections.map(col => (
                            <button 
                                key={col.id} 
                                onClick={() => setSelectedCollection(col.name)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                                    selectedCollection === col.name ? 'sidebar-active text-white' : 'text-zinc-400 hover:text-white hover:bg-[#1e1e24]'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${selectedCollection === col.name ? 'bg-white' : 'bg-zinc-700'}`} />
                                    <span className="text-sm font-medium">{col.name}</span>
                                </div>
                                <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded-full font-mono text-zinc-500">{col.count}</span>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Documents Content */}
                <main className="flex-1 overflow-y-auto bg-[#09090b]">
                    <div className="p-8 space-y-6">
                        <div className="flex items-center justify-between bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-mono text-zinc-500">Collection:</span>
                                <span className="text-sm font-bold text-white px-3 py-1 bg-zinc-800 rounded-lg">{selectedCollection}</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="glass p-2 rounded-lg hover:bg-white/10 transition-all"><Edit3 className="w-4 h-4" /></button>
                                <button className="glass p-2 rounded-lg hover:bg-rose-500/20 hover:text-rose-400 text-rose-500/50 transition-all"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {mockDocuments.map((doc, i) => (
                                <div key={doc._id} className="p-6 glass rounded-xl border-l-[4px] border-emerald-500/50 group cursor-pointer hover:bg-white/[0.02] transition-all">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">ID</span>
                                            <span className="text-xs font-mono text-white bg-zinc-900 px-2 py-1 rounded">{doc._id}</span>
                                            <LinkIcon className="w-3 h-3 text-zinc-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="text-[10px] text-zinc-600 font-mono italic">Created {doc.createdAt}</div>
                                    </div>
                                    
                                    <div className="bg-black/40 rounded-lg p-4 relative font-mono text-xs overflow-x-auto text-emerald-400">
                                        <pre>{JSON.stringify(doc.data, null, 2)}</pre>
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="bg-zinc-800 text-white p-1.5 rounded hover:bg-zinc-700 transition-colors"><Plus className="w-3 h-3" /></button>
                                            <button className="bg-zinc-800 text-white p-1.5 rounded hover:bg-zinc-700 transition-colors"><MoreVertical className="w-3 h-3" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="flex items-center justify-center p-8">
                            <button className="flex items-center gap-2 text-zinc-500 hover:text-white text-sm transition-colors animate-bounce">
                                <Plus className="w-4 h-4" /> Load more items
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
