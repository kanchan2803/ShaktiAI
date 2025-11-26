// src/pages/AddUpdatePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Send, Lock, Unlock, ArrowLeft, FileText, 
  Link as LinkIcon, Image as ImageIcon, Tag 
} from "lucide-react";
import { useLocalStorage } from "../services/useLocalStorage";

export default function AddUpdatePage() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  
  // Store updates in localStorage key "local_news_updates"
  const [localUpdates, setLocalUpdates] = useLocalStorage("local_news_updates", []);

  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    category: "Laws & Amendments",
    source: "",
    source_url: "",
    image_url: "",
    published_at: new Date().toISOString().slice(0, 10),
  });

  const categories = [
    "Laws & Amendments",
    "Court Rulings",
    "Women's Rights",
    "Cyber & Digital Safety",
    "Government Policies",
    "Awareness & Education",
  ];

  const handleAuth = (e) => {
    e.preventDefault();
    // Simple hardcoded password for demo
    if (password.trim() === "shakti123") { 
      setAuthorized(true);
    } else {
      alert("❌ Incorrect Admin Password");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const newUpdate = {
      id: "local_" + Date.now(), // Unique ID
      ...form,
      published_at: new Date(form.published_at).toISOString(),
    };

    // Prepend new update to the list
    setLocalUpdates([newUpdate, ...(localUpdates || [])]);

    setTimeout(() => {
      setSaving(false);
      navigate("/legal-updates");
    }, 800);
  };

  // --- AUTH SCREEN ---
  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-500/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl text-center"
        >
          <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-400/30">
            <Lock className="w-8 h-8 text-indigo-300" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
          <p className="text-indigo-200 text-sm mb-6">Enter password to post legal updates.</p>
          
          <form onSubmit={handleAuth}>
            <input
              type="password"
              placeholder="Enter password (try 'shakti123')"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4 text-center tracking-widest"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:scale-[1.02] transition-all"
            >
              Unlock Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // --- FORM SCREEN ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition">
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Unlock className="w-5 h-5 text-green-500" /> Add Legal Update
            </h1>
          </div>
          <div className="text-xs font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full">
            Admin Mode
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <motion.form 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit} 
          className="space-y-8"
        >
          
          {/* Section 1: Main Info */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Basic Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  name="title"
                  placeholder="e.g. Supreme Court New Ruling on..."
                  value={form.title}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  required
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                    >
                      {categories.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Publish Date</label>
                  <input
                    type="date"
                    name="published_at"
                    value={form.published_at}
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Content */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Content</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Summary (Short)</label>
                <input
                  name="summary"
                  placeholder="A 2-line summary for the card view..."
                  value={form.summary}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Details</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <textarea
                    name="content"
                    placeholder="Write the detailed update here..."
                    rows={6}
                    value={form.content}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Sources & Media */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Source & Media</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Source Name</label>
                <input
                  name="source"
                  placeholder="e.g. PIB, Times of India"
                  value={form.source}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Source URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    name="source_url"
                    placeholder="https://..."
                    value={form.source_url}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL (Optional)</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    name="image_url"
                    placeholder="https://..."
                    value={form.image_url}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 pb-10">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-70"
            >
              {saving ? "Publishing..." : "Publish Update"} <Send size={18} />
            </button>
          </div>

        </motion.form>
      </div>
    </div>
  );
}