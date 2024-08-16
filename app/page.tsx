import Image from "next/image";
import Navbar from "./components/navbar";
import { Check } from "./components/check";
import { Arrowright } from "./components/arrow-right";

export default function Home() {
  return (
    <main className="">
      {/* Header */}
      <div className="h-[50vh] text-center mx-12 gap-6 flex flex-col justify-center items-center pt-12 text-[#434343]">
        <h3 className="text-3xl sm:text-4xl font-bold">
          Get motivated quick with quotes from entrepreneur books!
        </h3>
        <p className="text-xl sm:text-lg">
          You don't need to read a full book to feel the impact.
        </p>
        <div className="flex-col hidden sm:flex">
          <ul>
            <li className="flex items-center gap-2">
              <span>
                <Check />
              </span>
              Get impactful quotes
            </li>
            <li className="flex items-center gap-2">
              <span>
                <Check />
              </span>
              Gain Knowledge
            </li>
            <li className="flex items-center gap-2">
              <span>
                <Check />
              </span>
              Save Time
            </li>
          </ul>
        </div>
        <button className="flex items-center justify-center  px-6 py-2.5 text-center duration-200 bg-[#ffdb47] border-2 border-black rounded-full nline-flex hover:bg-transparent hover:border-black hover:text-black focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-black text-[#434343] w-1/2 sm:w-1/3">
          Join Now
          <span>
            <Arrowright />
          </span>
        </button>
      </div>
      {/* Video */}
      <div className="h-full justify-center flex items-center pt-12">
        <div className="w-[700px] h-[400px] bg-black"></div>
      </div>
      {/* Pricing */}
      <div className="flex flex-col  text-center p-24 gap-8">
        <h1 className="text-[#434343] text-2xl font-bold">
          Pricing to gain knowledge should be a no brainer right? 🧠
        </h1>
        {/* Pricing Container */}
        <div className="flex flex-col items-center justify-center sm:flex-col md:flex-row lg:flex-row xl:flex-row gap-12 pt-12">
          <div className="flex flex-col shadow-xl rounded-3xl w-full sm:w-full">
            <div className="px-6 py-8 sm:p-10 sm:pb-6 sm:w-1/2">
              <div className="grid items-center justify-center grid-cols-1 text-left">
                <div>
                  <h2 className="text-lg font-medium tracking-tighter text-gray-600 lg:text-3xl">
                    Starter
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Suitable to grow steadily.
                  </p>
                </div>
                <div className="mt-6">
                  <p>
                    <span className="text-5xl font-light tracking-tight text-black">
                      4.99
                    </span>
                    <span className="text-base font-medium text-gray-500">
                      {" "}
                      /mo{" "}
                    </span>
                  </p>
                </div>
                <ul className="mt-3">
                  <li className="flex items-center gap-2">
                    <span>
                      <Check />
                    </span>
                    Save 10 Quotes
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex px-6 pb-8 sm:px-8">
              <a
                aria-describedby="tier-company"
                className="flex items-center justify-center w-full px-6 py-2.5 text-center duration-200 bg-[#ffdb47] border-2 border-black rounded-full nline-flex hover:bg-transparent hover:border-black hover:text-black focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-black text-[#434343]"
                href="#"
              >
                Get started
              </a>
            </div>
          </div>
          <div className="flex flex-col shadow-2xl rounded-3xl w-full sm:w-full border-[#ffdb47] border">
            <div className="px-6 py-8 sm:p-10 sm:pb-6 w-1/2">
              <div className="grid items-center justify-center grid-cols-1 text-left">
                <div>
                  <h2 className="text-lg font-medium tracking-tighter text-gray-600 lg:text-3xl">
                    Big Brain 🧠
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Suitable for the big brains .
                  </p>
                </div>

                <div className="mt-6">
                  <p>
                    <span className="text-5xl font-light tracking-tight text-black">
                      9.99
                    </span>
                    <span className="text-base font-medium text-gray-500">
                      {" "}
                      /mo{" "}
                    </span>
                  </p>
                </div>
              </div>
              <ul className="mt-3 w-full">
                <li className="flex items-center gap-2 w-full">
                  <span>
                    <Check />
                  </span>
                  Save <span className="text-[#ffdb47]">UNLIMITED</span> Quotes
                </li>
              </ul>
            </div>
            <div className="flex px-6 pb-8 sm:px-8">
              <a
                aria-describedby="tier-company"
                className="flex items-center justify-center w-full px-6 py-2.5 text-center duration-200 bg-[#ffdb47] border-2 border-black rounded-full nline-flex hover:bg-transparent hover:border-black hover:text-black focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-black text-[#434343]"
                href="#"
              >
                Get started
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
