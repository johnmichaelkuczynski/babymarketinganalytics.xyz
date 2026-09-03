import { motion } from 'framer-motion';

export function Scene3() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-slate-900 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 bg-blue-900/20" />

      <div className="relative w-[90vw] mx-auto flex items-center justify-between z-10">
        <div className="w-1/2 pr-[4vw]">
          <motion.h2
            className="text-[4.5vw] font-display font-bold text-white leading-tight"
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Minimize <span className="text-blue-400">busywork.</span>
            <br />
            Maximize <span className="text-emerald-400">teaching.</span>
          </motion.h2>

          <motion.div
            className="mt-[4vh] space-y-[2vh]"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.8, delayChildren: 1.5 }
              }
            }}
          >
            {['Built-in AI tutors', 'Unlimited practice exams', 'Student-friendly tools'].map((text, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
                }}
                className="flex items-center gap-[1vw] text-[1.8vw] text-slate-300 font-medium"
              >
                <div className="w-[0.8vw] h-[0.8vw] rounded-full bg-blue-500" />
                {text}
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="w-1/2 relative h-[80vh]">
          <motion.img
            src={`${import.meta.env.BASE_URL}images/screens/01_dashboard.jpg`}
            alt="Dashboard"
            className="absolute top-[5vh] left-[2vw] w-[120%] rounded-[1vw] shadow-2xl border border-slate-700/50"
            initial={{ x: 100, y: 50, opacity: 0, rotateY: 20 }}
            animate={{ x: 0, y: 0, opacity: 1, rotateY: -5 }}
            transition={{ type: "spring", stiffness: 60, damping: 20, delay: 0.5 }}
            style={{ transformPerspective: 1000 }}
          />
          <motion.img
            src={`${import.meta.env.BASE_URL}images/screens/04_assignments.jpg`}
            alt="Assignments"
            className="absolute bottom-[5vh] -left-[2vw] w-[90%] rounded-[1vw] shadow-2xl border border-slate-700/50"
            initial={{ x: 100, y: 100, opacity: 0, rotateY: 20 }}
            animate={{ x: 0, y: 0, opacity: 1, rotateY: 5 }}
            transition={{ type: "spring", stiffness: 60, damping: 20, delay: 2.0 }}
            style={{ transformPerspective: 1000 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
