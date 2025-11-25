import React from "react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-100 text-gray-800">
      {/* HEADER SECTION */}
      <section className="text-center py-16 px-6 md:px-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          About <span className="text-yellow-300">Shakti.ai</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed"
        >
          Empowering women through technology, awareness, and safety — one voice at a time.
        </motion.p>
      </section>

      {/* MISSION & VISION */}
      <section className="max-w-6xl mx-auto py-16 px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold text-blue-700 mb-4">Our Mission</h2>
          <p className="text-lg leading-relaxed text-gray-700">
            Shakti.ai aims to build a digital ecosystem where every woman feels safe,
            informed, and empowered. From legal guidance to real-time support, our mission
            is to bridge the gap between awareness and action using cutting-edge AI
            solutions and multilingual accessibility.
          </p>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-3xl font-semibold text-blue-700 mb-4">Our Vision</h2>
          <p className="text-lg leading-relaxed text-gray-700">
            To redefine women’s digital safety and empowerment by merging artificial
            intelligence with human compassion. Shakti.ai envisions a world where every
            woman — regardless of language, region, or background — has access to timely
            legal aid, safety information, and a supportive community.
          </p>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section className="bg-white py-16">
        <h2 className="text-center text-3xl font-semibold text-blue-700 mb-10">
          What Makes Shakti.ai Unique
        </h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6 md:px-12">
          {[
            {
              title: "AI Legal Companion",
              desc: "Provides multilingual, AI-driven legal guidance in simple terms.",
              icon: "⚖️",
            },
            {
              title: "Real-time Safety Support",
              desc: "Quick access to helplines, safe spaces, and verified contacts.",
              icon: "🛡️",
            },
            {
              title: "Community & Connection",
              desc: "Connects women to mentors, lawyers, and local NGOs securely.",
              icon: "🤝",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-gray-100 rounded-2xl shadow-md hover:shadow-lg p-8 text-center border border-blue-100"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-blue-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white text-center">
        <h2 className="text-3xl font-semibold text-blue-700 mb-12">Meet Our Team</h2>
        <div className="flex flex-wrap justify-center gap-10 px-6 md:px-20">
          {[
            {
              name: "KD",
              role: "Founder & Developer",
              img: "https://avatars.githubusercontent.com/u/your-github-id?v=4",
            },
            {
              name: "Project Shakti Team",
              role: "AI & Research Collaborators",
              img: "https://cdn-icons-png.flaticon.com/512/921/921347.png",
            },
          ].map((member, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-2xl shadow-md w-64 text-center border border-gray-100"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-24 h-24 mx-auto rounded-full object-cover mb-4 border-4 border-blue-200"
              />
              <h3 className="text-xl font-semibold text-blue-800">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-blue-900 text-white text-center py-6">
        <p className="text-sm">
          © {new Date().getFullYear()} Shakti.ai — Empowering Women Through AI & Awareness.
        </p>
      </footer>
    </div>
  );
}
