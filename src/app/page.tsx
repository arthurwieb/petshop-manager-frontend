'use client';
import { sessionStore } from '@/store/session-store';
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const isLoggedIn = sessionStore.getState().isLoggedIn();

  console.log('isLoggedIn', isLoggedIn);

  useEffect(() => {
  if (isLoggedIn) {
    console.log('Usuário logado — redirecionando para /pet');
    router.replace('/pet');
  } else {
    console.log('Usuário não logado — redirecionando para /login');
    router.replace('/login');
  }
}, [isLoggedIn, router]);

  return null;
}
