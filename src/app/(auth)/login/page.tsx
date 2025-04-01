"use client"
import Link from "next/link";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { LoginService } from "@/services/LoginService";

const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve conter ao menos 8 caracteres"),
});

const loginService = new LoginService();
type FormData = z.infer<typeof formSchema>;

const login = async (data: FormData) => {
  try {
    const response = await loginService.login(data.email, data.password);
    localStorage.setItem("JWT_TOKEN", response.data.token);
    console.log("token armazenado: " + localStorage.getItem("JWT_TOKEN"));
    return response.data; 
  } catch (error) {
    console.log("Login error");
    throw error; 
  }
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    //reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  // só pra não bugar o container por causa do eslint
  console.log(isSubmitting);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      console.log("LOGOU!");
      window.location.href = "/users"
      //reset();
    },
    onError: (error) => {
      console.log('nao logou');
      alert(`Erro ao cadastrar: ${(error as Error).message}`)
    },
  });

  return (
    <div className="flex h-screen">
      <div className="relative items-start justify-start w-[50vw] p-10 flex flex-col">
        <div className="m-auto"></div>

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
            <Input className="w-[300px] mt-1 bg-primary text-primary-foreground" type="password" id="password" placeholder="Digite sua senha" {...register("password")} required></Input>
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
