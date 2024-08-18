import React from "react";
import DeleteButton from "./delete-btn";
import { deleteQuote } from "@/app/actions/actions";
interface SavedQuoteProps {
  bookTitle: string;
  quote: string;
  id: string;
}

export default function SavedQuote({ bookTitle, quote, id }: SavedQuoteProps) {
  return (
    <form action={deleteQuote}>
      <input type="hidden" name="quote" value={id} />
      <div className="flex flex-col gap-2 bg-[#ffffff] shadow-2xl p-6 rounded-2xl w-full">
        <div className="flex justify-between">
          <p className="text-black font-bold">{bookTitle}</p>
          <DeleteButton />
        </div>
        <p className="text-black">{quote}</p>
      </div>
    </form>
  );
}
