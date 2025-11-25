// frontend/src/components/helplines/HelplineCard.jsx
import React from "react";
import { Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function HelplineCard({ item }) {
  // Define strong visible gradients by category
  const categoryGradients = {
    "National Helplines": "from-blue-100 via-blue-50 to-indigo-100",
    "Women's Safety Helplines": "from-pink-100 via-rose-50 to-fuchsia-100",
    "Cybercrime / Online Fraud": "from-purple-100 via-fuchsia-50 to-indigo-100",
    "Health & Mental Health": "from-green-100 via-emerald-50 to-teal-100",
    "Disaster & Environment": "from-yellow-100 via-orange-50 to-amber-100",
    "Agriculture & Rural Support": "from-lime-100 via-green-50 to-emerald-100",
    "Senior Citizens": "from-amber-100 via-orange-50 to-yellow-100",
    "State-specific Helplines": "from-cyan-100 via-teal-50 to-sky-100",
    Default: "from-blue-100 via-white to-indigo-100",
  };

  const gradient =
    categoryGradients[item.category] || categoryGradients.Default;

  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.03,
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      }}
      transition={{ type: "spring", stiffness: 250 }}
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 border border-white/60 
        shadow-md hover:shadow-xl transition-all duration-300 backdrop-blur-sm`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {item.name}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs text-white font-semibold
            ${
              item.category?.includes("Women")
                ? "bg-gradient-to-r from-pink-500 to-rose-600"
                : item.category?.includes("Cyber")
                ? "bg-gradient-to-r from-purple-500 to-fuchsia-600"
                : item.category?.includes("Health")
                ? "bg-gradient-to-r from-green-500 to-emerald-600"
                : item.category?.includes("Disaster")
                ? "bg-gradient-to-r from-yellow-500 to-orange-600"
                : item.category?.includes("Agriculture")
                ? "bg-gradient-to-r from-lime-500 to-green-600"
                : item.category?.includes("Senior")
                ? "bg-gradient-to-r from-amber-500 to-orange-600"
                : "bg-gradient-to-r from-blue-500 to-indigo-600"
            }`}
        >
          {item.category}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 leading-snug mb-3">
        {item.description}
      </p>

      {/* State */}
      <p className="text-xs text-gray-500 italic mb-4">{item.state}</p>

      {/* Call button */}
      <a
        href={`tel:${item.number}`}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-500 text-white
                   px-4 py-2 rounded-full text-sm font-medium shadow hover:shadow-md hover:from-blue-700 
                   hover:to-indigo-600 transition-all duration-300"
      >
        <Phone className="w-4 h-4" /> Call {item.number}
      </a>
    </motion.div>
  );
}
