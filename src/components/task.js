"use client";
import { Card } from "@/components/ui/card";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { Trash } from "lucide-react";

// Task tem as props item, onUpdate, onDelete para facilitar na hora de chamar as funções na todolist.js
export default function Task({ item, onUpdate, onDelete }) {
  // guarda o texto digitado no input
  const [editedTitle, setEditedTitle] = useState(item?.title || "");

  // quando sai do input, se o texto mudar ele salva
  const handleSave = () => {
    if (onUpdate && editedTitle !== item.title) {
      onUpdate(item.id, { ...item, title: editedTitle });
    }
  };

  // se apertar enter, tira o foco do input (salva automaticamente)
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };

  // quando marca/desmarca o checkbox, avisa o pai
  const handleCheckboxChange = (checked) => {
    if (onUpdate) {
      const isCompleted = checked === true;
      onUpdate(item.id, { ...item, is_completed: isCompleted });
    }
  };

  // quando clica no botão de lixeira, avisa o pai pra remover
  const handleDelete = () => {
    if (onDelete) {
      onDelete(item.id);
    }
  };

  return (
    <Card className="px-4 py-4 text-sm flex flex-row justify-between items-center gap-2 bg-[#5E689F] hover:bg-[#4a5382] hover:shadow-md transition-all duration-300 text-white">
      <div className="flex gap-2 w-full flex-1">
        <Checkbox
          className="bg-[#7074B3] hover:bg-[#7075c3] transition-all duration-300 font-black text-xl mt-[0.15rem] text-white cursor-pointer"
          // mudei aqui pq ele nao marcava o box ja que o db retorna 1 ou 0 boolean
          checked={item?.is_completed === 1}
          onCheckedChange={handleCheckboxChange}
        />
        <Input
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className={`flex flex-1 w-full border-0 shadow-none text-white placeholder:text-white/30 ${
            item?.is_completed ? "line-through opacity-50" : ""
          }`}
        />
      </div>
      <div>
        <Button
          className="bg-[#7074B3] hover:bg-red-400 transition-all duration-300 cursor-pointer"
          onClick={handleDelete}
        >
          <Trash />
        </Button>
      </div>
    </Card>
  );
}
