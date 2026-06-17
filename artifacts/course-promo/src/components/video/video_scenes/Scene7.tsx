import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene7() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500), // KPIs
      setTimeout(() => setPhase(3), 2500), // Bars
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex bg-slate-100 overflow-hidden"
      initial={{ opacity: 0, x: '5vw' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="w-[90vw] h-[85vh] m-auto bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
      >
        <div className="p-8 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Analytics Dashboard</h2>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-300"></div>
            <div className="w-3 h-3 rounded-full bg-slate-300"></div>
            <div className="w-3 h-3 rounded-full bg-slate-300"></div>
          </div>
        </div>

        <div className="flex-1 p-10 flex flex-col gap-10">
          
          {/* KPIs */}
          <div className="flex gap-6">
            {[
              { label: "Questions Answered", val: "142", color: "blue" },
              { label: "Overall Accuracy", val: "88%", color: "emerald" },
              { label: "Current Streak", val: "12", color: "orange" },
            ].map((kpi, i) => (
              <motion.div 
                key={i}
                className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: phase >= 2 ? i * 0.1 : 0, type: "spring" }}
              >
                <div className="text-slate-500 font-medium text-sm mb-2 uppercase tracking-wider">{kpi.label}</div>
                <div className={`text-4xl font-black text-${kpi.color}-600`}>{kpi.val}</div>
              </motion.div>
            ))}
          </div>

          {/* Mastery Bars */}
          <motion.div 
            className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          >
            <h3 className="text-lg font-bold text-slate-800 mb-6">Topic Mastery</h3>
            
            <div className="space-y-6">
              {[
                { name: "1.3 The Funnel", pct: 95 },
                { name: "1.4 Lifetime Value", pct: 82 },
                { name: "1.5 Churn", pct: 60 },
              ].map((topic, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm font-medium text-slate-600 mb-2">
                    <span>{topic.name}</span>
                    <span>{topic.pct}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full rounded-full ${topic.pct > 80 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                      initial={{ width: 0 }}
                      animate={phase >= 3 ? { width: `${topic.pct}%` } : { width: 0 }}
                      transition={{ duration: 1.5, delay: phase >= 3 ? 0.5 + (i * 0.2) : 0, ease: "circOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </motion.div>
    </motion.div>
  );
}
