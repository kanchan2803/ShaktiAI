import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="w-10 h-10 border-4 border-purple-400 border-dashed rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
