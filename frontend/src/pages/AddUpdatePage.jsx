// src/pages/AddUpdatePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react"; // ✅ Changed from react-quill
import { motion } from "framer-motion";
import { Send, Lock, Unlock } from "lucide-react";

// ✅ Optional: simple localStorage hook
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  const setAndStore = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };
  return [value, setAndStore];
}

export default function AddUpdatePage() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [updates, setUpdates] = useLocalStorage("frontend_updates", []);
  
  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    category: "",
    source: "",
    source_url: "",
    image_url: "",
    published_at: new Date().toISOString().slice(0, 10),
  });

  const handleAuth = () => {
    if (password.trim() === "notrealtime") {
      setAuthorized(true);
    } else {
      alert("❌ Incorrect password");
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const newUpdate = {
      id: "local_" + Date.now(),
      ...form,
      published_at: form.published_at || new Date().toISOString(),
    };

    setUpdates((prev) => [newUpdate, ...(prev || [])]);
    setTimeout(() => {
      setSaving(false);
      alert("✅ Update saved locally. You’ll see it on the Legal Updates page.");
      navigate("/");
    }, 800);
  };

  // ---------------- AUTH SCREEN ----------------
  if (!authorized) {
    return (
      <motion.div
        className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="p-8 bg-white/70 backdrop-blur-lg shadow-2xl rounded-2xl max-w-md w-full text-center">
          <Lock className="mx-auto mb-3 text-indigo-600 w-10 h-10" />
          <h2 className="text-2xl font-semibold text-indigo-700 mb-2">
            Admin Access Required
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            Enter the admin password to add a legal update.
          </p>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-lg w-full px-3 py-2 mb-4 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <button
            onClick={handleAuth}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-all"
          >
            Authenticate
          </button>
        </div>
      </motion.div>
    );
  }

  // ---------------- FORM SCREEN ----------------
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12 px-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-indigo-700">
            <Unlock className="inline w-6 h-6 mr-2" />
            Add Legal Update 🏛️
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="text-indigo-500 hover:underline"
          >
            ← Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="title"
            placeholder="Enter title / headline"
            value={form.title}
            onChange={handleChange}
            className="border rounded-lg w-full px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            name="summary"
            placeholder="Enter short summary"
            value={form.summary}
            onChange={handleChange}
            className="border rounded-lg w-full px-4 py-2 focus:ring-2 focus:ring-indigo-400"
          />
          
          {/* ✅ TinyMCE Editor Section */}
          <div className="rounded-lg overflow-hidden border border-gray-300">
            <label className="block text-sm font-medium text-gray-600 p-2 bg-gray-50 border-b">
              Content / Body
            </label>
            <Editor
              apiKey="no-api-key" // ⚠️ Add your real API key here to remove the warning banner
              value={form.content}
              onEditorChange={(newContent) => setForm({ ...form, content: newContent })}
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
            />
          </div>

          <input
            name="category"
            placeholder="Category (e.g., Court Rulings, Women’s Rights)"
            value={form.category}
            onChange={handleChange}
            className="border rounded-lg w-full px-4 py-2 focus:ring-2 focus:ring-indigo-400"
          />

          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="source"
              placeholder="Source (e.g., PIB, India Code)"
              value={form.source}
              onChange={handleChange}
              className="border rounded-lg w-full px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            />
            <input
              name="source_url"
              placeholder="Source URL"
              value={form.source_url}
              onChange={handleChange}
              className="border rounded-lg w-full px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <input
            name="image_url"
            placeholder="Image URL (optional)"
            value={form.image_url}
            onChange={handleChange}
            className="border rounded-lg w-full px-4 py-2 focus:ring-2 focus:ring-indigo-400"
          />

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1">
              <label className="text-sm text-gray-600">Publish Date</label>
              <input
                type="date"
                name="published_at"
                value={form.published_at}
                onChange={handleChange}
                className="border rounded-lg w-full px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
            >
              <Send className="w-5 h-5" />
              {saving ? "Saving..." : "Save Update"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}