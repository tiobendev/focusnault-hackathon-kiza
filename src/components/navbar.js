import React, { useEffect, useState } from 'react';

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage, AvatarBadge } from "@/components/ui/avatar"
import { useRouter } from 'next/navigation'

import { toast } from "sonner";

function Navbar() {
  const router = useRouter();
  const [storedUserName, setStoredUserName] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Hook para desconectar
  const HandleDisconnect = () => {
    localStorage.removeItem('token');
    router.push('/signin');
    toast.info("Você saiu da sua conta.");
  }

  // validação da rota
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
    }
  }, [router]);

  // Pegar nome do usuário
  useEffect(() => {
    const userName = localStorage.getItem("username") || "";
    setStoredUserName(userName);
    setIsClient(true);
  }, []);

  // Fazendo split do @...
  const name = storedUserName?.split("@")[0] || "";

  return (
    <div className='flex px-4 py-8 gap-4 w-full mx-auto items-center justify-center'>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
        <AvatarBadge className="bg-green-600 dark:bg-green-800" />
      </Avatar>
      <p className="flex text-white text-xl justify-left items-center font-semibold w-50">
        Olá, {isClient ? name : "..."}!
      </p>
      <DropdownMenu className="w-fit bg-[#5E689F] border-0">
        <DropdownMenuTrigger asChild>
          <Button className="w-32 bg-white/20 hover:bg-[#5E689F] border-0 ring-0! hover:ring-0!">Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={HandleDisconnect}>Logout</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default Navbar