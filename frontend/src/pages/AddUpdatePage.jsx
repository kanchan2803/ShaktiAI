import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Send, Lock, Unlock, ArrowLeft, FileText, Link as LinkIcon, Image as ImageIcon, Tag, Loader2 } from "lucide-react";
import { addNewsUpdate } from "../services/newsApi"; 

export default function AddUpdatePage() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({
    title: "", summary: "", content: "", category: "Laws & Amendments",
    source: "", source_url: "", image_url: "",
    published_at: new Date().toISOString().slice(0, 10),
  });

  const categories = ["Laws & Amendments", "Court Rulings", "Women's Rights", "Cyber & Digital Safety", "Government Policies", "Awareness & Education"];

  const handleAuth = (e) => {
    e.preventDefault();
    if (password.trim() === "shakti123") setAuthorized(true);
    else alert("❌ Incorrect Admin Password");
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
        // --- CALL BACKEND API ---
        await addNewsUpdate(form);
        alert("✅ Global Update Published Successfully!");
        navigate("/legal-updates");
    } catch (error) {
        alert("❌ Failed to publish update. Check console.");
    } finally {
        setSaving(false);
    }
  };

  if (!authorized) {
    return (
       /* ... (Your existing Auth UI Code remains exactly the same) ... */
       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 px-4">
        {/* ... background blobs ... */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl text-center">
          <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-400/30">
            <Lock className="w-8 h-8 text-indigo-300" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
          <form onSubmit={handleAuth}>
            <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white mb-4 text-center tracking-widest" />
            <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl">Unlock</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* ... (Header UI remains same) ... */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => navigate(-1)}><ArrowLeft /></button>
            <h1 className="text-xl font-bold">Add Global Update</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* ... (Your existing form fields remain exactly the same) ... */}
            
            {/* Example Field (Keep all your existing fields) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input name="title" value={form.title} onChange={handleChange} className="w-full p-3 border rounded-xl" required />
            </div>

             {/* ... (Rest of fields: summary, content, category, etc.) ... */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <label className="block text-sm font-medium mb-1">Summary</label>
               <input name="summary" value={form.summary} onChange={handleChange} className="w-full p-3 border rounded-xl" required />
                <label className="block text-sm font-medium mt-4 mb-1">Content</label>
               <textarea name="content" rows={5} value={form.content} onChange={handleChange} className="w-full p-3 border rounded-xl" />
            </div>

            <div className="flex justify-end pt-4 pb-10">
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-indigo-600 text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70">
                {saving ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                {saving ? "Publishing..." : "Publish to World"}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}