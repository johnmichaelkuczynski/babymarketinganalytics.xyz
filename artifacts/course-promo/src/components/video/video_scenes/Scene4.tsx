import { motion } from 'framer-motion';
import { TikTokCaption } from './TikTokCaption';

export function Scene4() {
  return (
    <motion.div 
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#0F172A] overflow-hidden"
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: 'circle(150% at 50% 50%)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="absolute top-[20%] w-[180%] h-auto shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] z-10 origin-top-left"
        initial={{ scale: 0.8, x: '10%', y: '10%', opacity: 0 }}
        animate={{ scale: 1.4, x: '-30%', y: '5%', opacity: 1 }}
        transition={{ delay: 0.2, duration: 10, ease: 'linear' }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}screenshots/lecture.jpg`} 
          alt="Lecture Features UI" 
          className="w-full h-auto object-cover object-top rounded-xl border border-slate-700/50"
        />
      </motion.div>

      {/* Floating Feature Tags */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-20 pointer-events-none mt-20">
        <motion.div
          className="bg-white text-[#0F172A] px-8 py-5 rounded-2xl shadow-2xl border border-slate-100 whitespace-nowrap"
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.8, type: 'spring', stiffness: 200, damping: 20 }}
        >
          <span className="font-bold text-[5vw] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            🤖 In-Built AI Tutors
          </span>
        </motion.div>

        <motion.div
          className="bg-white text-[#0F172A] px-8 py-5 rounded-2xl shadow-2xl border border-slate-100 whitespace-nowrap"
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 2.8, duration: 0.8, type: 'spring', stiffness: 200, damping: 20 }}
        >
          <span className="font-bold text-[5vw] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            📝 Unlimited Practice
          </span>
        </motion.div>

        <motion.div
          className="bg-blue-600 text-white px-8 py-5 rounded-2xl shadow-2xl border border-blue-500 whitespace-nowrap"
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 4.0, duration: 0.8, type: 'spring', stiffness: 200, damping: 20 }}
        >
          <span className="font-bold text-[5vw] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            ⚡ Flexible Formats
          </span>
        </motion.div>
      </div>

      <TikTokCaption delay={0.5}>
        <span className="text-blue-400">In-built AI tutors</span> & unlimited practice.<br/>
        Choose short, medium, or long formats.
      </TikTokCaption>
    </motion.div>
  );
}