import Image from "next/image";
import { Input } from "@/components/ui/input"


export default function Home() {
  return (
    <div className="flex h-screen">
      <div className="bg-secondary-foreground w-1/2 place-content-center">TESTE</div>
      <div className="bg-primary-foreground w-1/2 place-content-center flex justify-center items-center flex-col">
        <h1 className="text-2xl text-primary">Bem vindo!</h1>
        <span className="text-sm text-"> Continue com seu Login e Senha </span>
      </div>
    </div>
  );
}