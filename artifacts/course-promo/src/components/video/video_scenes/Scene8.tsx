import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene8() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setPhase(1), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 bg-slate-900 overflow-hidden text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* First Phase: Topics 7 & 8 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center p-[5vw]"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 0 ? 1 : 0, scale: phase === 0 ? 1 : 1.1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 opacity-20">
          <img
            src={`${import.meta.env.BASE_URL}images/screens/05_analytics.jpg`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="z-10 text-center space-y-[3vh]">
          <motion.h3
            className="text-[3.5vw] font-display font-bold"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Uncertainty & Overfitting
          </motion.h3>
          <motion.p
            className="text-[2.2vw] text-blue-400 font-medium"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Turning prediction into decision.
          </motion.p>
        </div>
      </motion.div>

      {/* Second Phase: Lockup */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-20"
        initial={{ opacity: 0, pointerEvents: 'none' }}
        animate={{ opacity: phase === 1 ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.img
          src={`${import.meta.env.BASE_URL}images/zhi_logo.png`}
          alt="ZHI"
          className="w-[12vw] h-[12vw] mb-[4vh]"
          initial={{ scale: 0 }}
          animate={{ scale: phase === 1 ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        />
        <motion.h2
          className="text-[3.5vw] font-display font-bold tracking-tight mb-[2vh]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: phase === 1 ? 0 : 20, opacity: phase === 1 ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Basic Predictive Analytics
        </motion.h2>
        <motion.div
          className="px-[3vw] py-[1.5vh] bg-blue-600 rounded-full font-bold text-[1.5vw] tracking-wide mt-[2vh]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: phase === 1 ? 0 : 20, opacity: phase === 1 ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          START LEARNING
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
