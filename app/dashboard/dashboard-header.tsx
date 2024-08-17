import Image from "next/image";
import React from "react";

interface DashboardHeaderProps {
  imageUrl: string;
  fullName: string | null;
}

export default function DashboardHeader({
  imageUrl,
  fullName,
}: DashboardHeaderProps) {
  return (
    <>
      <h1 className="text-3xl underline  text-left text-black font-bold mt-12">
        Dashboard
      </h1>
      <div className="flex flex-col justify-center items-center mt-12">
        <Image
          className="rounded-full"
          src={imageUrl}
          alt="picture of user"
          width={70}
          height={70}
        />
        <h2 className="text-xl text-black font-bold mt-4">{fullName}</h2>
      </div>
    </>
  );
}
