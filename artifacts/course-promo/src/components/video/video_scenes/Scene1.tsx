import { motion } from 'framer-motion';

export function Scene1() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.img
        src={`${import.meta.env.BASE_URL}images/zhi_logo.png`}
        alt="ZHI Logo"
        className="w-[12vw] h-[12vw] mb-[6vh]"
        initial={{ scale: 0, opacity: 0, rotate: -20 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
      />
      <div className="text-center font-display space-y-[2vh]">
        <motion.h1
          className="text-[5vw] font-bold tracking-tight text-white"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Data analytics is hard.
        </motion.h1>
        <motion.p
          className="text-[3vw] text-slate-400 font-medium"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.2 }}
        >
          But you have to know it.
        </motion.p>
        <motion.p
          className="text-[4vw] text-blue-400 font-bold mt-[4vh]"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 4.0 }}
        >
          We make it easy.
        </motion.p>
      </div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(59,130,246,0.15) 0%, transparent 70%)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 4 }}
      />
    </motion.div>
  );
}
