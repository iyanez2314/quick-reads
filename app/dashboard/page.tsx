import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardHeader from "./dashboard-header";
import SavedQuotesContainer from "./saved-quotes-container";

export default async function page() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const { imageUrl, fullName } = user;

  return (
    <div className="min-h-screen sm:mx-auto mx-14">
      <DashboardHeader imageUrl={imageUrl} fullName={fullName} />
      <SavedQuotesContainer />
    </div>
  );
}
