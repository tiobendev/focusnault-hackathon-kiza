import Image from "next/image";
import ButtonDefault from "../components/button";

export default function Home() {
  return (
    <div className="flex flex-col h-screen items-center justify-center font-sans bg-indigo-[#2b2845]">
      <main className="flex h-full w-full max-w-3xl flex-col gap-4 justify-center items-center py-32 px-16 text-center">
        <Image src="/rocket.png" alt="FOCUSNAULT Logo" width={150} height={150} />
        <h1 className="text-6xl font-black text-white">FOCUSNAULT</h1>
        <p className="text-3xl font-bold text-white">Ready - Set - Launch!</p>
        <p className="text-lg w-1/2 text-white">Um Pomodoro e Checklists para melhorar seu foco nas atividades</p>
        <ButtonDefault textButton="Login" href="/signin"/>
        <ButtonDefault textButton="Criar Conta" href="/signup"/>
      </main>
      <p className="text-white/30 mb-8">Desenvolvido pela Six Team - Hackathon KizaDev</p>
    </div>
  );
}
