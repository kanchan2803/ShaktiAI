// src/components/TypingHeader.jsx
import React from "react";
import { motion } from "framer-motion";

export default function TypingHeader({
  lines = [
    "Finding safe spaces near you...",
    "Hospitals • Police • NGOs • Help Centers",
  ],
}) {
  return (

          // {/* --- Hero Section (same as Helpline gradient) --- */}
          // <header className="relative overflow-hidden">
          //   <div className="bg-gradient-to-r from-[#1E3A8A] to-[#60A5FA] text-white py-16">
          //     <div className="max-w-7xl mx-auto px-6 md:px-12">
          //       <motion.div
          //         initial={{ opacity: 0, y: 20 }}
          //         animate={{ opacity: 1, y: 0 }}
          //         transition={{ duration: 0.6 }}
          //       >
          //           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          //           <div className="max-w-2xl">
          //             <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
          //               Latest <span className="text-yellow-300">Legal Updates ⚖️</span>
          //             </h1>
          //             <p className="mt-4 text-lg text-blue-100">
          //               Laws • Court Rulings • Women’s Rights • Digital Safety • Government Policies
          //             </p>
          //           </div>


    <div className="mb-4 text-white">
      {/* Animated Heading
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-3xl font-bold tracking-wide drop-shadow-md"
      >
        Safe-Space Locator
      </motion.h1> */}
      <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                    <div className="max-w-2xl">
                      <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                        Safe- <span className="text-yellow-300"> Space Locator ⚖️</span>
                      </h1>
                    </div>
      </motion.div>
      {/* Animated Subtext */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-sm text-blue-100 mt-1 flex items-center gap-2"
      >
        <span className="h-2 w-2 rounded-full bg-pink-400 animate-pulse inline-block" />
        <span className="typing">{lines[0]}</span>
      </motion.div>
    </div>
  );
}


// // TypingHeader.jsx
// import React from 'react';
// import { motion } from 'framer-motion';

// export default function TypingHeader({ lines = ['Finding safe spaces near you...', 'Hospitals • Police • NGOs • Help Centers'] }){
//   return (
//     <div className="mb-4">
//       <motion.h1 initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} className="text-2xl font-semibold text-slate-900">Safe‑Space Locator</motion.h1>
//       <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-sm text-slate-600 mt-1 flex items-center gap-2">
//         <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#3550A6] to-[#E91E63] animate-pulse inline-block" />
//         <span className="typing text-slate-600">{lines[0]}</span>
//       </motion.div>
//     </div>
//   )
// }
