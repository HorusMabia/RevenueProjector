"use client";

import Image from "next/image";
import CyberpunkNavbar from "@/components/CyberpunkNavbar"


export default function Home() {
  return (
    <div className="flex justify-center mx-auto">
      <CyberpunkNavbar />
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
