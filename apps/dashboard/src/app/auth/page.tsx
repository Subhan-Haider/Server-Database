'use client';
import { 
    Plus, 
    Search, 
    MoreHorizontal, 
    Users as UsersIcon,
    Shield,
    Trash2,
    Lock,
    Unlock,
    Mail
} from 'lucide-react';

const mockUsers = [
    { id: '1', email: 'admin@aetherbase.com', roles: ['admin', 'platform-owner'], status: 'verified', lastActive: '2h ago' },
    { id: '2', email: 'dev-team@github.com', roles: ['developer'], status: 'verified', lastActive: '10m ago' },
    { id: '3', email: 'test-user@mail.com', roles: ['user'], status: 'unverified', lastActive: '3d ago' },
];

export default function AuthPage() {
    return (
        <div className="p-8 space-y-8">
            <header className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-4">
                        <UsersIcon className="w-8 h-8 text-zinc-500" /> Authentication
                    </h1>
                    <p className="text-zinc-400">Manage user identities and access control lists.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-zinc-200 transition-colors">
                        <Plus className="w-4 h-4" /> Add User
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 glass text-sm font-semibold rounded-lg">
                        <Shield className="w-4 h-4" /> Manage Roles
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Users', value: '1,242', icon: UsersIcon },
                    { label: 'Verified', value: '98%', icon: Mail },
                    { label: 'Active (24h)', value: '342', icon: Shield },
                ].map(stat => (
                    <div key={stat.label} className="p-6 glass rounded-xl flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-lg text-white">
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="glass rounded-2xl overflow-hidden border border-white/5">
                <div className="p-6 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                    <div className="relative w-96">
                        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            placeholder="Find by email or identifier..." 
                            className="w-full bg-[#1e1e24] border-none rounded-lg py-2 pl-10 text-sm outline-none focus:ring-1 focus:ring-white/20 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/40 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                <th className="px-6 py-4">User Identity</th>
                                <th className="px-6 py-4">Security Roles</th>
                                <th className="px-6 py-4">Verification</th>
                                <th className="px-6 py-4 text-right">Last Session</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {mockUsers.map(user => (
                                <tr key={user.id} className="group hover:bg-white/[0.01] transition-colors leading-relaxed">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 font-medium">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10" />
                                            <span className="text-sm font-semibold">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            {user.roles.map(role => (
                                                <span key={role} className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full uppercase tracking-tighter font-bold">
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`flex items-center gap-2 text-xs font-semibold ${user.status === 'verified' ? 'text-emerald-400' : 'text-zinc-500'}`}>
                                            {user.status === 'verified' ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                            {user.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-xs font-mono text-zinc-500 italic lowercase">{user.lastActive}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-20 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                                            <button className="p-2 hover:bg-rose-500/20 text-rose-500/60 hover:text-rose-400 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
