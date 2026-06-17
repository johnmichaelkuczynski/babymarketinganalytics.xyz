import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500), // Card slides in
      setTimeout(() => setPhase(3), 2500), // Grade stamps
      setTimeout(() => setPhase(4), 3800), // Feedback appears
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex bg-slate-900 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
    >
      {/* Dark mode background for emphasis */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-950" />

      <div className="w-full max-w-5xl mx-auto px-8 relative z-10 flex flex-col justify-center h-full">
        
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        >
          <div className="inline-block bg-blue-500/20 text-blue-300 font-bold px-4 py-1.5 rounded-full text-sm uppercase tracking-widest mb-4 border border-blue-500/30">
            AI-Graded Assignments
          </div>
          <h2 className="text-4xl font-bold text-white">Written feedback. Instantly.</h2>
        </motion.div>

        <motion.div 
          className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden"
          initial={{ opacity: 0, y: 50, rotateX: 10 }}
          animate={phase >= 2 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: 10 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          <div className="p-8 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-white">Unit 1 Final Exam</h3>
              <p className="text-slate-400 text-sm mt-1">Short Answer Response</p>
            </div>
            
            <motion.div 
              className="bg-emerald-500/10 border-2 border-emerald-500/30 px-6 py-3 rounded-xl flex flex-col items-center justify-center transform origin-center"
              initial={{ scale: 0, opacity: 0, rotate: -15 }}
              animate={phase >= 3 ? { scale: 1, opacity: 1, rotate: 0 } : { scale: 0, opacity: 0, rotate: -15 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <span className="text-emerald-400 font-black text-3xl">92%</span>
              <span className="text-emerald-500/70 text-xs font-bold uppercase tracking-wider">Score</span>
            </motion.div>
          </div>

          <div className="p-8 bg-slate-900/50">
            <div className="mb-6">
              <div className="text-slate-300 font-medium mb-4">Your Answer:</div>
              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 text-slate-300 font-serif italic text-lg leading-relaxed">
                "It should suspect churn — customers are leaving about as fast as new ones arrive, like a leaky bucket. The headline sign-up number hides the back door."
              </div>
            </div>

            <motion.div 
              className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6"
              initial={{ opacity: 0, x: -30 }}
              animate={phase >= 4 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex flex-shrink-0 items-center justify-center text-blue-400 text-xl">📝</div>
                <div>
                  <h4 className="text-blue-400 font-bold mb-2">Grader Feedback</h4>
                  <p className="text-blue-100 text-lg leading-relaxed font-medium">
                    Excellent use of the leaky-bucket concept to explain why flat totals hide churn. Full credit.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
