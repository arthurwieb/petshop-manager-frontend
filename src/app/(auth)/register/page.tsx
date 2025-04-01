"use client"

import Link from "next/link";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

const cnpjRegex = /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/;

const validarCNPJ = (cnpj: string): boolean => {
  cnpj = cnpj.replace(/[^\d]+/g, ""); // Remove pontuação

  if (cnpj.length !== 14) return false;

  // CNPJs inválidos conhecidos
  if (/^(\d)\1+$/.test(cnpj)) return false;

  // Cálculo dos dígitos verificadores
  const calcularDigito = (cnpj: string, pos: number): number => {
    const pesos = pos === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const soma = cnpj.slice(0, pos).split("").reduce((acc, num, i) => acc + parseInt(num) * pesos[i], 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const d1 = calcularDigito(cnpj, 12);
  const d2 = calcularDigito(cnpj, 13);

  return d1 === parseInt(cnpj[12]) && d2 === parseInt(cnpj[13]);
};

const formSchema = z.object({
  name: z.string().min(3, "Nome deve possuir ao menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  cnpj: z.string().regex(cnpjRegex, "Formato inválido de CNPJ").refine(validarCNPJ, "CNPJ inválido"),
  address: z.string(),
  password: z.string().min(8, "Senha deve conter ao menos 8 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

const registerCompany = async (data: FormData) => {

  console.log("Simulando cadastro com os dados:", data);

  const response = await fetch("", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  console.log("Response Status:", response.status);
  if (!response.ok) {
    throw new Error("Erro ao cadastrar o usuário");
  }

  const responseData = await response.json();
  console.log("Resposta da API:", responseData); // Log da resposta
  return responseData;
};

export default function Register() {

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const mutation = useMutation({
    mutationFn: registerCompany,
    onSuccess: () => {
      console.log("registrado")
      alert("Cadastro realizado com sucesso");
      reset();
    },
    onError: (error) => {
      alert(`Erro ao cadastrar: ${(error as Error).message}`);
      console.log(error); 
    }
  });

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
          <h1 className="text-2xl text-primary pb-10">Bem vindo!</h1>
          <form onSubmit={handleSubmit((data) => {console.log("Dados enviados para mutação:", data); mutation.mutate(data)})}>
            <label title="name">Nome:</label>
            <Input  type="text" id="name" placeholder="Digite seu nome" {...register("name")} required></Input>
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}

            <label title="email">Email:</label>
            <Input  type="text" id="email" placeholder="Digite seu e-mail" {...register("email")} required></Input>
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}

            <label title="cnpj">CNPJ:</label>
            <Input  type="text" id="cnpj" placeholder="Digite seu CNPJ" {...register("cnpj")} required></Input>
            {errors.cnpj && <p className="text-red-500">{errors.cnpj.message}</p>}

            <label title="address">Endereço:</label>
            <Input  type="text" id="address" placeholder="Digite seu endereço" {...register("address")} required></Input>
            {errors.address && <p className="text-red-500">{errors.address.message}</p>}

            <label title="password">Senha:</label>
            <Input  type="password" id="password" placeholder="Digite sua senha" {...register("password")}  required></Input>
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}

            <label title="confirmPassword">Confirme sua senha:</label>
            <Input  type="password" id="confirmPassword" placeholder="Confirme sua senha" {...register("confirmPassword")} required></Input>
            {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
          
            <button className="mb-2 mt-2" type="submit" disabled={mutation.isPending || isSubmitting}>
              {mutation.isPending || isSubmitting ? "Enviando..." : "Registrar"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}