"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import Image from "next/image"
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const api = 'http://localhost:3007'

import {toast} from "sonner"

export default function CriarConta() {
  //useState do take the input
  const [form, setForm] = useState({ emailIn: '', passwordIn: '', passwordConf: '' })
  const router = useRouter();

  // function to take new changes on the inputs
  function HandleChange(e) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    })
  }

  // connect with back end and send to DB
  async function HandleSubmit() {

    // validation
    if (form.passwordIn !== form.passwordConf) {
      toast.error("As senhas não coincidem");
      return;
    }

    try {
      const res = await fetch(`${api}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.emailIn,
          password: form.passwordIn,
          isAdmin: false
        })
      });

      const data = await res.json();

      // clean form
      setForm({
        emailIn: '',
        passwordIn: '',
        passwordConf: ''
      });
      // after register successfully send to login page
      router.push("/signin");
      toast.success("Conta criada com sucesso!");
    } catch (err) {
      // console.error("Erro:", err);
      toast.error("Erro ao criar conta");
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
          {/* Campos de criar conta */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="create-email">Email</Label >
            <Input name='emailIn' value={form.emailIn} onChange={HandleChange} id="create-email" placeholder="Digite seu Email" className="focus:ring-0! placeholder:text-white/30" />
            <Label htmlFor="create-password" className="mt-2">Senha</Label >
            <Input name='passwordIn' value={form.passwordIn} onChange={HandleChange} id="create-password" placeholder="Digite sua Senha" type="password" className="focus:ring-0! placeholder:text-white/30" />
            <Label htmlFor="validate-password" className="mt-2">Confirme sua senha</Label >
            <Input name='passwordConf' value={form.passwordConf} onChange={HandleChange} id="validate-password" placeholder="Confirme sua senha" type="password" className="focus:ring-0! placeholder:text-white/30" />
          </div>

          {/* Link para recuperação de senha */}
          <Link href="/signin" className="text-white/30 hover:underline">
            Fazer login
          </Link>

          {/* Botões de login */}
          <div className="flex flex-col gap-2">
            <Button onClick={HandleSubmit} id="create-account" type="submit" className="bg-[#5E689F] hover:bg-indigo-400 py-6">Criar Conta</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
