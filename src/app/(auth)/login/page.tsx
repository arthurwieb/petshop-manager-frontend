"use client"

import Link from "next/link";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import Logo from "@/public/images/logo_test.png";
import { useMutation } from "@tanstack/react-query";


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

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      alert("Usuário cadastrado com sucesso");
      reset();
    },
    onError: (error) => {
      alert(`Erro ao cadastrar: ${(error as Error).message}`)
    },
  });

  return (
    <div className="flex h-screen">
      <div className="relative items-start justify-start w-[50vw] p-10 flex flex-col">
        <div className="m-auto"><Image alt="logo" width={100} height={100} src={Logo}></Image></div>

        <h1 className="relative text-secondary-foreground mt-auto">TESTE </h1>
      </div>
      <div className="flex items-center justify-center bg-primary w-[50vw]">
        <div>
          <h1 className="text-2xl text-primary-foreground pb-10 ">Bem vindo!</h1>
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
            <label className="text-primary-foreground " title="email">Email:</label>
            <Input className="w-[300px] mt-1 bg-primary text-primary-foreground" type="text" id="email" placeholder="Digite seu e-mail" {...register("email")} required></Input>
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}

            <label className="text-primary-foreground " title="password">Senha:</label>
            <Input className="w-[300px] mt-1 bg-primary text-primary-foreground" type="text" id="password" placeholder="Digite sua senha" {...register("password")} required></Input>
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}

            <div className="flex flex-col">
              <Button className="mb-2 mt-2" type="submit" variant={"secondary"} disabled={mutation.isPending}>
                {mutation.isPending ? "Enviando..." : "Entrar"}
              </Button>

              <Link className="w-full mt-2" href={'/register'}>
                <Button className="w-full text-primary-foreground" variant={"ghost"}>
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
