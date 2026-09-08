import { motion } from 'framer-motion';
import { TikTokCaption } from './TikTokCaption';

export function Scene6() {
  const clients = [
    { label: "Colleges", angle: -15, x: '-35vw', y: '-15vh' },
    { label: "Banks", angle: 10, x: '35vw', y: '-5vh' },
    { label: "Individuals", angle: 5, x: '-30vw', y: '15vh' },
    { label: "Organizations", angle: -10, x: '30vw', y: '20vh' },
  ];

  return (
    <motion.div 
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#0F172A] overflow-hidden"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute w-[150vw] h-[150vw] rounded-full opacity-20 blur-3xl -top-[20%] -left-[20%]"
          style={{ background: 'radial-gradient(circle, #3B82F6, transparent)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <motion.div 
        className="relative z-20 flex flex-col items-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-[30vw] h-[30vw] bg-white rounded-3xl shadow-[0_0_60px_rgba(59,130,246,0.3)] flex items-center justify-center p-6 border-4 border-slate-700">
          <img src={`${import.meta.env.BASE_URL}images/zhi_logo.png`} alt="ZHI Systems" className="w-full h-auto object-contain" />
        </div>
        <h2 className="text-white text-[6vw] font-bold mt-6 text-center leading-tight tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          ZHI Systems
        </h2>
        <p className="text-blue-400 text-[4vw] font-medium mt-2 tracking-wide">
          Custom Apps & Courses
        </p>
      </motion.div>

      {/* Floating client tags */}
      {clients.map((client, i) => (
        <motion.div
          key={client.label}
          className="absolute z-10 bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-3 rounded-2xl shadow-xl whitespace-nowrap"
          initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
          animate={{ opacity: 1, x: client.x, y: client.y, scale: 1, rotate: client.angle }}
          transition={{ delay: 1.0 + i * 0.3, duration: 1.0, type: 'spring', stiffness: 120, damping: 14 }}
        >
          <span className="font-bold text-[3.5vw] tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
            {client.label}
          </span>
        </motion.div>
      ))}

      <TikTokCaption delay={0.5}>
        We create custom courses & apps for<br/>
        <span className="text-blue-400">colleges, banks, and organizations</span>.
      </TikTokCaption>
    </motion.div>
  );
}