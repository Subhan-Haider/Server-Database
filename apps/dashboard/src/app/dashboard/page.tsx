'use client';
import { 
  Activity, 
  Database, 
  Users, 
  HardDrive, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Mon', reads: 4000, writes: 2400 },
  { name: 'Tue', reads: 3000, writes: 1398 },
  { name: 'Wed', reads: 2000, writes: 9800 },
  { name: 'Thu', reads: 2780, writes: 3908 },
  { name: 'Fri', reads: 1890, writes: 4800 },
  { name: 'Sat', reads: 2390, writes: 3800 },
  { name: 'Sun', reads: 3490, writes: 4300 },
];

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
        <p className="text-zinc-400">Welcome back. Here is what is happening with AetherBase.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Projects', value: '12', change: '+2', icon: Activity, trend: 'up' },
          { label: 'Total Reads', value: '1.2M', change: '+12%', icon: Database, trend: 'up' },
          { label: 'Active Users', value: '842', change: '-3%', icon: Users, trend: 'down' },
          { label: 'Storage Used', value: '4.2GB', change: '+0.5%', icon: HardDrive, trend: 'up' },
        ].map((stat) => (
          <div key={stat.label} className="p-6 glass rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <stat.icon className="w-5 h-5 text-zinc-400" />
              <div className={`flex items-center text-xs font-medium ${stat.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 ml-1" /> : <ArrowDownRight className="w-3 h-3 ml-1" />}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="p-6 glass rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold">Operation Throughput</h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-white rounded-full"/> Reads</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-zinc-600 rounded-full"/> Writes</div>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorReads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fff" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#fff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e1e24" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
              <Tooltip 
                contentStyle={{backgroundColor: '#1e1e24', border: 'none', borderRadius: '8px', color: '#fff'}}
                itemStyle={{color: '#fff'}}
              />
              <Area type="monotone" dataKey="reads" stroke="#fff" fillOpacity={1} fill="url(#colorReads)" strokeWidth={2} />
              <Area type="monotone" dataKey="writes" stroke="#52525b" fillOpacity={0} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 glass rounded-xl h-64 flex flex-col items-center justify-center text-center space-y-2">
            <Zap className="w-8 h-8 text-yellow-400 animate-pulse" />
            <h3 className="font-semibold">System Health: Optimal</h3>
            <p className="text-sm text-zinc-400 max-w-xs">All regions are currently operative. API latency is averaging 24ms.</p>
        </div>
        <div className="p-6 glass rounded-xl h-64 overflow-hidden relative">
            <h3 className="font-semibold mb-4">Active Deployments</h3>
            <div className="space-y-4">
                {[1,2,3].map(i => (
                    <div key={i} className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <div className="flex-1">
                            <p className="text-sm font-medium">project-alpha-v{i}.aetherbase.app</p>
                            <p className="text-xs text-zinc-500">Deployed 2h ago</p>
                        </div>
                        <span className="text-xs font-mono bg-zinc-800 px-2 py-1 rounded">2.4MB</span>
                    </div>
                ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
