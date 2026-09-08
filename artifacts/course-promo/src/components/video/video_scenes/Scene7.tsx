import { motion } from 'framer-motion';
import { TikTokCaption } from './TikTokCaption';

export function Scene7() {
  return (
    <motion.div 
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#F8F9FA] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="absolute inset-0 z-0 opacity-10"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 5, ease: 'easeOut' }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}screenshots/dashboard.jpg`} 
          alt="Dashboard Background" 
          className="w-full h-full object-cover blur-xl"
        />
      </motion.div>

      <motion.div 
        className="relative z-20 flex flex-col items-center justify-center w-full px-8"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-[20vw] h-[20vw] bg-white rounded-3xl shadow-lg flex items-center justify-center p-4 mb-8">
          <img src={`${import.meta.env.BASE_URL}images/zhi_logo.png`} alt="ZHI" className="w-full h-auto object-contain" />
        </div>
        
        <h2 className="text-[#0F172A] font-bold text-[8vw] mb-6 text-center leading-tight tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Start learning today
        </h2>

        <motion.div 
          className="bg-blue-600 px-8 py-5 rounded-full shadow-[0_15px_30px_-10px_rgba(59,130,246,0.6)] w-auto max-w-[90%] flex justify-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-white font-bold text-[4.5vw] tracking-tight whitespace-nowrap" style={{ fontFamily: 'var(--font-display)' }}>
            babypredictiveanalytics.xyz
          </span>
        </motion.div>
      </motion.div>

      <TikTokCaption delay={0.5}>
        Start learning now at<br/>
        <span className="text-blue-400">babypredictiveanalytics.xyz</span>
      </TikTokCaption>
    </motion.div>
  );
}