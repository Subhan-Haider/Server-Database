'use client';
import { 
  Database, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Globe, 
  ArrowRight,
  Monitor,
  Layout,
  Terminal,
  Activity,
  ChevronRight,
  Play
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#000] text-white overflow-hidden font-sans relative">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vh] bg-indigo-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vh] bg-fuchsia-600/10 rounded-full blur-[120px]" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase font-bold tracking-widest text-[#fff] mb-6"
        >
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          AetherBase Engine v2.4 Now Operational
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white mb-8"
        >
          The Cloud is <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-amber-400">Your Machine</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12"
        >
          A high-performance, self-hostable Backend-as-a-Service interface. 
          Real-time sync, secure document storage, and distributed logic at the speed of light.
        </motion.p>

        <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5, delay: 0.6 }}
           className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/dashboard" className="px-10 py-5 bg-white text-black text-sm font-bold uppercase rounded-2xl hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)] flex items-center gap-3">
            Enter Management Console <ChevronRight className="w-4 h-4" />
          </Link>
          <button className="px-10 py-5 bg-zinc-900 border border-white/10 text-white text-sm font-bold uppercase rounded-2xl hover:bg-zinc-800 transition-all flex items-center gap-3">
             <Play className="w-4 h-4 fill-current" /> View Demo
          </button>
        </motion.div>

        {/* Feature Dashboard Preview Card */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
          className="mt-24 w-full max-w-5xl relative group"
        >
           {/* Cyber Frame */}
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent rounded-[40px] blur-2xl opacity-50 transition-all group-hover:opacity-80" />
          <div className="relative glass border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
              <div className="h-10 bg-white/5 border-b border-white/10 flex items-center px-6 gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
                 <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                 <div className="flex-1 text-[10px] uppercase tracking-widest text-zinc-500 font-bold text-center pl-10">
                    AetherBase - Protocol Layer [ONLINE]
                 </div>
              </div>
              <div className="p-8 grid grid-cols-3 gap-6 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                  <div className="h-48 bg-white/5 rounded-2xl border border-white/5 p-6 space-y-4">
                     <Database className="w-6 h-6 text-indigo-400" />
                     <div className="h-2 w-2/3 bg-white/10 rounded" />
                     <div className="h-2 w-full bg-white/5 rounded" />
                     <div className="h-2 w-1/2 bg-white/5 rounded" />
                  </div>
                  <div className="h-48 bg-white/5 rounded-2xl border border-white/5 p-6 space-y-4">
                     <Activity className="w-6 h-6 text-fuchsia-400" />
                     <div className="flex items-end gap-1 h-20 pt-10">
                        {[4,8,12,6,10,14,5].map((h, i) => (
                           <div key={i} className="flex-1 bg-fuchsia-500/50 rounded-sm" style={{ height: `${h*5}%` }} />
                        ))}
                     </div>
                  </div>
                  <div className="h-48 bg-white/5 rounded-2xl border border-white/5 p-6 space-y-4">
                     <ShieldCheck className="w-6 h-6 text-emerald-400" />
                     <div className="h-12 w-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                  </div>
              </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto py-32 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[
             { title: "Distributed Database", icon: Database, color: "indigo", desc: "Schemaless document management with JSON native support and zero-latency indexing." },
             { title: "Real-time Protocol", icon: zap, color: "yellow", desc: "Sub-50ms synchronization across thousands of concurrent sockets powered by Redis." },
             { title: "Edge Logic", icon: Cpu, color: "fuchsia", desc: "Isomorphic security rules engine performing forensic validation on every transaction." },
             { title: "Global Persistence", icon: Globe, color: "emerald", desc: "Automated backups and multi-region replication targets for enterprise mission criticality." },
             { title: "Adaptive CLI", icon: Terminal, color: "zinc", desc: "Control your entire infrastructure from your local machine with our developer-first binary." },
             { title: "Obsidian UI", icon: Layout, color: "sky", desc: "The platform you've been seeing. A custom-built dashboard for modern engineering teams." },
           ].map((feat, i) => (
             <motion.div 
               key={i}
               whileHover={{ y: -8 }}
               className="p-8 glass rounded-3xl border-white/5 group hover:bg-white/[0.04] transition-all cursor-crosshair"
             >
               <div className={`w-14 h-14 rounded-2xl bg-${feat.color}-500/10 flex items-center justify-center mb-6 border border-${feat.color}-500/20`}>
                 <feat.icon className={`w-6 h-6 text-${feat.color}-400`} />
               </div>
               <h3 className="text-xl font-bold mb-3 tracking-tight">{feat.title}</h3>
               <p className="text-zinc-500 text-sm leading-relaxed">{feat.desc}</p>
             </motion.div>
           ))}
        </div>
      </section>

      <footer className="max-w-7xl mx-auto py-20 px-4 border-t border-white/5 text-center">
         <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 opacity-50">
            AetherBase Infrastructure Protocol &copy; 2026. Codeiner online.
         </div>
      </footer>
    </div>
  );
}

const zap = Zap; // Fixing icon casing for the mapping
