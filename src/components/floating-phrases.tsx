"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingPhrase {
  id: number;
  text: string;
  left: string;
}

export default function FloatingPhrases({ phrases }: { phrases: string[] }) {
  const [floating, setFloating] = useState<FloatingPhrase[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newPhrase: FloatingPhrase = {
        id: Date.now(),
        text: phrases[Math.floor(Math.random() * phrases.length)],
        left: `${Math.random() * 100}%`,
      };
      setFloating((prev) => [...prev, newPhrase]);

      // Remove phrases after they've animated (approximately 18 seconds)
      setTimeout(() => {
        setFloating((prev) => prev.filter((p) => p.id !== newPhrase.id));
      }, 18000);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {floating.map((phrase) => (
          <motion.div
            key={phrase.id}
            initial={{ y: "100vh", opacity: 0 }}
            animate={{ y: "-20vh", opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 18 }}
            className="absolute text-sm"
            style={{ left: phrase.left }}
          >
            {phrase.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
