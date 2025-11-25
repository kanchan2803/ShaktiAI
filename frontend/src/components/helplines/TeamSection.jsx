// frontend/src/components/helplines/TeamSection.jsx
import React from "react";
import { motion } from "framer-motion";

const members = [
  { name: "Kanchan Dubey", role: "Founder & Product", img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" },
  { name: "Sparsh Agrawal", role: "AI & Backend", img: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png" },
];

export default function TeamSection() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-12 text-center">
        <h4 className="text-2xl font-semibold text-blue-700 mb-6">Our Team</h4>
        <div className="flex flex-wrap justify-center gap-8">
          {members.map((m, i) => (
            <motion.div key={i} whileHover={{ scale: 1.04 }} className="w-64 bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-md">
              <img src={m.img} alt={m.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-blue-100" />
              <div className="text-lg font-medium text-gray-800">{m.name}</div>
              <div className="text-sm text-blue-600">{m.role}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
