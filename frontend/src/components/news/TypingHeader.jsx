// TypingHeader.jsx
import React from "react";
import { motion } from "framer-motion";

export default function TypingHeader({ text }) {
  // Simple animated typing-like reveal
  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="text-2xl md:text-3xl font-semibold"
      >
        {text}
        <motion.span
          className="ml-2 inline-block text-indigo-500"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          ...
        </motion.span>
      </motion.h1>
    </div>
  );
}
