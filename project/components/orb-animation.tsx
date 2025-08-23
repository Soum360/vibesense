'use client';

import { motion } from 'framer-motion';

export function OrbAnimation() {
  return (
    <div className="relative w-32 h-32">
      {/* Main orb */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 border-2 border-primary/30 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      
      {/* Inner core */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-8 h-8 -mt-4 -ml-4 bg-white rounded-full"
        animate={{
          scale: [1, 0.8, 1],
          opacity: [1, 0.6, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-accent rounded-full"
          style={{
            top: '50%',
            left: '50%',
            marginTop: '-4px',
            marginLeft: '-4px',
          }}
          animate={{
            x: Math.cos((i * 60 * Math.PI) / 180) * 60,
            y: Math.sin((i * 60 * Math.PI) / 180) * 60,
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}