"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleMinus, CirclePlus } from "lucide-react";
import { usePomodoro } from "@/hooks/usePomodoro";
import Navbar from "@/components/navbar";
import TODOLIST from "@/components/todolist";
import { toast } from "sonner";

export default function Pomodoro() {
  const router = useRouter();

  // Estado para o valor do input começando com 25:00
  const [inputTime, setInputTime] = useState("25:00");
  // Controla se o usuário está digitando...
  const [isTyping, setIsTyping] = useState(false);
  // Timeout para reset do isTyping
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Pega as funções e estados do hook pomodoro
  const {
    mode,
    isRunning,
    timeLeft,
    play,
    pause,
    stop,
    increaseTime,
    decreaseTime,
    setFocusTime,
    setBreakTime,
    setTimeLeft,
  } = usePomodoro();

  // handle para validar a digitação no input
  const handleTimeChanged = (e) => {
    // trava a edição do tempo enquanto o pomodoro estiver rodando
    if (isRunning) return;

    // indica que o usuário está digitando no momento
    setIsTyping(true);

    // evita timeouts acumulados
    if (typingTimeout) clearTimeout(typingTimeout);

    // depois de 1 segundo sem digitar, libera a sincronização com o timer
    // isso foi porque tinha um bug chato que bugava todo o input quando digitava um tempo
    setTypingTimeout(setTimeout(() => {
      setIsTyping(false);
    }, 1000));

    let novoTempo = e.target.value;

    // filtra só números e dois pontos são permitidos no input pra não deixar adicionar letras e simbolos estranhos
    novoTempo = novoTempo.replace(/[^\d:]/g, '');

    // manter no máximo um ":"
    const partes = novoTempo.split(':');
    if (partes.length > 2) {
      novoTempo = partes[0] + ':' + partes.slice(1).join('');
    }

    // atualiza o valor exibido no input
    setInputTime(novoTempo);

    // se o formato estiver correto por ex: 25:00, aplica a mudança no timer
    const formatoValido = novoTempo.match(/^(\d{1,3}):(\d{2})$/);
    if (formatoValido) {
      let minutos = parseInt(formatoValido[1]);
      let segundos = parseInt(formatoValido[2]);

      // se os segundos passaram de 59, converte automaticamente para minutos
      if (segundos >= 60) {
        minutos += Math.floor(segundos / 60);
        segundos = segundos % 60;
      }

      // formata tudo para segundos
      const totalEmSegundos = minutos * 60 + segundos;

      // limite máximo de 2 horas ou 120 minutos
      const LIMITE_MAXIMO = 120 * 60;
      if (totalEmSegundos > LIMITE_MAXIMO) return;

      // aplica o novo tempo no estado principal do pomodoro
      setTimeLeft(totalEmSegundos);

      // troca de Focus para Break de acordo com os segundos restantes.
      if (mode === "FOCUS") {
        setFocusTime(totalEmSegundos);
      } else {
        setBreakTime(totalEmSegundos);
      }
    }
  };

  // Sincroniza o input com o timeLeft quando o pomodoro roda
  useEffect(() => {
    if (timeLeft !== undefined && !isTyping) {
      const mins = Math.floor(timeLeft / 60);
      const secs = timeLeft % 60;
      setInputTime(`${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`);
    }
  }, [timeLeft, isTyping]);

  // valida se usuário está logado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
    }
  }, [router]);

  // estado para a To Do List
  const [todos, setTodos] = React.useState([]);

  return (
    <div className="flex flex-col items-center justify-between cursor-pointer">
      <Navbar />

      <main className="flex w-full min-h-screen md:max-h-screen flex-col items-center pt-4 px-4">
        <Image src="/rocket.png" alt="Next.js Logo" width={100} height={100} />
        <h1 className="text-2xl font-black text-white">FOCUSNAULT</h1>
        <p className="text-white/30 text-center">Fique livre para focar em até <br /> no máximo 120:00 ou 119h:59m</p>

        {/* Timer do Pomodoro */}
        <Card className="w-full max-w-full sm:max-w-md md:max-w-sm bg-[#5E689F] text-white cursor-pointer mt-2">
          <div className="flex gap-2 sm:gap-2 justify-center items-center px-2 sm:px-8 ">
            {/* Botão diminuir tempo */}
            <Button
              className="my-auto bg-[#7074B3] hover:bg-[#595B92] transition-all duration-300 cursor-pointer p-2 sm:p-4"
              onClick={decreaseTime}
            >
              <CircleMinus className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>

            <div className="flex flex-col flex-1">
              <div className="flex flex-col gap-1 sm:gap-2 items-center">
                {/* Modo atual (Foco/Pausa) */}
                <Label className="text-base sm:text-lg font-black animate-pulse">{mode}</Label>

                {/* Input para digitar o tempo */}
                <input
                  type="text"
                  value={inputTime}
                  onChange={handleTimeChanged}
                  disabled={isRunning}
                  className="w-full max-w-35 sm:max-w-50 md:max-w-70 text-3xl sm:text-5xl md:text-7xl font-black text-center bg-transparent border-none focus:outline-none disabled:opacity-50"
                  placeholder="MM:SS"
                />
              </div>

              {/* Botões de controle */}
              <div className="flex flex-row mt-3 sm:mt-4 items-center gap-1 sm:gap-2 justify-center">
                <Button
                  className="bg-[#7074B3] hover:bg-[#FF7A01] transition-all duration-300 px-2 sm:px-4 py-1 sm:py-2 flex-1 font-extrabold cursor-pointer text-xs sm:text-sm md:text-base"
                  size="lg"
                  onClick={ () => {
                    pause();
                    toast.warning("Pomodoro Pausado");
                  }}
                >
                  Pause
                </Button>
                <Button
                  className="bg-[#7074B3] hover:bg-[#258DE1] transition-all duration-300 px-2 sm:px-4 py-1 sm:py-2 flex-1 font-extrabold cursor-pointer text-xs sm:text-sm md:text-base"
                  size="lg"
                  onClick={() => {
                    play();
                    toast.success("Pomodoro Iniciado");
                  }}
                >
                  Play
                </Button>
                <Button
                  className="bg-[#7074B3] hover:bg-[#EC003F] transition-all duration-300 px-2 sm:px-4 py-1 sm:py-2 flex-1 font-extrabold cursor-pointer text-xs sm:text-sm md:text-base"
                  size="lg"
                  onClick={() => {
                    stop();
                    toast.error("Pomodoro Parado");
                  }}
                >
                  Stop
                </Button>
              </div>
            </div>

            {/* Botão aumentar tempo */}
            <Button
              className="my-auto bg-[#7074B3] hover:bg-[#595B92] transition-all duration-300 cursor-pointer p-2 sm:p-4"
              onClick={increaseTime}
            >
              <CirclePlus className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </div>
        </Card>

        {/* To do List */}
        <TODOLIST todos={todos} setTodos={setTodos} />

        <Label className="text-white/30 mt-4">
          Desenvolvido pela Six Team - Hackathon Kiza Dev
        </Label>
        <Label className="text-white/20 mt-2 mb-12">v0.1.0</Label>
      </main>
    </div>
  );
}