import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene6() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000), // First layer
      setTimeout(() => setPhase(3), 3500), // Second layer
      setTimeout(() => setPhase(4), 5000), // Verdict
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex bg-slate-900 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: '-5vw' }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

      <div className="w-full max-w-5xl mx-auto px-8 relative z-10 flex flex-col justify-center h-full">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
        >
          <div className="inline-block bg-indigo-500/20 text-indigo-300 font-bold px-4 py-1.5 rounded-full text-sm uppercase tracking-widest mb-4 border border-indigo-500/30">
            Integrity Engine
          </div>
          <h2 className="text-4xl font-bold text-white mb-10">Two-layer AI detection.</h2>
        </motion.div>

        <div className="space-y-6">
          {/* Layer 1 */}
          <motion.div 
            className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex items-center justify-between shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center text-indigo-400 text-xl font-bold border border-slate-700/50">1</div>
              <div>
                <h4 className="text-white font-bold text-xl mb-1">GPTZero Text Scan</h4>
                <p className="text-slate-400 font-medium">Semantic analysis for AI-generated patterns</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-emerald-400 font-bold text-xl">4% AI</div>
              <div className="text-slate-500 text-sm font-medium">Looks human-written</div>
            </div>
          </motion.div>

          {/* Layer 2 */}
          <motion.div 
            className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex items-center justify-between shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center text-indigo-400 text-xl font-bold border border-slate-700/50">2</div>
              <div>
                <h4 className="text-white font-bold text-xl mb-1">Keystroke Dynamics</h4>
                <p className="text-slate-400 font-medium">Typing pace, rhythm & paste detection</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-emerald-400 font-bold text-xl">Natural</div>
              <div className="text-slate-500 text-sm font-medium">Steady pace, no bulk paste</div>
            </div>
          </motion.div>
        </div>

        {/* Verdict */}
        <motion.div 
          className="mt-10 mx-auto flex items-center gap-5 bg-emerald-500/10 border-2 border-emerald-500/20 px-10 py-6 rounded-3xl"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={phase >= 4 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-3xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">✓</div>
          <div>
            <div className="text-emerald-500/80 text-sm font-bold uppercase tracking-widest mb-1">Final Verdict</div>
            <div className="text-emerald-400 text-4xl font-black tracking-tight">Authentic Work</div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
