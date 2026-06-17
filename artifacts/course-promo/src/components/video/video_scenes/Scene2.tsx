import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300), // App slides in
      setTimeout(() => setPhase(2), 1200), // Sidebar items stagger
      setTimeout(() => setPhase(3), 2500), // Lesson depth toggle
      setTimeout(() => setPhase(4), 4000), // Content update
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const topics = [
    "1.1 What marketing analytics is",
    "1.2 Why 'average' doesn't exist",
    "1.3 The funnel",
    "1.4 Customer lifetime value",
    "1.5 Churn",
    "1.6 A/B testing",
    "1.7 Attribution & personalization",
    "1.8 Insight to campaign"
  ];

  return (
    <motion.div 
      className="absolute inset-0 flex bg-slate-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background shape */}
      <motion.div 
        className="absolute top-0 right-0 w-[50vw] h-[100vh] bg-blue-50/50 rounded-l-[100px] pointer-events-none"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 1.5, ease: "circOut" }}
      />

      <motion.div 
        className="w-[90vw] h-[85vh] m-auto bg-white rounded-2xl shadow-2xl flex overflow-hidden border border-slate-200 z-10"
        initial={{ y: '20vh', scale: 0.95, opacity: 0 }}
        animate={phase >= 1 ? { y: 0, scale: 1, opacity: 1 } : { y: '20vh', scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        {/* Sidebar */}
        <div className="w-[25vw] bg-slate-50 border-r border-slate-200 flex flex-col p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">M</div>
            <span className="font-bold text-slate-800">Unit 1</span>
          </div>
          
          <div className="flex flex-col gap-2">
            {topics.map((topic, i) => (
              <motion.div 
                key={i}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${i === 3 ? 'bg-blue-100 text-blue-700' : 'text-slate-600'}`}
                initial={{ opacity: 0, x: -20 }}
                animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.4, delay: phase >= 2 ? i * 0.08 : 0 }}
              >
                {topic}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Content Pane */}
        <div className="flex-1 p-12 relative flex flex-col">
          
          {/* Depth Toggle */}
          <motion.div 
            className="self-end flex bg-slate-100 rounded-full p-1 mb-12 shadow-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          >
            <div className="px-4 py-1.5 text-sm font-medium text-slate-500 rounded-full">Short</div>
            <motion.div 
              className="px-4 py-1.5 text-sm font-medium text-blue-600 bg-white shadow-sm rounded-full relative z-10"
              initial={{ x: -70 }}
              animate={phase >= 4 ? { x: 0 } : { x: -70 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              Medium
            </motion.div>
            <div className="px-4 py-1.5 text-sm font-medium text-slate-500 rounded-full">Long</div>
          </motion.div>

          <div className="max-w-3xl">
            <motion.h1 
              className="text-4xl font-bold text-slate-900 mb-6"
              initial={{ opacity: 0 }}
              animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
            >
              1.4 Customer Lifetime Value
            </motion.h1>
            
            <motion.div 
              className="space-y-6 text-lg text-slate-600 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
            >
              <p>A customer is worth their whole relationship — not just a single sale.</p>
              
              <motion.div
                className="overflow-hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={phase >= 4 ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                  <p className="font-medium text-slate-800 mb-2">Why it matters:</p>
                  <p>Lifetime value (LTV) answers the question every budget depends on: how much can we afford to spend to win — and keep — a customer like this?</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}
