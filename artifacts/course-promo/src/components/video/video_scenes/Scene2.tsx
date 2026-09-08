import { motion } from 'framer-motion';
import { TikTokCaption } from './TikTokCaption';

export function Scene2() {
  const cards = ["Trend", "Seasonality", "Noise", "Regression", "Correlation vs Causation"];
  
  return (
    <motion.div 
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#F8F9FA] overflow-hidden"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Screenshot - Blurred & Parallax */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-20"
        initial={{ y: '10%' }}
        animate={{ y: '-10%' }}
        transition={{ duration: 10, ease: 'linear' }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}screenshots/lecture.jpg`} 
          alt="Lecture Background" 
          className="w-full h-full object-cover blur-md"
        />
      </motion.div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full h-full flex flex-col items-center pt-[15%]">
        
        <motion.div
          className="w-[85%] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 mb-8"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          <img 
            src={`${import.meta.env.BASE_URL}screenshots/lecture.jpg`} 
            alt="Lecture" 
            className="w-full h-auto object-cover object-top"
          />
        </motion.div>

        {/* Floating Concept Tags */}
        <div className="flex flex-wrap justify-center gap-3 w-[85%] mt-4 perspective-[1000px]">
          {cards.map((text, i) => (
            <motion.div
              key={text}
              className="bg-[#0F172A] text-white px-5 py-3 rounded-full shadow-lg border border-slate-700/50 whitespace-nowrap"
              initial={{ opacity: 0, y: 30, rotateX: -30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              transition={{ delay: 1.5 + i * 0.4, duration: 0.8, type: 'spring', stiffness: 200, damping: 20 }}
            >
              <span className="font-bold text-[3.5vw] tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
                {text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <TikTokCaption delay={0.5}>
        We break down <span className="text-blue-400">what predictive analytics is</span>,<br/>
        trend, seasonality, and noise.<br/>
        You'll learn about regression, and <span className="text-blue-400">correlation vs causation</span>.
      </TikTokCaption>
    </motion.div>
  );
}