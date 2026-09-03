import { motion } from 'framer-motion';

export function Scene5() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-slate-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 grid grid-cols-2">
        <div className="relative p-[5vw] flex flex-col justify-center">
          <motion.div
            className="w-[4vw] h-[0.5vh] bg-blue-600 mb-[4vh]"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />
          <motion.h3
            className="text-[3.5vw] font-display font-bold text-slate-900 mb-[2vh]"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Predictive Analytics
          </motion.h3>
          <motion.p
            className="text-[2.2vw] text-slate-500 font-medium"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            Trend, seasonality & noise
          </motion.p>
        </div>
        
        <div className="relative h-full bg-slate-200">
          <motion.div
            className="absolute inset-0 bg-blue-900 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: "circOut" }}
          />
          <motion.img
            src={`${import.meta.env.BASE_URL}images/screens/03_lecture.jpg`}
            className="absolute inset-0 w-full h-full object-cover object-left-top opacity-90"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
          />
          <div className="absolute inset-0 shadow-[inset_20px_0_40px_rgba(0,0,0,0.2)] pointer-events-none" />
        </div>
      </div>
    </motion.div>
  );
}
