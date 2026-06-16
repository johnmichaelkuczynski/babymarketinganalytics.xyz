import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene7() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000), // Check 1
      setTimeout(() => setPhase(3), 3500), // Check 2
      setTimeout(() => setPhase(4), 5000), // Final verdict
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex bg-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="w-[85vw] h-[80vh] m-auto bg-slate-800 rounded-xl shadow-2xl flex overflow-hidden border border-slate-700"
      >
        <div className="flex-1 p-16 flex flex-col justify-center max-w-4xl mx-auto">
          
          <h2 className="text-4xl font-bold text-white mb-2">Integrity Scan</h2>
          <p className="text-slate-400 text-xl mb-12">Checking submission authenticity...</p>

          <div className="space-y-6">
            
            {/* Layer 1 */}
            <motion.div 
              className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 flex items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-slate-400">1</div>
                <div>
                  <h4 className="text-white font-bold">GPTZero Text Scan</h4>
                  <p className="text-slate-400 text-sm">Semantic analysis for AI patterns</p>
                </div>
              </div>
              <div className="text-emerald-400 font-medium">4% AI — looks human-written</div>
            </motion.div>

            {/* Layer 2 */}
            <motion.div 
              className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 flex items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-slate-400">2</div>
                <div>
                  <h4 className="text-white font-bold">Keystroke Pattern</h4>
                  <p className="text-slate-400 text-sm">Behavioral pacing & paste detection</p>
                </div>
              </div>
              <div className="text-emerald-400 font-medium">Human — steady pace, no bulk paste</div>
            </motion.div>

          </div>

          {/* Final Verdict */}
          <motion.div 
            className="mt-12 self-start flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 px-8 py-4 rounded-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={phase >= 4 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', bounce: 0.5 }}
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl">✓</div>
            <div>
              <div className="text-slate-300 text-sm font-medium uppercase tracking-wider">Final Verdict</div>
              <div className="text-emerald-400 text-3xl font-bold">Authentic</div>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </motion.div>
  );
}
