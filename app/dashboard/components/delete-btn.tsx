"use client";
import React from "react";
import { useFormStatus } from "react-dom";

export default function DeleteButton(): JSX.Element {
  const { pending } = useFormStatus();
  return (
    <button className="text-red-500 font-bold" disabled={pending}>
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
