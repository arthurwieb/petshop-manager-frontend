"use client"

import Link from "next/link";
import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve conter ao menos 8 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

const registerUser = async (data: FormData) => {
  const response = await fetch("", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao cadastrar o usuário");
  }

  return response.json();
};

export default function Login() {

    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      reset,
    } = useForm<FormData>({
      resolver: zodResolver(formSchema),
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
      try {
        await registerUser(data);
        alert("Usuário cadastrado com sucesso!");
        reset(); // Limpa os campos do formulário
      } catch (error: any) {
        alert(`Erro ao cadastrar: ${(error as Error).message}`);
      }
    };

  return (
      <div className="flex h-screen">
        <div className="relative items-start justify-start w-[50vw] p-10 flex flex-col">
          <div className="absolute bg-zinc-900 inset-0"></div>
          <h1 className="relative text-white">LOGO</h1>
          <h1 className="relative text-white mt-auto">TESTE </h1>
        </div>
        <div className="flex items-center justify-center bg-darkPurple w-[50vw]">
          <div>
            <h1 className="text-2xl text-primary text-white pb-10 font-sans">Bem vindo!</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label className="text-white font-sans" title="email">Email:</label>
              <Input className="w-[300px] mt-1 mb-4 bg-black text-white" type="text" id="email" placeholder="Digite seu e-mail" {...register("email")} required></Input>
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}

              <label className="text-white font-sans" title="password">Senha:</label>
              <Input className="w-[300px] mt-1 bg-black text-white" type="text" id="password" placeholder="Digite sua senha" {...register("password")} required></Input>
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
              
              <div className="flex flex-col">
                <Button className="mb-2 mt-2 font-sans" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Entrar"}
                </Button>

                <Link className="w-full mt-2" href={'/register'}>
                <Button className="w-full font-sans">
                  Registrar
                </Button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};
