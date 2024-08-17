import React from "react";

export default function page() {
  return (
    <div className="min-h-screen sm:mx-auto mx-14">
      <h1 className="text-3xl underline  text-left text-black font-bold mt-12">
        Search
      </h1>
      <div className="flex justify-center items-baseline mt-12 gap-3">
        <input
          type="text"
          placeholder="Search for a book"
          className="input input-border bg-transparent"
        />
        <button className="flex items-center justify-center px-6 py-2.5 text-center duration-200 bg-[#ffdb47] border-2 border-black rounded-md nline-flex hover:bg-transparent hover:border-black hover:text-black focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-black text-[#434343] w-1/2 sm:w-1/3 mt-4">
          Search 🧠
        </button>
      </div>
    </div>
  );
}
