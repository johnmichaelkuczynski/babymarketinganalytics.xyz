import { motion } from 'framer-motion';

export function Scene4() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center bg-blue-600 text-white overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="absolute w-[150vw] h-[150vw] rounded-full bg-blue-500/30 blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="z-10 text-center flex flex-col items-center">
        <motion.div
          className="w-[12vw] h-[12vw] rounded-full bg-white text-blue-600 flex items-center justify-center mb-[6vh] shadow-2xl"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.2 }}
        >
          <svg className="w-[6vw] h-[6vw]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </motion.div>

        <motion.h2
          className="text-[5vw] font-display font-bold mb-[3vh]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Standing by 24/7
        </motion.h2>

        <motion.p
          className="text-[2.5vw] text-blue-100 font-medium w-[60vw]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.2 }}
        >
          You won't hit any snags—but if you do, we're just a phone call away.
        </motion.p>
      </div>
    </motion.div>
  );
}
