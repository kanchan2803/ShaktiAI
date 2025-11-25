import React, { useState } from "react";
import { FileText, Search, Filter, Download, Eye, X } from "lucide-react";
import HelplinesFooter from "../components/helplines/HelplinesFooter";

// ✅ SAMPLE DATA (You can expand this later)
const sampleDocs = [

  {
    id: 1,
    title: "Standard Forms of Legal Documents – Vol I",
    category: "Legal Templates",
    description: "Volume I of the standard legal document forms published by the Legislative Department, Ministry of Law & Justice, Govt. of India. Available for download and editing.",
    howToUse: "Download the PDF, customise client and case details, print on stamp paper and execute as required.",
    source: "Legislative Department, MoL&J",
    source_url: "https://legislative.gov.in/standard-form-of-legal-documents/vol-i",  // home page link
    image_url: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Emblem_of_India.svg",
  },
  {
    id: 2,
    title: "FIR Format Template for Theft / Property Offence",
    category: "Police Forms",
    description: "Sample First Information Report (FIR) format to report theft or property offence at police station level.",
    howToUse: "Fill in the complainant details, incident information, attach proof of identity and submit at the local police station.",
    source: "eCourts Forms – eCourts Services, GoI", 
    source_url: "https://www.ecourts.gov.in/ecourts_home/static/informationletter.php",  // link to forms
    image_url: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Indian_Police_Service_Logo.png",
  },
  {
    id: 3,
    title: "Affidavit Format for Name Change",
    category: "Court / Civil Forms",
    description: "A legal affidavit template used for name change applications under Indian law.",
    howToUse: "Print the affidavit on stamp paper, notarise the change, submit to Gazette Office and update records accordingly.",
    source: "Standard Forms – Legislative Department, GoI",
    source_url: "https://legislative.gov.in/standard-form-of-legal-documents/",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Law_icon_2.svg",
  },
  {
    id: 4,
    title: "RTI Application Template",
    category: "Administrative Forms",
    description: "Right to Information (RTI) application format for seeking information from public authorities under the Right to Information Act, 2005.",
    howToUse: "Address the application to the PIO of the concerned department, attach requisite fee and information request details, and submit.",
    source: "National Portal of India – Law & Justice Section", 
    source_url: "https://www.india.gov.in/topics/law-justice",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/7/7c/RTI_Logo.png",
  },
  {
    id: 5,
    title: "Application Form for Anticipatory Bail – Sample",
    category: "Court / Criminal Forms",
    description: "Template for filing an anticipatory bail application under Section 438 of the Criminal Procedure Code, 1973 before competent court.",
    howToUse: "Customize party details, facts of the case, grounds for anticipatory bail and file through advocate in the appropriate court.",
    source: "Supreme Court of India – Forms Page", 
    source_url: "https://www.sci.gov.in/forms/",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Court.svg",
  },

  {
    id: 1,
    title: "FIR Format for Theft",
    category: "Police",
    description: "Standard FIR format to report theft cases at local police stations.",
    howToUse: "Fill complainant details, attach proof of identity, and submit at the nearest PS.",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Indian_Police_Service_Logo.png",
  },
  {
    id: 2,
    title: "Affidavit for Name Change",
    category: "Court",
    description: "A legal declaration format for change of name under the Indian law.",
    howToUse: "Print on ₹10 stamp paper, notarize, and submit to Gazette Office.",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Emblem_of_India.svg",
  },
  {
    id: 3,
    title: "Legal Notice for Property Dispute",
    category: "Property",
    description: "Notice format to send to the opposite party before filing civil suit.",
    howToUse: "Customize sender and recipient details before sending via registered post.",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Law_icon_2.svg",
  },
  {
    id: 4,
    title: "RTI Application Template",
    category: "RTI",
    description: "Right to Information Act format to request public authority details.",
    howToUse: "Address to PIO, attach ₹10 IPO, and mail to concerned department.",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7c/RTI_Logo.png",
  },
  {
    id: 5,
    title: "Tenant Agreement Format",
    category: "Civil",
    description: "Standard rental agreement template with owner and tenant clauses.",
    howToUse: "Print on stamp paper and get signatures of both parties with witnesses.",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Home_icon_black.svg",
  },
  {
    id: 6,
    title: "Complaint Letter for Domestic Violence",
    category: "Personal",
    description: "Official format to file complaint under the Domestic Violence Act, 2005.",
    howToUse: "Attach proof, witness list, and submit to Protection Officer or local PS.",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Stop_violence_icon.svg",
  },
  {
    id: 7,
    title: "Application for Anticipatory Bail",
    category: "Court",
    description: "Sample format to request anticipatory bail under Section 438 CrPC.",
    howToUse: "Filed through lawyer in District or High Court as per jurisdiction.",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Court.svg",
  },
  {
    id: 8,
    title: "Cyber Crime Complaint Form",
    category: "Police",
    description: "Format to lodge a complaint for online fraud, threats, or cyber offenses.",
    howToUse: "Attach screenshot evidence and identity proof before submission.",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Computer_security_icon.svg",
  },
  {
    id: 9,
    title: "NDA (Non-Disclosure Agreement)",
    category: "Workplace",
    description: "Template for confidentiality agreements between two parties.",
    howToUse: "Customize names, terms, and duration; get both signatures notarized.",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Agreement_icon.svg",
  },
  {
    id: 10,
    title: "Missing Person Report",
    category: "Police",
    description: "Official police report format for registering a missing person case.",
    howToUse: "Submit to nearest police station with latest photograph and ID proof.",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/73/Missing_person_icon.svg",
  },
];

export default function DraftsDocs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDoc, setSelectedDoc] = useState(null);

  const categories = ["All", "Police", "Court", "Civil", "Personal", "Property", "RTI", "Workplace"];

  const filteredDocs = sampleDocs.filter(
    (doc) =>
      (selectedCategory === "All" || doc.category === selectedCategory) &&
      doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-black text-gray-900 dark:text-gray-100 transition-all duration-700">
      
      {/* HERO SECTION */}
      <div className="text-center py-12 px-4">
        <h1 className="text-4xl font-extrabold tracking-wide bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent dark:from-gray-300 dark:to-white">
          ⚖️ Latest Legal Drafts & Documents
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Access verified legal formats — FIRs, Affidavits, Notices, Applications & more.
        </p>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-wrap justify-center items-center gap-4 px-6 mb-8">
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 shadow-md rounded-full px-4 py-2 w-80">
          <Search className="text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search legal drafts..."
            className="w-full bg-transparent outline-none text-gray-800 dark:text-gray-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 shadow-md rounded-full px-4 py-2">
          <Filter className="text-gray-500 w-5 h-5" />
          <select
            className="bg-transparent outline-none text-gray-800 dark:text-gray-100"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* DOCUMENTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-12">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white dark:bg-gray-900 shadow-xl rounded-xl overflow-hidden hover:scale-105 transform transition duration-300 cursor-pointer"
            onClick={() => setSelectedDoc(doc)}
          >
            <img
                src={doc.image || doc.image_url}
                alt={doc.title}
                className="h-40 w-full object-contain bg-gray-50 dark:bg-gray-800"
                />

            <div className="p-4">
              <h2 className="font-semibold text-xl mb-1">{doc.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{doc.category}</p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">{doc.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* PREVIEW MODAL */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-11/12 max-w-2xl p-6 relative animate-fade-in">
            <button
              onClick={() => setSelectedDoc(null)}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-red-500"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-2">{selectedDoc.title}</h2>
            <p className="text-gray-500 mb-4">{selectedDoc.category}</p>
            <img src={selectedDoc.image} alt={selectedDoc.title} className="w-full h-48 object-contain mb-4" />
            <p className="text-gray-700 dark:text-gray-300 mb-3">{selectedDoc.description}</p>
            <h3 className="font-semibold text-lg mb-1">🧠 How to Use:</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedDoc.howToUse}</p>
            <button className="bg-yellow-500 hover:bg-yellow-600 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2">
              <Download size={18} /> Download (PDF)
            </button>
          </div>
        </div>
      )}
      <HelplinesFooter />
    </div>
  );
}
