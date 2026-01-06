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
  Users,
  Heart,
  Sparkles,
  Scale
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Data: Mock Search Animation ---
const mockQueries = [
  { q: "FIR format for harassment", a: "You can download verified FIR templates instantly." },
  { q: "Nearest police help center", a: "Locate the closest safe space in your area." },
  { q: "Latest bill on women’s safety", a: "A new protection amendment introduced in Parliament." },
  { q: "How to file a complaint online?", a: "Step-by-step guide and affidavit templates ready." },
];

// --- Data: Functional Features (Tools) ---
const features = [
  {
    icon: MessageSquare,
    title: "Ask Shakti.ai",
    text: "Get instant legal answers or guidance in plain, empathetic language — powered by AI.",
    link: "/", // chatbot is at root or /consult based on your routes
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: MapPin,
    title: "Safe Space Locator",
    text: "Find police stations, hospitals, and women support centers near you instantly.",
    link: "/safe-space-locator",
    color: "from-blue-500 to-cyan-500",
  },
  // {
  //   icon: FileText,
  //   title: "Legal Drafts",
  //   text: "Verified ready-to-use templates — FIRs, affidavits, and official complaint formats.",
  //   link: "/drafts",
  //   color: "from-purple-500 to-indigo-500",
  // },
  {
    icon: Newspaper,
    title: "Legal Updates",
    text: "Curated daily government notifications, bills, and rights awareness news.",
    link: "/legal-updates",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: Phone,
    title: "Emergency Helplines",
    text: "Verified 24x7 national and state helpline numbers for immediate help.",
    link: "/helplines",
    color: "from-green-500 to-emerald-600",
  },
  // {
  //   icon: HelpCircle,
  //   title: "Guides & Awareness",
  //   text: "Simple how-to guides and rights awareness posts to keep you informed.",
  //   link: "/guides", // or wherever you route this
  //   color: "from-teal-400 to-teal-600",
  // },
];

// --- Data: Core Values (From About Page) ---
const values = [
  {
    title: "AI Legal Companion",
    desc: "Provides multilingual, AI-driven legal guidance in simple terms.",
    icon: Scale,
  },
  {
    title: "Real-time Safety",
    desc: "Quick access to helplines, safe spaces, and verified contacts.",
    icon: Shield,
  },
  // {
  //   title: "Community Connection",
  //   desc: "Connects women to mentors, lawyers, and local NGOs securely.",
  //   icon: Users,
  // },
];

// --- Data: Team (From About Page) ---
const team = [
  {
    name: "KD",
    role: "Founder & Developer",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400", // placeholder avatar
  },
  {
    name: "Project Shakti Team",
    role: "AI & Research",
    img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=400&h=400",
  },
];

export default function HomePage() {
  const [idx, setIdx] = useState(0);

  // Search Text Rotator
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % mockQueries.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800 font-sans overflow-x-hidden">
      
      {/* ================= HERO SECTION ================= */}
      <header className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white">
        
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-20 animate-blob" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-20 animate-blob animation-delay-2000" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center text-center z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm text-blue-100 mb-6 backdrop-blur-md">
              <Sparkles size={14} className="text-yellow-300" />
              <span>Your Personal AI Legal & Safety Companion</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
              Shakti<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">.ai</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-blue-100/90 leading-relaxed">
              Bridging the gap between citizens and justice. 
              From verified legal drafts to real-time safety help — we are here to empower you.
            </p>
          </motion.div>

          {/* --- Animated Mock Search Bar --- */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3, duration: 0.8 }}
             className="mt-10 w-full max-w-2xl"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-5 flex items-center shadow-2xl relative overflow-hidden group hover:bg-white/15 transition-all">
              <div className="flex-1 text-left">
                <div className="text-xs text-blue-200 mb-1 uppercase tracking-wider font-semibold">Ask Shakti...</div>
                <div className="h-6 relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      className="text-white font-medium text-lg truncate pr-4"
                    >
                      "{mockQueries[idx].q}"
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2.5 rounded-xl text-indigo-900 shadow-lg group-hover:scale-105 transition-transform">
                <ArrowRight size={24} />
              </div>
            </div>
            {/* Answer Preview */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`ans-${idx}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-sm text-yellow-300/90 flex items-center justify-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-300" />
                {mockQueries[idx].a}
              </motion.div>
            </AnimatePresence>
          </motion.div>

        </div>
      </header>

      {/* ================= MISSION & VISION (Merged from About) ================= */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Redefining Safety with <span className="text-indigo-600">Empathy & AI</span>
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Shakti.ai aims to build a digital ecosystem where every woman feels safe,
                informed, and empowered. We bridge the gap between awareness and action using 
                cutting-edge technology and multilingual accessibility.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Heart size={20}/></div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Our Mission</h4>
                    <p className="text-sm text-slate-600">To provide timely legal aid and a supportive community for everyone.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Sparkles size={20}/></div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Our Vision</h4>
                    <p className="text-sm text-slate-600">A world where safety information is accessible to all, regardless of language.</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Visual Cards for Values */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid gap-4"
            >
              {values.map((v, i) => (
                <div key={i} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <v.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{v.title}</h3>
                    <p className="text-sm text-slate-500">{v.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= EXPLORE TOOLS (Features) ================= */}
      <section className="py-20 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Explore Our Tools</h2>
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
              Everything you need to stay safe and legally informed, all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-2xl transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white shadow-md mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon size={22} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  {f.text}
                </p>
                <Link 
                  to={f.link}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Explore <ArrowRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TEAM SECTION ================= */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Meet the Minds</h2>
          <div className="flex flex-wrap justify-center gap-10">
            {team.map((member, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm w-64"
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-md">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">{member.name}</h3>
                <p className="text-sm text-indigo-600 font-medium">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
               <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-lg">
                 <Shield size={20} className="text-white" />
               </div>
               <span className="text-xl font-bold text-white">Shakti.ai</span>
            </div>
            <p className="max-w-xs text-sm text-slate-400">
              Empowering women with knowledge & safety. 
              Bridging the gap between awareness and action.
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <h4 className="font-semibold text-white mb-2">Quick Links</h4>
            <Link to="/helplines" className="hover:text-indigo-400 transition">Emergency Helplines</Link>
            <Link to="/safe-space-locator" className="hover:text-indigo-400 transition">Safe Spaces</Link>
            <Link to="/legal-updates" className="hover:text-indigo-400 transition">Legal News</Link>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <h4 className="font-semibold text-white mb-2">Contact</h4>
            <a href="mailto:support@shakti.ai" className="hover:text-indigo-400 transition">support@shakti.ai</a>
            <a href="tel:+911123456789" className="hover:text-indigo-400 transition">+91 2345 XXXX</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Shakti.ai — All Rights Reserved.
        </div>
      </footer>

    </div>
  );
}