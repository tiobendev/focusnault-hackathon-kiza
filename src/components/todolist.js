"use client";

import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "./ui/input-group";

import { SquarePlus } from "lucide-react";

import { useState, useEffect } from "react";


import Task from "./task";

import { toast } from "sonner";

const api = 'http://localhost:3007'

export default function TODOLIST() {
  const [form, setForm] = useState({ inputTask: '' });
  const [tasks, setTasks] = useState([]);

  // funcao opara pegar novas entradas no input
  function HandleChange(e) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    })
  }

  // manda para o backend
  async function SendToDb() {
    try {
      if (form.inputTask === '') {
        toast.warning("Digite uma tarefa antes de adicionar!");
      } else {

        const res = await fetch(`${api}/addTask`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            title: form.inputTask,
            is_completed: false
          })
        });

        const data = await res.json();
        // console.log(data);
        toast.success("Tarefa adicionada com sucesso!");
      }

      // limpa o input task field
      setForm({
        inputTask: ''
      })

      // update lista
      ShowTasks();

    } catch (error) {
      console.error('Error:', error)
      toast.error("Erro ao adicionar tarefa. Escreva uma tarefa.");
    }
  }
  // funcao que mostra o db na tela de cada user
  async function ShowTasks() {
    try {
      const res = await fetch(`${api}/show`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
      const data = await res.json();

      setTasks(data)

    } catch (error) {
      console.error("Error:", error)
    }
  }

  useEffect(() => {
    ShowTasks();
  }, []);

  // delete 
  async function DeleteTask(taskId) {
    try {
      const res = await fetch(`${api}/delete/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
      const data = await res.json();
      // some com ele da tela quando deletado
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success("Tarefa removida com sucesso!");
    } catch (error) {
      // console.error("Error deleting:", error)
      toast.error("Erro ao remover tarefa.");
    }
  }

  // mark as completed
  async function UpdateCheckBox(taskId, updateTask) {
    try {
      const res = await fetch(`${api}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          is_completed: updateTask.is_completed
        })
      })
      const data = await res.json();

      // atualisa o check box
      setTasks(prev =>
        prev.map(t =>
          t.id === taskId ? { ...t, is_completed: updateTask.is_completed ? 1 : 0 } : t
        )
      );

      if (updateTask.is_completed) {
        toast.success("Parabéns você completou uma tarefa! 🎊");
      } else if (!updateTask.is_completed) {
        toast.info("Tarefa marcada como pendente.");
      }

    } catch (error) {
      console.error("Error to mark:", error)
      toast.error("Erro ao atualizar tarefa.");
    }
  }

  // handle para o Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") SendToDb();
  };

  return (
    <div className="w-full max-w-full sm:max-w-md md:max-w-sm">
      <h2 className="w-fit mx-auto my-4 text-xl font-black text-white text-center">
        No que vamos focar hoje?
      </h2>

      {/* To do List */}
      <ScrollArea className="h-72 w-full mx-auto rounded-2xl border-2 border-[#9295c1]">
        <div className="w-full p-2">
          {/* se tiver alguma task na lista, renderiza a task na lista */}
          <div className="w-full">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id}>
                  <Task item={task}
                    onDelete={DeleteTask}
                    onUpdate={UpdateCheckBox} />
                  <Separator className="my-2 bg-[#9295c1]" />
                </div>
              ))
            ) : (

              <p className="text-center text-white/20 font-medium py-30">
                A lista está vazia. Adicione uma nova task!
              </p>
            )}
          </div>



        </div>
      </ScrollArea>

      {/* input pra adicionar uma task nova */}
      <InputGroup className="w-full mt-4 py-6 bg-[#5E689F] text-white">
        {/* input para adicionar uma task nova */}
        <InputGroupInput
          className="placeholder:text-white/30 text-lg! px-4"
          placeholder="Adicione uma nova atividade..."
          // tirei o id e coloquei name e value para pegar a task
          name="inputTask" value={form.inputTask}
          onChange={HandleChange}
          onKeyDown={handleKeyDown}

        />
        {/* botão de adicionar task */}
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            // o handle do botão para adicionar nova task
            className="bg-[#7074B3] hover:bg-[#595B92] px-3 py-5 rounded-lg text-white transition-all duration-300"
            variant="secondary"
            // adiciona funcao que manda para o back onclick
            onClick={SendToDb}

          >
            <SquarePlus className="scale-130" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
