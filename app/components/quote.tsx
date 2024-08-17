import React from "react";

export function Quote({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-100 border-l-4 border-blue-500 text-gray-700 italic p-4">
      {children}
    </div>
  );
}
