"use client";

import { useState, useEffect } from "react";
import { UserService } from "@/services/UserService";

const userService = new UserService();

interface User {
  id: number;
  name: string;
  email: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getAll()
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (!users) return null; 

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Lista de Usuários</h1>
      {users.length > 0 ? (
        users.map((user) => (
          <div key={user.id} className="mb-2 p-2 bg-gray-100 rounded">
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Nome:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        ))
      ) : (
        <p>Nenhum usuário encontrado.</p>
      )}
    </div>
  );
}