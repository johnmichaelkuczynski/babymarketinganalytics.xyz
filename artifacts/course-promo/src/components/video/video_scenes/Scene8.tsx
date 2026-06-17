import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene8() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 1900),
      setTimeout(() => setPhase(4), 2600),
      setTimeout(() => setPhase(5), 3800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.div 
        className="absolute w-[100vw] h-[100vw] rounded-full opacity-20 blur-[100px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #2563eb, transparent)' }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="text-center z-10">
        <div className="flex justify-center gap-[1.5vw] text-[2vw] font-bold text-slate-500 mb-12">
          <motion.span initial={{ y: 20, opacity: 0 }} animate={phase >= 1 ? { y: 0, opacity: 1 } : {}}>Taught.</motion.span>
          <motion.span initial={{ y: 20, opacity: 0 }} animate={phase >= 2 ? { y: 0, opacity: 1 } : {}}>Tutored.</motion.span>
          <motion.span initial={{ y: 20, opacity: 0 }} animate={phase >= 3 ? { y: 0, opacity: 1 } : {}}>Graded.</motion.span>
          <motion.span initial={{ y: 20, opacity: 0 }} animate={phase >= 4 ? { y: 0, opacity: 1 } : {}} className="text-white">Honest.</motion.span>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0, filter: 'blur(10px)' }}
          animate={phase >= 5 ? { scale: 1, opacity: 1, filter: 'blur(0px)' } : {}}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <h1 className="text-[7vw] font-black tracking-tighter text-white mb-6 leading-none">
            Marketing <br/>
            <span className="text-blue-500">Analytics</span>
          </h1>
          <p className="text-[2.5vw] text-slate-400 font-medium">The course that actually shows up.</p>
        </motion.div>
      </div>
      
    </motion.div>
  );
}
