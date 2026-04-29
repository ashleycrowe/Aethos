import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mic, X } from 'lucide-react';

export const VoiceOrb: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1100] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6"
    >
      <button 
        onClick={onClose}
        className="absolute top-10 right-10 p-4 rounded-full bg-white/5 border border-white/10 text-white"
      >
        <X className="w-8 h-8" />
      </button>

      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Central Pulse */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 rounded-full bg-[#00F0FF]/20 blur-3xl"
        />
        
        {/* Rotating Orbs */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { repeat: Infinity, duration: 3 + i, ease: "linear" },
              scale: { repeat: Infinity, duration: 2, delay: i * 0.5 }
            }}
            className="absolute inset-0 border-2 border-[#00F0FF]/30 rounded-[40%] opacity-40"
          />
        ))}

        <Mic className="w-16 h-16 text-[#00F0FF] relative z-10" />
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-3xl font-black font-['Space_Grotesk'] text-white uppercase tracking-[0.3em] mb-4">Listening...</h2>
        <p className="text-slate-500 font-bold uppercase tracking-widest animate-pulse">Speak to query the multi-cloud constellation</p>
      </div>

      <div className="mt-20 flex gap-4">
        <div className="w-1 h-12 bg-[#00F0FF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-1 h-16 bg-[#00F0FF] rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
        <div className="w-1 h-20 bg-[#00F0FF] rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
        <div className="w-1 h-14 bg-[#00F0FF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        <div className="w-1 h-10 bg-[#00F0FF] rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
      </div>
    </motion.div>
  );
};
