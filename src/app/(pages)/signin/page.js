"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import Image from "next/image"
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useEffect } from "react";
import { toast } from "sonner";

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const router = useRouter();
  const api = 'http://localhost:3007';
  const [username, setUsername] = useState(''); // declara o username

  function HandleChange(e) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    })
    return username;
  };

  // useEffect para verificar o status do login e fazer redirecionamento
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');

    if (!token) {
      router.push('/signin');
    } else {
      const name = storedUsername.split('@')[0];
      setUsername(name); // não sei porque mais sem isso da um bug feio
    }
  }, []);

  // Função para validar o login
  async function HandleLogin() {
    try {
      const res = await fetch(`${api}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error("Email ou senha incorretos");
        return;
      }
      toast.success("Login realizado com sucesso!");

      // salvando dados do usuário no localstorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.username);

      router.push("/pomodoro");

    } catch (error) {
      // console.error(error);
      toast.error("Erro ao realizar login!");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex h-full w-full max-w-3xl flex-col justify-center items-center py-32 px-16 text-center">
        <Image src="/rocket.png" alt="FOCUSNAULT Logo" width={100} height={100} />
        <h1 className="text-3xl font-black text-white">FOCUSNAULT</h1>
        <p className="text-xl font-bold text-white">Ready - Set - Launch!</p>
        <p className="text-md w-1/2 text-white">Para acessar sua conta, faça login abaixo:</p>

        <div className="w-full md:w-1/2 flex flex-col gap-4 text-white mt-4">
          {/* Campos de login */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label >
            <Input name='username' value={form.username} onChange={HandleChange} id="email" placeholder="Digite seu Email" className="focus:ring-0! placeholder:text-white/30" />
            <Label htmlFor="password" className="mt-2">Senha</Label >
            <Input name='password' value={form.password} onChange={HandleChange} id="password" placeholder="Digite sua Senha" type="password" className="focus:ring-0! placeholder:text-white/30" />
          </div>

          {/* Link para recuperação de senha */}
          <Link href="/forgot-password" className="text-white/30 hover:underline">
            Esqueceu sua senha?
          </Link>

          {/* Botões de login */}
          <div className="flex flex-col gap-2">
            <Button onClick={HandleLogin} id="login-button" type="submit" className="bg-[#5E689F] hover:bg-indigo-400 py-6">Fazer Login</Button>
            <Separator className="opacity-20 mt-4 w-10! mx-auto h-1! rounded-full" />
            <Link href="/signup" className="bg-[#5E689F] hover:bg-indigo-400 py-6 w-full rounded-sm h-10 justify-center items-center flex text-sm mt-4">
              Criar uma conta
            </Link>
          </div>

        </div>
        <Label className="text-white/30 mt-4">Desenvolvido pela Six Team - Hackathon Kiza Dev</Label>
        <Label className="text-white/20 mt-2 mb-12">v0.1.0</Label>
      </main>
    </div>
  );
}
