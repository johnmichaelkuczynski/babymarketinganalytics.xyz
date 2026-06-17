import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000), // Answer selected
      setTimeout(() => setPhase(3), 3200), // Correct + Difficulty goes up
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex bg-slate-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="w-[90vw] h-[85vh] m-auto bg-white rounded-2xl shadow-2xl flex overflow-hidden border border-slate-200 relative"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-slate-50/50">
          
          {/* Difficulty Meter */}
          <motion.div 
            className="absolute top-8 right-8 flex items-center gap-4 bg-white px-5 py-3 rounded-xl shadow-sm border border-slate-200"
            initial={{ y: -20, opacity: 0 }}
            animate={phase >= 1 ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
          >
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Adaptive Practice</span>
              <span className="text-sm font-semibold text-slate-700">Streak: 3</span>
            </div>
            <div className="w-px h-8 bg-slate-200 mx-2" />
            <div className="flex gap-1.5 items-end h-6">
              <div className="w-3 h-3 bg-blue-600 rounded-sm" />
              <div className="w-3 h-4 bg-blue-600 rounded-sm" />
              <div className="w-3 h-5 bg-blue-600 rounded-sm" />
              <motion.div 
                className="w-3 rounded-sm bg-slate-200 origin-bottom"
                initial={{ height: "1.5rem" }}
                animate={phase >= 3 ? { backgroundColor: '#2563eb', height: "1.5rem" } : { backgroundColor: '#e2e8f0', height: "1.5rem" }}
              />
              <div className="w-3 h-7 bg-slate-200 rounded-sm" />
            </div>
            <motion.div 
              className="text-blue-600 font-black text-xl ml-2"
              initial={{ opacity: 0, y: 10, scale: 0 }}
              animate={phase >= 3 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0 }}
              transition={{ type: "spring", bounce: 0.6 }}
            >
              ↑ Level Up
            </motion.div>
          </motion.div>

          <div className="w-full max-w-3xl">
            <motion.div 
              className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200"
              initial={{ y: 20, opacity: 0 }}
              animate={phase >= 1 ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded text-sm">Q4</span>
                <span className="text-slate-400 font-medium text-sm">Topic 1.5 - Churn</span>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-8 leading-snug">
                A subscription app celebrates record new sign-ups, yet its total user count is flat. What is happening?
              </h3>

              <div className="space-y-4">
                <div className="p-5 border border-slate-200 rounded-xl text-slate-500 bg-slate-50/50">
                  Their app is broken and not counting users.
                </div>
                <motion.div 
                  className="p-5 border-2 rounded-xl relative overflow-hidden"
                  animate={
                    phase === 1 ? { borderColor: '#e2e8f0', backgroundColor: '#ffffff', color: '#334155' } :
                    phase === 2 ? { borderColor: '#2563eb', backgroundColor: '#eff6ff', color: '#1e3a8a' } :
                    { borderColor: '#10b981', backgroundColor: '#ecfdf5', color: '#064e3b' }
                  }
                >
                  <div className="font-semibold text-lg">
                    They are experiencing high churn — losing existing customers as fast as they add new ones.
                  </div>
                  
                  <motion.div 
                    className="overflow-hidden"
                    initial={{ height: 0, opacity: 0 }}
                    animate={phase >= 3 ? { height: 'auto', opacity: 1, marginTop: '1rem' } : { height: 0, opacity: 0, marginTop: 0 }}
                  >
                    <div className="flex items-start gap-3 pt-4 border-t border-emerald-200/50">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">✓</div>
                      <div className="text-emerald-800 font-medium text-sm leading-relaxed">
                        Correct. This is the "leaky bucket" problem. Watching total count hides the fact that people are leaving out the back door.
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}
