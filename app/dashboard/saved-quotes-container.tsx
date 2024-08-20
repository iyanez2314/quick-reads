import React, { Fragment, Suspense } from "react";
import SavedQuote from "./components/saved-quote";
import Loading from "../components/loading";
import { auth } from "@clerk/nextjs/server";
import { useClerk } from "@clerk/nextjs";
import { usersQuotes } from "@/data-layer/user";

export default async function SavedQuotesContainer() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  // I need to call this function everytime the page is loaded
  const usersSavedQuotes = (await usersQuotes(userId)) as Array<any> | null;

  console.log(usersSavedQuotes);

  return (
    <div className="flex flex-col items-center">
      <Suspense fallback={<Loading />}>
        <div className="flex items-baseline w-full sm:w-1/2  justify-between">
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
        <div className="flex flex-col gap-4 mt-4 items-center pb-12 ">
          {
            // If there are no quotes saved, show a message
            usersSavedQuotes?.length === 0 && (
              <p className="text-lg">You have not saved any quotes yet. 🥺</p>
            )
          }
          {usersSavedQuotes?.map((quote) => (
            <Fragment key={quote.quote.id}>
              <SavedQuote
                id={quote.quote.id}
                bookTitle={quote.quote.book}
                quote={quote.quote.quote}
              />
            </Fragment>
          ))}
        </div>
      </Suspense>
    </div>
  );
}
