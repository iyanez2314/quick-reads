"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";
import { retrieveStripeCheckout } from "../actions/actions";

export default function Page() {
  const { session } = useClerk();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    retrieveStripeCheckout(sessionId).then(({ message, status }) => {
      if (status !== 200) {
        console.error("Error retrieving checkout session", message);
        return;
      }

      console.log("Checkout session retrieved", message);
    });
  }, [sessionId, session]);
  return (
    <div className="min-h-screen sm:mx-auto mx-14">
      <div className="mt-4 p-12 space-y-8">
        <div>
          <h1 className="text-4xl font-bold">BOOM! You got a big brain 🧠</h1>
          <p>Thank you for supporting.</p>
        </div>

        <div>
          <Link className="underline" href="/dashboard">
            Head back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
