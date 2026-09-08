import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { Scene6 } from './video_scenes/Scene6';
import { Scene7 } from './video_scenes/Scene7';

export const SCENE_DURATIONS = {
  s1_intro: 6000,
  s2_topics1: 10000,
  s3_topics2: 12000,
  s4_formats: 12000,
  s5_cert: 7000,
  s6_custom: 8000,
  s7_outro: 5000,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  s1_intro: Scene1,
  s2_topics1: Scene2,
  s3_topics2: Scene3,
  s4_formats: Scene4,
  s5_cert: Scene5,
  s6_custom: Scene6,
  s7_outro: Scene7,
};

const SCENE_START_SEC: Record<string, number> = (() => {
  const out: Record<string, number> = {};
  let cumulativeMs = 0;
  for (const [key, ms] of Object.entries(SCENE_DURATIONS)) {
    out[key] = cumulativeMs / 1000;
    cumulativeMs += ms;
  }
  return out;
})();

const AUDIO_SEEK_EPSILON_SEC = 0.18;

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  muted = false,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  muted?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentSceneKey } = useVideoPlayer({ durations, loop });

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_DURATIONS;
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastSceneKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 1.0;
    
    if (lastSceneKeyRef.current !== currentSceneKey) {
      lastSceneKeyRef.current = currentSceneKey;
      const targetTime = SCENE_START_SEC[baseSceneKey] ?? 0;
      if (Math.abs(audio.currentTime - targetTime) > AUDIO_SEEK_EPSILON_SEC) {
        audio.currentTime = targetTime;
      }
    }
    audio.play().catch(() => {});
  }, [currentSceneKey, baseSceneKey, muted]);

  return (
    <div className="w-full h-screen overflow-hidden relative bg-[#F8F9FA] text-[#0F172A]" style={{ fontFamily: 'var(--font-body)' }}>
      {/* Persistent Background Layer */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute w-[120vw] h-[120vw] rounded-full opacity-[0.04] blur-3xl"
          style={{ background: 'radial-gradient(circle, #3B82F6, transparent)' }}
          animate={{ x: ['-20%', '30%', '-10%'], y: ['-10%', '40%', '-20%'], scale: [1, 1.2, 0.9] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[100vw] h-[100vw] rounded-full opacity-[0.03] blur-3xl right-0 bottom-0"
          style={{ background: 'radial-gradient(circle, #0F172A, transparent)' }}
          animate={{ x: ['20%', '-20%', '10%'], y: ['10%', '-30%', '20%'] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 w-full h-full">
        <AnimatePresence mode="popLayout">
          {SceneComponent && <SceneComponent key={currentSceneKey} />}
        </AnimatePresence>
      </div>
      
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}audio/voiceover.mp3`}
        preload="auto"
        autoPlay
        muted={muted}
      />
    </div>
  );
}