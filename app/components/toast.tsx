import React from "react";

interface ToastProps {
  text: string;
  subText?: string;
  error?: boolean;
}

export default function Toast({ text, subText, error }: ToastProps) {
  return (
    <div className="fixed bottom-4 right-4 bg-[#ffdb47] text-black p-4 rounded-lg flex flex-col items-start">
      <p>{text}</p>
      {subText && <p className="text-xs">{subText}</p>}
    </div>
  );
}
