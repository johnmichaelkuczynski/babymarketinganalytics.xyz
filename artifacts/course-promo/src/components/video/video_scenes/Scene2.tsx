import { motion } from 'framer-motion';

export function Scene2() {
  const cards = [
    { title: '1 Day', subtitle: 'Crash Course', delay: 0.5 },
    { title: '1 Week', subtitle: 'Deep Dive', delay: 1.0 },
    { title: '1 Month', subtitle: 'Mastery', delay: 1.5 },
  ];

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 overflow-hidden"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="absolute top-0 w-full h-[50vh] bg-blue-600 rounded-b-[100%] scale-x-[2] -translate-y-[10vh] origin-top"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1, ease: "circOut" }}
      />

      <motion.h2
        className="text-[4vw] font-display font-bold text-white z-10 mb-[8vh] text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        Customize the way you learn
      </motion.h2>

      <div className="flex gap-[4vw] z-10 mt-[4vh]">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            className="w-[18vw] h-[45vh] bg-white rounded-[2vw] shadow-soft flex flex-col items-center justify-center border border-slate-100"
            initial={{ y: 50, opacity: 0, rotate: -5 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 15,
              delay: card.delay,
            }}
          >
            <span className="text-[1vw] font-semibold text-blue-600 uppercase tracking-widest mb-[2vh]">
              Certification
            </span>
            <span className="text-[3vw] font-display font-black text-slate-900 mb-[1vh]">
              {card.title}
            </span>
            <span className="text-[1.3vw] text-slate-500 font-medium">
              {card.subtitle}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
