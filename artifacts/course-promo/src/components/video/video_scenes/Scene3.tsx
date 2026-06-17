import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500), // Question
      setTimeout(() => setPhase(3), 2800), // Answer streams
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const question = "Does LTV mean we should ignore small purchases?";
  const answer = "No! A customer making small, frequent purchases might have a higher LTV than someone who makes one large purchase and never returns. It's about the total relationship over time.";

  return (
    <motion.div 
      className="absolute inset-0 flex bg-slate-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="w-[90vw] h-[85vh] m-auto bg-white rounded-2xl shadow-2xl flex overflow-hidden border border-slate-200"
      >
        {/* Left Lesson Context (Blurred) */}
        <div className="flex-1 p-12 bg-slate-50 border-r border-slate-200 relative">
          <div className="max-w-2xl opacity-40 blur-sm pointer-events-none">
            <h1 className="text-4xl font-bold text-slate-900 mb-6">1.4 Customer Lifetime Value</h1>
            <p className="text-lg text-slate-600 mb-6">A customer is worth their whole relationship — not just a single sale.</p>
            <div className="h-32 bg-slate-200 rounded-lg w-full mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          </div>
        </div>

        {/* AI Tutor Panel */}
        <motion.div 
          className="w-[45vw] bg-white flex flex-col shadow-[-20px_0_40px_rgba(0,0,0,0.05)] z-10 relative"
          initial={{ x: '100%' }}
          animate={phase >= 1 ? { x: 0 } : { x: '100%' }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-lg shadow-sm">✨</div>
              <div>
                <div className="font-bold text-slate-900">AI Tutor</div>
                <div className="text-xs text-slate-500">Grounded in Section 1.4</div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden bg-slate-50/50">
            {phase >= 2 && (
              <motion.div 
                className="self-end bg-slate-800 text-white rounded-2xl rounded-tr-sm p-4 max-w-[85%] shadow-sm"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                {question}
              </motion.div>
            )}

            {phase >= 3 && (
              <div className="self-start bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-sm p-5 max-w-[90%] shadow-sm flex items-start gap-4">
                <div className="text-emerald-500 mt-1">✨</div>
                <div className="text-[15px] leading-relaxed font-medium">
                  <TypewriterText text={answer} />
                </div>
              </div>
            )}
          </div>
        </motion.div>

      </motion.div>
    </motion.div>
  );
}

function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex += 2;
      } else {
        clearInterval(interval);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
}
