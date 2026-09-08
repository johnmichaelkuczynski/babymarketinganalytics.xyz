import { motion } from 'framer-motion';
import { TikTokCaption } from './TikTokCaption';

export function Scene3() {
  const cards = ["Forecast Error", "Uncertainty", "Black Swans", "Overfitting", "Predictions → Decisions"];
  
  return (
    <motion.div 
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#F8F9FA] overflow-hidden"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="absolute top-[15%] w-[90%] bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-200 z-10"
        initial={{ rotateY: -15, scale: 0.9, opacity: 0, x: -50 }}
        animate={{ rotateY: 0, scale: 1, opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ perspective: 1000 }}
      >
        <div className="bg-slate-50 border-b border-slate-100 p-3 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <div className="ml-2 font-mono text-[2.5vw] text-slate-400 font-medium">assignments.pdf</div>
        </div>
        <img 
          src={`${import.meta.env.BASE_URL}screenshots/assignments.jpg`} 
          alt="Assignments" 
          className="w-full h-auto object-cover object-top"
        />
      </motion.div>

      <div className="absolute top-[45%] w-full flex flex-col items-center gap-4 z-20 pointer-events-none">
        {cards.map((text, i) => (
          <motion.div
            key={text}
            className={`px-6 py-4 rounded-xl shadow-xl backdrop-blur-md border whitespace-nowrap ${
              i === 2 || i === 3 ? 'bg-red-500/90 border-red-400 text-white' : 
              i === 4 ? 'bg-blue-600/90 border-blue-500 text-white' : 
              'bg-white/90 border-slate-200 text-[#0F172A]'
            }`}
            initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 + i * 0.5, duration: 0.8, type: 'spring', stiffness: 200, damping: 20 }}
          >
            <span className="font-bold text-[4.5vw] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              {text}
            </span>
          </motion.div>
        ))}
      </div>

      <TikTokCaption delay={0.5}>
        Why things go wrong—like <span className="text-red-400">black swans</span> and overfitting—<br/>
        so you can turn predictions into actual decisions.
      </TikTokCaption>
    </motion.div>
  );
}