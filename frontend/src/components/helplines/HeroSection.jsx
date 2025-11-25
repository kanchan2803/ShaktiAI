// frontend/src/components/helplines/HeroSection.jsx
import React from "react";
import { Phone, HelpCircle, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <header className="relative overflow-hidden">
      <div className="bg-gradient-to-r from-[#1E3A8A] to-[#60A5FA] text-white py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="max-w-2xl">
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                  Verified National & State <span className="text-yellow-300">Helpline Numbers</span>
                </h1>
                <p className="mt-4 text-lg text-blue-100">
                  Quick access to trusted emergency contacts when you need them most. Dial directly from
                  your device or search by category and state.
                </p>

                <div className="mt-6 flex gap-3 items-center">
                  <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                    <Phone className="w-5 h-5 text-white/90" />
                    <span className="text-sm">Immediate Help</span>
                  </div>

                  <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                    <Shield className="w-5 h-5 text-white/90" />
                    <span className="text-sm">Verified Sources</span>
                  </div>

                  <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                    <HelpCircle className="w-5 h-5 text-white/90" />
                    <span className="text-sm">24/7 Support</span>
                  </div>
                </div>
              </div>

              {/* Typing indicator card */}
              <div className="hidden md:block">
                <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                  <div className="bg-white rounded-2xl shadow-lg p-4 w-80 text-gray-800">
                    <div className="text-sm text-gray-500 mb-2">Quick example</div>
                    <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-3">
                      <div className="text-sm">“What’s the helpline for cybercrime in my state?”</div>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                        <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse delay-75" />
                        <div className="h-2 w-2 rounded-full bg-blue-300 animate-pulse delay-150" />
                        <span className="text-xs text-gray-500 ml-2">Shakti.ai is typing…</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
