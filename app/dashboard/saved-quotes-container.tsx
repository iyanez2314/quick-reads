import React, { Suspense } from "react";

export default function SavedQuotesContainer() {
  return (
    <div className="flex flex-col">
      <div className="flex items-baseline gap-4 justify-center">
        <h1 className="text-xl text-left text-black font-bold mt-12">
          Your Saved Quotes
        </h1>

        <input
          type="text"
          placeholder="Book Title"
          className="input bg-transparent"
        />
      </div>

      {/* Quotes container */}
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex flex-col gap-4 mt-4 ">
          <div className="flex flex-col gap-2 bg-[#ffffff] shadow-2xl p-6 rounded-2xl">
            <p className="text-black font-bold">Book Title</p>
            <p className="text-black">"Quote 1 content"</p>
          </div>
          <div className="flex flex-col gap-2 bg-[#ffffff] shadow-2xl p-6 rounded-2xl">
            <p className="text-black font-bold">Book Title</p>
            <p className="text-black">"Quote 2 content"</p>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
