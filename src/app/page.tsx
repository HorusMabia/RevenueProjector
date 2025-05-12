"use client";

import Image from "next/image";
export default function RevenueEstimator() {

  return (
    <div className="container mx-auto pb-10 px-4 max-w-5xl">
      <div className="flex flex-col items-center text-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={400}
          height={400}
          className="m-0 p-0 "
        />
      </div>
    </div>
  );
}
