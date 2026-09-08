import { motion } from 'framer-motion';
import { TikTokCaption } from './TikTokCaption';

export function Scene5() {
  return (
    <motion.div 
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#F8F9FA] overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="absolute top-[10%] w-[90%] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 z-10"
        initial={{ y: '50vh', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}screenshots/grades.jpg`} 
          alt="Grades" 
          className="w-full h-auto object-cover object-top"
        />
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] pointer-events-none" />
      </motion.div>

      {/* Coveted Certification Badge */}
      <motion.div
        className="absolute top-[35%] flex flex-col items-center z-20"
        initial={{ scale: 0, opacity: 0, rotate: -20 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ delay: 1.5, duration: 1.0, type: 'spring', stiffness: 150, damping: 15 }}
      >
        <div className="w-[45vw] h-[45vw] bg-gradient-to-br from-blue-500 to-[#0F172A] rounded-full shadow-[0_20px_40px_-10px_rgba(59,130,246,0.5)] flex flex-col items-center justify-center p-8 border-4 border-white">
          <img src={`${import.meta.env.BASE_URL}images/zhi_logo.png`} alt="ZHI" className="w-16 h-16 object-contain filter invert brightness-0" />
          <div className="text-white text-center mt-4">
            <div className="text-[2.5vw] uppercase tracking-widest opacity-80 font-bold whitespace-nowrap">Certified</div>
            <div className="text-[4vw] font-bold leading-none mt-1 whitespace-nowrap" style={{ fontFamily: 'var(--font-display)' }}>Predictive<br/>Analytics</div>
          </div>
        </div>
      </motion.div>

      <TikTokCaption delay={0.5}>
        Get rewarded with a coveted<br/>
        <span className="text-blue-400">ZHI Certification of Completion</span>.
      </TikTokCaption>
    </motion.div>
  );
}