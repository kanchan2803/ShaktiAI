// frontend/src/components/helplines/MissionVision.jsx
import React from "react";
import { motion } from "framer-motion";

export default function MissionVision() {
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-6 md:px-12 bg-gradient-to-r from-blue-50 to-white rounded-2xl p-8 shadow-inner">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <h4 className="text-xl font-semibold text-blue-800 mb-3">Safety with Empathy</h4>
          <p className="text-gray-700 leading-relaxed">
            Shakti.ai verifies and curates helplines using trusted sources and official portals.
            We combine AI convenience with human oversight to make sure that emergency contacts are
            accurate and accessible — because timely help saves lives.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
