import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000), // Answer selected
      setTimeout(() => setPhase(3), 3500), // Correct state & difficulty up
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex bg-slate-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="w-[85vw] h-[80vh] m-auto bg-white rounded-xl shadow-soft flex overflow-hidden border border-slate-200"
      >
        <div className="flex-1 flex items-center justify-center p-12 bg-slate-50 relative">
          
          {/* Difficulty Meter */}
          <motion.div 
            className="absolute top-8 right-8 flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-100"
            initial={{ opacity: 0 }}
            animate={phase >= 1 ? { opacity: 1 } : { opacity: 0 }}
          >
            <span className="text-sm font-semibold text-slate-500 uppercase">Difficulty</span>
            <div className="flex gap-1">
              <div className="w-6 h-2 bg-blue-600 rounded-sm" />
              <div className="w-6 h-2 bg-blue-600 rounded-sm" />
              <motion.div 
                className="w-6 h-2 rounded-sm bg-slate-200"
                animate={phase >= 3 ? { backgroundColor: '#2563eb' } : {}}
              />
              <div className="w-6 h-2 bg-slate-200 rounded-sm" />
            </div>
            <motion.div 
              className="text-blue-600 font-bold ml-2 text-xl"
              initial={{ opacity: 0, y: 10 }}
              animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0 }}
            >
              ↑
            </motion.div>
          </motion.div>

          <div className="w-full max-w-3xl bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-2xl font-semibold text-slate-800 mb-8 leading-snug">
              A store has one unusually great sales week and the manager wants to call it a brand-new upward trend. Name two things that conclusion gets wrong.
            </h3>

            <div className="space-y-4">
              <div className="p-4 border border-slate-200 rounded-xl text-slate-500 bg-slate-50 opacity-50">
                It assumes every week will be exactly the same from now on.
              </div>
              <motion.div 
                className="p-4 border-2 rounded-xl text-slate-800 relative overflow-hidden"
                animate={
                  phase === 1 ? { borderColor: '#e2e8f0', backgroundColor: '#ffffff' } :
                  phase === 2 ? { borderColor: '#2563eb', backgroundColor: '#eff6ff' } :
                  { borderColor: '#10b981', backgroundColor: '#ecfdf5' }
                }
              >
                <div className="font-medium">
                  It mistakes random noise for a real signal, and it calls a single point a trend when a trend needs a pattern over many points.
                </div>
                
                <motion.div 
                  className="mt-4 text-emerald-700 font-medium text-sm flex items-center gap-2"
                  initial={{ height: 0, opacity: 0 }}
                  animate={phase >= 3 ? { height: 'auto', opacity: 1, marginTop: '1rem' } : { height: 0, opacity: 0, marginTop: 0 }}
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">✓</div>
                  Correct. One week is noise, and a trend takes many points, not one.
                </motion.div>
              </motion.div>
            </div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}
