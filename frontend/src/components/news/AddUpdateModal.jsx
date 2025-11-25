
// // frontend/src/components/news/AddUpdateModal.jsx
// import React, { useState } from "react";
// import { addNews } from "../../api/gasApi";
// import { motion } from "framer-motion";

// export default function AddUpdateModal({ onClose, onSaved }) {
//   const [password, setPassword] = useState("");
//   const [authenticated, setAuthenticated] = useState(false);
//   const [form, setForm] = useState({
//     title: "",
//     summary: "",
//     content: "",
//     category: "",
//     source: "",
//     source_url: "",
//     image_url: "",
//     published_at: new Date().toISOString().slice(0, 10),
//   });
//   const [loading, setLoading] = useState(false);
//   const [serverMsg, setServerMsg] = useState("");

//   const handleAuth = () => {
//     if (password === "notrealtime") {
//       setAuthenticated(true);
//       setServerMsg("");
//     } else {
//       setServerMsg("❌ Incorrect local access password.");
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((p) => ({ ...p, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setServerMsg("");
//     try {
//       const payload = { ...form };
//       const res = await addNews(payload, password);
//       if (res && res.ok) {
//         setServerMsg("✅ Saved — refreshing list...");
//         setTimeout(() => {
//           onSaved?.();
//         }, 800);
//       } else {
//         setServerMsg("❌ " + (res && res.message ? res.message : "Save failed"));
//       }
//     } catch (err) {
//       console.error(err);
//       const msg = err?.response?.data?.message || err.message || String(err);
//       setServerMsg("❌ Save error: " + msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
//         <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">✕</button>

//         {!authenticated ? (
//           <>
//             <h2 className="text-xl font-semibold mb-3">Admin Access</h2>
//             <p className="text-gray-600 mb-4">Enter the admin password to add a new update.</p>
//             <input type="password" className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter password..." value={password} onChange={(e) => setPassword(e.target.value)} />
//             {serverMsg && <div className="text-sm text-red-500 mb-3">{serverMsg}</div>}
//             <button onClick={handleAuth} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Authenticate</button>
//           </>
//         ) : (
//           <>
//             <h2 className="text-xl font-semibold mb-4">Add New Update</h2>
//             {serverMsg && <div className="mb-2 text-sm">{serverMsg}</div>}

//             <form onSubmit={handleSubmit} className="space-y-3">
//               <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" />
//               <input name="summary" placeholder="Short summary" value={form.summary} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
//               <textarea name="content" placeholder="Full content / description" rows={4} value={form.content} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
//               <input name="category" placeholder="Category (e.g., Law, Policy, Judgement)" value={form.category} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
//               <input name="source" placeholder="Source (e.g., PIB, India Code)" value={form.source} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
//               <input name="source_url" placeholder="Source URL" value={form.source_url} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
//               <input name="image_url" placeholder="Image URL (optional)" value={form.image_url} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
//               <input name="published_at" type="date" value={form.published_at} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />

//               <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg hover:scale-105 transition-transform">
//                 {loading ? "Saving..." : "Save Update"}
//               </button>
//             </form>
//           </>
//         )}
//       </motion.div>
//     </div>
//   );
// }
