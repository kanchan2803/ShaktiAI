// frontend/src/components/news/footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-8 mt-8">
      <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <div className="font-semibold">Shakti.ai</div>
          <div className="text-sm text-blue-200">Empowering women with knowledge & safety.</div>
        </div>

        <div className="text-sm text-blue-200">
          <div>Contact: support@shakti.ai</div>
          <div className="mt-1">© {new Date().getFullYear()} Shakti.ai</div>
        </div>
      </div>
    </footer>
  );
}
