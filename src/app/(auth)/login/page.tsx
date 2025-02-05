"use client"

import Link from "next/link";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";



export default function Login() {

  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", formData);
    // Chamar uma API de autenticação
  };


  return (
    <div className="flex h-screen">
      <div className="flex items-center justify-center bg-black w-[50vw] text-white">LOGO</div>
      <div className="flex items-center justify-center bg-white w-[50vw] text-black">
        <div>
          <h1 className="text-2xl text-primary pb-10">Bem vindo!</h1>
          <form onSubmit={handleSubmit}>
            <label title="email">Email:</label>
            <Input type="text" id="email" name="email" placeholder="Digite seu e-mail" onChange={handleChange} required></Input>

            <label title="password">Senha:</label>
            <Input type="text" id="password" name="password" placeholder="Digite sua senha" onChange={handleChange} required></Input>
            <Button type="submit" >
              Entrar
            </Button>

            <Link href={'/register'} className="ml-6">
            <Button>
              Registrar
            </Button>
          </Link>
          </form>
        </div>
      </div>
    </div>
  );
}