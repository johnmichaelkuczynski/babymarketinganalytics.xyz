import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export function TikTokCaption({ children, delay = 0.5 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      className="absolute bottom-[22%] left-0 right-0 px-8 flex justify-center z-50 pointer-events-none"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="bg-black/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shadow-2xl max-w-[90%]">
        <p className="text-white text-center text-[4.5vw] font-bold leading-tight tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
          {children}
        </p>
      </div>
    </motion.div>
  );
}