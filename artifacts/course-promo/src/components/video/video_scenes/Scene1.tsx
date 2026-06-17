import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2000),
      setTimeout(() => setPhase(4), 3000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-slate-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background elements */}
      <motion.div 
        className="absolute w-[80vw] h-[80vw] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #2563eb, transparent)' }}
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <div className="text-center max-w-5xl px-8 z-10">
        <motion.div
          className="mb-6 overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={phase >= 1 ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        >
          <span className="inline-block bg-blue-100 text-blue-700 text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full">
            A New Kind of Course
          </span>
        </motion.div>

        <h1 className="text-[6vw] font-bold tracking-tighter text-slate-900 mb-6 font-display leading-[1.1]">
          <motion.div className="overflow-hidden">
            <motion.div
              initial={{ y: "100%" }}
              animate={phase >= 2 ? { y: 0 } : { y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              Marketing
            </motion.div>
          </motion.div>
          <motion.div className="overflow-hidden">
            <motion.div
              className="text-blue-600"
              initial={{ y: "100%" }}
              animate={phase >= 2 ? { y: 0 } : { y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.1 }}
            >
              Analytics
            </motion.div>
          </motion.div>
        </h1>
        
        <motion.p 
          className="text-[2.2vw] text-slate-500 font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          The real concepts, in plain language.
        </motion.p>
      </div>
    </motion.div>
  );
}
