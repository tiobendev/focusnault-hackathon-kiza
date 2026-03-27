"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import Image from "next/image"
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const api = 'http://localhost:3007'

import { toast } from "sonner";

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const router = useRouter();

    function HandleChange(e) {
        setEmail(e.target.value)
    }

    async function HandleSubmit() {
        // console.log('Email sent', email);

        if (!email.includes('@')) {
            toast.error("Digite um email válido");
            return;
        }

        try {
            const res = await fetch(`${api}/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email
                })
            });

            const data = await res.json();
            //console.log(data);
            toast.success("Email enviado com sucesso!");
            setEmail('');

            router.push("/signin");
        } catch (err) {
            // console.error("Erro:", err);
            toast.error("Erro ao enviar email");
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <main className="flex h-full w-full max-w-3xl flex-col justify-center items-center py-32 px-16 text-center">
                <Image src="/rocket.png" alt="FOCUSNAULT Logo" width={100} height={100} />
                <h1 className="text-3xl font-black text-white">FOCUSNAULT</h1>
                <p className="text-xl font-bold text-white">Ready - Set - Launch!</p>
                <p className="text-md w-1/2 text-white">Esqueceu sua senha? <br />Digite seu email abaixo:</p>

                <div className="w-full md:w-1/2 flex flex-col gap-4 text-white mt-4">

                    {/* Campo de email */}
                    <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input value={email} onChange={HandleChange} id="email" placeholder="Digite seu Email" className="focus:ring-0! placeholder:text-white/30" />
                </div>

                    {/* Link para voltar ao login */}
                    <Link href="/signin" className="text-white/30 hover:underline">Voltar ao login</Link>

                    {/* Botão de enviar e-mail*/}
                    <div className="flex flex-col gap-2">
                        <Button onClick={HandleSubmit} id="send-email" type="submit" className="bg-[#5E689F] hover:bg-indigo-400 py-6">Enviar Email</Button>
                    </div>
                </div>
            </main>
        </div>
    );
}