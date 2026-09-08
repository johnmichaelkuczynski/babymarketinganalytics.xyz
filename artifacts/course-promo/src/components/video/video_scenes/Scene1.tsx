import { motion } from 'framer-motion';
import { TikTokCaption } from './TikTokCaption';

export function Scene1() {
  return (
    <motion.div 
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#F8F9FA] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="absolute top-[12%] flex flex-col items-center gap-4 z-20"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-[20vw] h-[20vw] bg-white rounded-3xl shadow-xl flex items-center justify-center p-4">
          <img src={`${import.meta.env.BASE_URL}images/zhi_logo.png`} alt="ZHI" className="w-full h-auto object-contain" />
        </div>
        <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-slate-200 shadow-sm mt-4">
          <span className="text-[#0F172A] font-bold text-[4.5vw] tracking-tight whitespace-nowrap" style={{ fontFamily: 'var(--font-display)' }}>
            babypredictiveanalytics.xyz
          </span>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-[35%] w-[85%] h-[40%] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 z-10"
        initial={{ y: '20vh', scale: 0.9, opacity: 0, rotateX: 10 }}
        animate={{ y: 0, scale: 1, opacity: 1, rotateX: 0 }}
        transition={{ delay: 1.0, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ perspective: 1000 }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}screenshots/dashboard.jpg`} 
          alt="Dashboard" 
          className="w-full h-full object-cover object-left-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
      </motion.div>

      <TikTokCaption delay={0.5}>
        <span className="text-blue-400">babypredictiveanalytics.xyz</span><br/>
        Welcome to our 4-6 hour course on Basic Predictive Analytics.
      </TikTokCaption>
    </motion.div>
  );
}