"use client"

import { useState, useEffect } from 'react'
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])
  if (!isClient){
    return null;
  }


  
  return (
      <div className="h-screen flex">
        {/* LEFT  */}
        <div className="w-[11%] md:w-[8%] lg:w-[14%] xl:w-[14%] xxl:w-[11%] p-4 bg-[#0b0f1f]">
          <Link href="/" className="flex items-center justify-center mt-3">
            <Image src="/logo-white.png" alt="logo" width={190} height={42} />
          </Link>
          <Menu />
        </div>
        {/* RIGHT */}
        <div className="w-[89%] md:w-[92%] lg:w-[86%] xl:w-[86%] xxl:w-[89%] bg-[#F7F8FA] overflow-scroll">
          <Navbar/>
          {children}
        </div>
      </div>
  );
}
