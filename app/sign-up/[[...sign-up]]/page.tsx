"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import SignupForm from "./signup-form";
import VerificationForm from "./verification-form";

export default function page() {
  const [veryfing, setVeryfing] = useState<boolean>(false);

  const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as
    | string
    | undefined;

  if (!stripeKey) {
    throw new Error("Stripe public key is not defined");
  }

  const stripePromise = loadStripe(stripeKey);

  if (veryfing) {
    console.log("veryfing");
    return <VerificationForm />;
  }

  return (
    <div>
      <Elements
        stripe={stripePromise}
        options={{
          appearance: {
            theme: "stripe",
          },
        }}
      >
        <SignupForm setVeryfing={setVeryfing} />
      </Elements>
    </div>
  );
}
