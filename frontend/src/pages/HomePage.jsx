// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Newspaper,
  MapPin,
  MessageSquare,
  Phone,
  ArrowRight,
  Shield,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock search animation data
const mockQueries = [
  { q: "FIR format for harassment", a: "You can download verified FIR templates instantly." },
  { q: "Nearest police help center", a: "Locate the closest safe space in your area." },
  { q: "Latest bill on women’s safety", a: "A new protection amendment introduced in Parliament." },
  { q: "How to file a complaint online?", a: "Step-by-step guide and affidavit templates ready." },
];

// Feature cards data
const features = [
  {
    icon: FileText,
    title: "Legal Drafts & Docs",
    text: "Verified ready-to-use legal templates — FIRs, affidavits, and official complaint formats.",
    example: "Example: File a workplace complaint easily using guided formats.",
    link: "/drafts",
  },
  {
    icon: Newspaper,
    title: "News & Legal Updates",
    text: "Daily curated government notifications, bills, and verified legal news.",
    example: "Example: New cyber safety act passed — know what it means for you.",
    link: "/news",
  },
  {
    icon: MapPin,
    title: "Nearby Safe Spaces",
    text: "Locate police stations, hospitals, and women support centers near you with maps and contacts.",
    example: "Example: Find open police station in your zone within seconds.",
    link: "/safe-space-locator",
  },
  {
    icon: MessageSquare,
    title: "Ask Shakti.ai",
    text: "Get instant legal answers or guidance in plain, empathetic language — powered by AI.",
    example: "Example: “How do I file an FIR for theft?” — Shakti explains clearly.",
    link: "/consult",
  },
  {
    icon: Phone,
    title: "Emergency Helplines",
    text: "Verified 24x7 national and state helpline numbers to get help immediately.",
    example: "Example: Call Women’s Helpline 1091 or Police at 100 directly.",
    link: "/helplines",
  },
  {
    icon: HelpCircle,
    title: "Guides & Awareness",
    text: "Simple how-to guides and rights awareness posts — stay informed and safe.",
    example: "Example: Steps to file an RTI or check case status online.",
    link: "/guides",
  },
];

export default function HomePage() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % mockQueries.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className=" relative min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 text-white">

{/* Animated Chat Background */}
<div className="absolute inset-0 overflow-hidden opacity-40 pointer-events-none">
  <div className="absolute w-full h-full animate-scrollChat space-y-3 flex flex-col items-center text-sm md:text-base text-white font-medium">
    <div className="bg-blue-500/40 backdrop-blur-sm rounded-xl px-4 py-2 self-end max-w-[75%] mr-4 shadow-md">
      Hey Shakti, how can I file an FIR online?
    </div>
    <div className="bg-yellow-500/40 backdrop-blur-sm rounded-xl px-4 py-2 self-start max-w-[75%] ml-4 shadow-md">
      You can file it via your nearest police portal or e-FIR service. I can guide you step-by-step.
    </div>
    <div className="bg-blue-500/40 backdrop-blur-sm rounded-xl px-4 py-2 self-end max-w-[75%] mr-4 shadow-md">
      Great! Also, can I get a legal notice draft?
    </div>
    <div className="bg-yellow-500/40 backdrop-blur-sm rounded-xl px-4 py-2 self-start max-w-[75%] ml-4 shadow-md">
      Sure! Visit our Drafts/Docs section for verified templates and editable versions.
    </div>
    <div className="bg-blue-500/40 backdrop-blur-sm rounded-xl px-4 py-2 self-end max-w-[75%] mr-4 shadow-md">
      Thanks! One more — what’s the process for name change affidavit?
    </div>
    <div className="bg-yellow-500/40 backdrop-blur-sm rounded-xl px-4 py-2 self-start max-w-[75%] ml-4 shadow-md">
      You’ll need to publish it in the Gazette and attach ID proof. I’ll show you the sample affidavit.
    </div>
    <div className="bg-blue-500/40 backdrop-blur-sm rounded-xl px-4 py-2 self-end max-w-[75%] mr-4 shadow-md">
      Wow, this makes law feel so accessible!
    </div>
    <div className="bg-yellow-500/40 backdrop-blur-sm rounded-xl px-4 py-2 self-start max-w-[75%] ml-4 shadow-md">
      That’s the mission — empowering you with clarity and confidence ⚖️
    </div>
  </div>
</div>


      {/* HERO SECTION */}
      <header className="relative overflow-hidden py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-6xl font-extrabold leading-tight"
          >
            <span className="text-yellow-300">Shakti.ai</span> — Empowered, Informed & Protected
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 max-w-3xl text-lg md:text-xl text-blue-100"
          >
            From verified legal drafts to real-time safety help — your civic and legal companion for every situation.
          </motion.p>

          {/* Animated mock search bar */}
          <div className="mt-10 w-full max-w-2xl">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-4 flex items-center justify-between shadow-lg hover:bg-white/15 transition">
              <div className="text-left w-full">
                <div className="text-sm text-white/70">Try searching...</div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="text-white font-semibold text-base"
                  >
                    {mockQueries[idx].q}
                  </motion.div>
                </AnimatePresence>
                <motion.div
                  key={`ans-${idx}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm text-yellow-200 mt-1"
                >
                  {mockQueries[idx].a}
                </motion.div>
              </div>
              <div className="ml-3 bg-yellow-400 text-black rounded-full p-2">
                <Shield className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Small icon animations */}
          <div className="mt-10 flex flex-wrap justify-center gap-8">
            {[
              { icon: MapPin, label: "Safe Spaces" },
              { icon: Phone, label: "Helplines" },
              { icon: FileText, label: "Drafts" },
              { icon: Newspaper, label: "Updates" },
            ].map(({ icon: Icon, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="p-3 bg-white/10 rounded-xl shadow-md hover:bg-white/20 transition">
                  <Icon className="w-6 h-6 text-yellow-300" />
                </div>
                <div className="text-sm text-white/80">{label}</div>
              </motion.div>
            ))}
          </div>

          {/* About CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-white/80 max-w-2xl mx-auto">
              Shakti.ai bridges the gap between citizens and verified legal help — through awareness, AI guidance, and reliable access.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 mt-4 bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-lg font-semibold transition"
            >
              Know more about us <ArrowRight className="w-4 h-4 text-white/80" />
            </Link>
          </motion.div>
        </div>
      </header>

      {/* FEATURE GRID SECTION */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">What You Can Explore</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ scale: 1.05, y: -6 }}
              className="bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl p-6 hover:shadow-2xl hover:bg-white/15 transition flex flex-col justify-between"
            >
              <div>
                <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl inline-block mb-3 shadow-md">
                  <f.icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-white/80">{f.text}</p>
              </div>
              <div className="mt-4 text-xs text-white/70 italic">{f.example}</div>
              <div className="mt-4">
                <Link
                  to={f.link}
                  className="inline-block mt-3 bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg hover:brightness-95 transition"
                >
                  Explore
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONTACT + FOOTER */}
      <footer className="bg-gradient-to-t from-blue-950 to-transparent py-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">Contact & Support</h3>
            <p className="text-sm text-white/70 mt-2 max-w-md">
              For partnerships, support or resource verification — reach us anytime.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="mailto:support@shakti.ai"
                className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:brightness-95"
              >
                support@shakti.ai
              </a>
              <a
                href="tel:+911123456789"
                className="border border-white/20 px-4 py-2 rounded-lg text-white/90 hover:bg-white/10 transition"
              >
                +91 11 2345 6789
              </a>
            </div>
          </div>
          <div className="text-sm text-white/70">
            <p>Need urgent help?</p>
            <p className="mt-1">
              Visit{" "}
              <Link to="/helplines" className="underline">
                Helplines
              </Link>{" "}
              or{" "}
              <Link to="/safe-space-locator" className="underline">
                Safe Spaces
              </Link>{" "}
              for instant assistance.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-white/60">
          © {new Date().getFullYear()} <span className="font-semibold text-yellow-300">Shakti.ai</span> — Empowerment through Access.
        </div>
      </footer>
    </div>
  );
}
