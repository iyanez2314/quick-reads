import React, { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function VerificationForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState<string>("");
  const router = useRouter();

  async function handleVerification(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoaded && !signUp) return null;

    try {
      const signInAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      console.log("Sign in attempt", signInAttempt);

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push("/after-sign-up");
      } else {
        console.log("Verification failed ):");
      }
    } catch (err) {
      console.log("Verification failed:", err);
      console.error(err);
      throw err;
    }
  }

  return (
    <form onSubmit={handleVerification}>
      <h1>Enter verification code</h1>
      <input
        type="text"
        placeholder="Verification code"
        id="code"
        name="code"
        required
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button type="submit" disabled={!isLoaded}>
        Verify
      </button>
    </form>
  );
}
