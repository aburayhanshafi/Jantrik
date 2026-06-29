import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Dynamic 3D Orbs/Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/30 dark:bg-indigo-600/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/30 dark:bg-blue-600/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-purple-400/30 dark:bg-purple-600/20 blur-[130px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
      
      {/* Extra subtle floating elements for '3D' feel */}
      <div className="absolute top-[40%] left-[50%] w-[30%] h-[30%] rounded-full bg-cyan-400/20 dark:bg-cyan-500/10 blur-[90px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-6000" />
      
      {/* Noise Texture Overlay for Premium Feel */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
    </div>
  );
};

export default AnimatedBackground;
