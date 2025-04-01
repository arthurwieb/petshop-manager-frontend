"use client";

import { useState, useEffect } from "react";
import { UserService } from "@/services/UserService";

const userService = new UserService();

export default function Users() {
  const [users, setUsers] = useState<unknown>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await userService.getUsers();
        console.log(data)
        setUsers(data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div className="flex h-screen">
      <div className="flex items-center justify-center bg-white w-[50vw] text-black">
        <div>
          <h1 className="text-2xl text-primary pb-10">LISTA DE USUÁRIOS</h1>
          <pre>{JSON.stringify(users, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}