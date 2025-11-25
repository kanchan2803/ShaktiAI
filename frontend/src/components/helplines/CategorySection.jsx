// frontend/src/components/helplines/CategorySection.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  HeartPulse,
  AlertTriangle,
  Globe2,
  Phone,
  Building2,
} from "lucide-react";

// Category icons
const categoryIcons = {
  "National Helplines": Shield,
  "Women's Safety Helplines": HeartPulse,
  "Cybercrime / Online Fraud": AlertTriangle,
  "State-specific Helplines": Globe2,
  "Other Helplines": Phone,
};

// Professional gradient & accent map
const categoryStyles = {
  "National Helplines": {
    gradient: "from-blue-500 via-indigo-500 to-blue-600",
    accent: "text-blue-600",
    shadow: "shadow-blue-200/70",
  },
  "Women's Safety Helplines": {
    gradient: "from-pink-500 via-rose-500 to-rose-600",
    accent: "text-rose-600",
    shadow: "shadow-rose-200/70",
  },
  "Cybercrime / Online Fraud": {
    gradient: "from-purple-500 via-fuchsia-500 to-indigo-600",
    accent: "text-purple-600",
    shadow: "shadow-purple-200/70",
  },
  "State-specific Helplines": {
    gradient: "from-green-500 via-emerald-500 to-green-600",
    accent: "text-emerald-600",
    shadow: "shadow-green-200/70",
  },
  "Health & Mental Health": {
    gradient: "from-white-500 via-gray-500 to-gray-600",
    accent: "text-gray-700",
    shadow: "shadow-black-200/70",
  },
  "Disaster & Environment": {
    gradient: "from-orange-500 via-white-500 to-red-600",
    accent: "text-orange-700",
    shadow: "shadow-gray-200/70",
  },
  "Senior Citizens": {
    gradient: "from-blue-500 via-gray-500 to-yellow-600",
    accent: "text-yellow-700",
    shadow: "shadow-gray-200/70",
  },  
  "Agriculture & Rural Support": {
    gradient: "from-red-500 via-brown-500 to-white-600",
    accent: "text-brown-700",
    shadow: "shadow-gray-200/70",
  },    
};

export default function CategorySection({ title, items }) {
  const Icon = categoryIcons[title] || Building2;
  const style = categoryStyles[title] || categoryStyles["National Helplines"];

  if (!items || items.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-12 mb-16">
      {/* HEADER */}
      <div className="flex items-center space-x-3 mb-8">
        <div
          className={`p-3 rounded-full bg-gradient-to-r ${style.gradient} text-white shadow-md`}
        >
          <Icon size={24} />
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
          {title}
        </h2>
      </div>

      {/* CARD GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((h, index) => {
          const cStyle = categoryStyles[h.category] || style;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${cStyle.shadow}`}
            >
              {/* Subtle gradient top border glow */}
              <div
                className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${cStyle.gradient}`}
              />

              <div className="p-6 flex flex-col h-full">
                {/* Title & Badge */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {h.name}
                  </h3>
                  {h.category && (
                    <span
                      className={`px-3 py-1 text-xs font-medium text-white rounded-full bg-gradient-to-r ${cStyle.gradient}`}
                    >
                      {h.category}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm flex-grow mb-4 leading-relaxed">
                  {h.description || "—"}
                </p>

                {/* Contact Info */}
                <div className="mt-auto space-y-1">
                  <p className="text-sm text-gray-800">
                    <strong>Number:</strong>{" "}
                    <a
                      href={`tel:${h.number}`}
                      className={`${cStyle.accent} font-medium hover:underline`}
                    >
                      {h.number}
                    </a>
                  </p>
                  {h.state && (
                    <p className="text-xs text-gray-500">
                      State: {h.state}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}


// Previous code
// frontend/src/components/helplines/CategorySection.jsx
// import React from "react";
// import { motion } from "framer-motion";
// import {
//   Shield,
//   HeartPulse,
//   AlertTriangle,
//   Globe2,
//   Phone,
//   Users,
//   Building2,
// } from "lucide-react";

// const categoryIcons = {
//   "National Helplines": Shield,
//   "Women's Safety Helplines": HeartPulse,
//   "Cybercrime / Online Fraud": AlertTriangle,
//   "State-specific Helplines": Globe2,
//   "Other Helplines": Phone,
// };

// // gradient badges per category
// const categoryGradients = {
//   "National Helplines": "from-blue-500 to-indigo-500",
//   "Women's Safety Helplines": "from-pink-500 to-rose-500",
//   "Cybercrime / Online Fraud": "from-purple-500 to-fuchsia-500",
//   "State-specific Helplines": "from-green-500 to-emerald-500",
//   "Other Helplines": "from-slate-400 to-gray-600",
// };

// export default function CategorySection({ title, items }) {
//   const Icon = categoryIcons[title] || Building2;
//   const gradient = categoryGradients[title] || "from-blue-400 to-cyan-400";

//   if (!items || items.length === 0) return null;

//   return (
//     <section className="max-w-6xl mx-auto px-6 md:px-12 mb-16">
//       {/* Category Header */}
//       <div className="flex items-center space-x-3 mb-6">
//         <div
//           className={`p-3 rounded-full bg-gradient-to-r ${gradient} text-white shadow-md`}
//         >
//           <Icon size={24} />
//         </div>
//         <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
//           {title}
//         </h2>
//       </div>

//       {/* Cards Grid */}
//       <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {items.map((h, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.3, delay: index * 0.05 }}
//             className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300"
//           >
//             <div className="flex flex-col h-full">
//               {/* Title & Badge */}
//               <div className="flex items-center justify-between mb-2">
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   {h.name}
//                 </h3>
//                 {h.category && (
//                   <span
//                     className={`px-3 py-1 text-xs text-white rounded-full bg-gradient-to-r ${
//                       categoryGradients[h.category] || "from-indigo-400 to-blue-500"
//                     }`}
//                   >
//                     {h.category}
//                   </span>
//                 )}
//               </div>

//               {/* Description */}
//               <p className="text-gray-600 text-sm flex-grow mb-3">
//                 {h.description || "—"}
//               </p>

//               {/* Contact Info */}
//               <div className="mt-auto">
//                 <p className="text-sm text-gray-700">
//                   <strong>Number:</strong>{" "}
//                   <a
//                     href={`tel:${h.number}`}
//                     className="text-blue-600 hover:underline"
//                   >
//                     {h.number}
//                   </a>
//                 </p>
//                 {h.state && (
//                   <p className="text-xs text-gray-500 mt-1">State: {h.state}</p>
//                 )}
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </section>
//   );
// }
