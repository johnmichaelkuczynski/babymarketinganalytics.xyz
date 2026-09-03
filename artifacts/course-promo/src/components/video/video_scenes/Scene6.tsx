import { motion } from 'framer-motion';

export function Scene6() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-slate-50 overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 grid grid-cols-2">
        <div className="relative p-[5vw] flex flex-col justify-center">
          <motion.div
            className="w-[4vw] h-[0.5vh] bg-blue-600 mb-[4vh]"
            initial={{ scaleX: 1, originX: 0 }}
            animate={{ scaleX: 1 }}
          />
          <motion.h3
            className="text-[3.5vw] font-display font-bold text-slate-900 mb-[2vh]"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Regression
          </motion.h3>
          <motion.p
            className="text-[2.2vw] text-slate-500 font-medium"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Correlation vs. Causation
          </motion.p>
        </div>
        
        <div className="relative h-full bg-blue-900">
          <motion.img
            src={`${import.meta.env.BASE_URL}images/screens/06_topic_practice.jpg`}
            className="absolute inset-0 w-full h-full object-cover object-left-top"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <div className="absolute inset-0 shadow-[inset_20px_0_40px_rgba(0,0,0,0.2)] pointer-events-none" />
        </div>
      </div>
    </motion.div>
  );
}
