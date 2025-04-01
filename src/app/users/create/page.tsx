"use client"

import Link from "next/link";
import * as React from "react";
import { Button } from "@/components/ui/button";

export default function Users() {

  return (
    <div className="flex h-screen">
      <div className="flex items-center justify-center bg-black w-[50vw] text-white">
        <Link href={"/login"}>
          <Button className="text-white absolute top-4 left-4">Voltar</Button>
        </Link>
        <h1>LOGO</h1>
      </div>
      <div className="flex items-center justify-center bg-white w-[50vw] text-black">
        <div>
          <h1 className="text-2xl text-primary pb-10">CRIA USUÁRIO</h1>
        </div>
      </div>
    </div>
  );
}