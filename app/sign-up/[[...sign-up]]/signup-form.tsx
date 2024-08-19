"use client";
import React from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useSignUp } from "@clerk/nextjs";
import { useState } from "react";

interface SignupFormProps {
  setVeryfing: (value: boolean) => void;
}

export default function SignupForm({ setVeryfing }: SignupFormProps) {
  const { isLoaded, signUp } = useSignUp();
  const stripe = useStripe();
  const elements = useElements();
  const [priceId, setPriceId] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (!isLoaded && signUp) {
      return null;
    }

    try {
      if (!elements || !stripe) {
        return;
      }

      console.log("submitting");

      let cardToken = "";
      const cardEl = elements.getElement("card");

      if (cardEl) {
        const res = await stripe.createToken(cardEl);
        cardToken = res?.token?.id || "";
      }

      await signUp?.create({
        emailAddress: email,
        unsafeMetadata: {
          cardToken,
          priceId,
        },
      });

      await signUp?.prepareEmailAddressVerification();

      setVeryfing(true);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign up</h1>
      <input
        type="email"
        placeholder="Email"
        id="emailAddress"
        name="emailAddress"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        id="password"
        name="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Red pill</span>
            <input
              type="radio"
              name="radio-10"
              value="prod_QgfdtXa2G41Jr2"
              className="radio checked:bg-red-500"
              defaultChecked
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Blue pill</span>
            <input
              type="radio"
              value="prod_QgfdtXa2G41Jr2"
              name="radio-10"
              className="radio checked:bg-blue-500"
              defaultChecked
            />
          </label>
        </div>

        <CardElement />
      </div>
      <button type="submit" disabled={!isLoaded}>
        Sign up
      </button>
    </form>
  );
}
