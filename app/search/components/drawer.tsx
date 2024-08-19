"use client";
import {
  DrawerTrigger,
  Drawer,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Check } from "@/app/components/check";

export default function DrawerShad() {
  return (
    <Drawer>
      <DrawerTrigger className="flex items-center justify-center px-6 py-2.5 text-center duration-200 bg-[#ffdb47] border-2 border-black rounded-md nline-flex hover:bg-transparent hover:border-black hover:text-black focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-black text-[#434343] w-1/2 sm:w-[20px] mt-4">
        🧠
      </DrawerTrigger>
      <DrawerContent className="p-14 flex items-center text-center">
        <div className="flex flex-col shadow-2xl rounded-3xl w-full sm:w-1/2 mt-12 border-[#ffdb47] border">
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
      </DrawerContent>
    </Drawer>
  );
}
