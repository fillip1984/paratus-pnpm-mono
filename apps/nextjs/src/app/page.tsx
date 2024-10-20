"use client";

import { useState } from "react";
import { format } from "date-fns";
import { AnimatePresence } from "framer-motion";
import { BsPlus } from "react-icons/bs";

import type { RouterOutputs } from "@acme/api";

import { api } from "~/trpc/react";
import TaskModal from "./_components/TaskModal";

// type Todos = RouterOutputs["todo"]["readAll"];
type Todo = RouterOutputs["todo"]["readAll"][number];

export default function Timeline() {
  const { data: todos } = api.todo.readAll.useQuery();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>();
  const toggleTaskModal = () => {
    if (isTaskModalOpen) {
      // clear out the todo that was being edited
      setEditingTodo(undefined);
    }
    setIsTaskModalOpen((prev) => !prev);
  };

  const handleEditTaskModal = (todo: Todo) => {
    setEditingTodo(todo);
    setIsTaskModalOpen((prev) => !prev);
  };

  return (
    <main className="relative h-full w-full overflow-hidden bg-black text-white">
      <div id="heading" className="mt-4 flex flex-col gap-2 p-2">
        <h3 className="flex">Today</h3>
        <span className="text-sm text-white/60">
          {todos?.length ?? 0} tasks
        </span>
      </div>

      <div className="flex h-full justify-center overflow-y-auto p-4">
        <div className="flex w-full max-w-[800px] flex-col">
          {todos?.map((todo) => (
            <TodoRow
              key={todo.id}
              todo={todo}
              handleEditTaskModal={handleEditTaskModal}
            />
          ))}
          <div className="pb-48"></div>
        </div>
      </div>

      <button
        type="button"
        onClick={toggleTaskModal}
        className="absolute bottom-4 right-4 z-[991] flex h-12 w-12 items-center justify-center rounded-full bg-primary">
        <BsPlus
          className={`text-6xl transition ${isTaskModalOpen ? "rotate-45" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isTaskModalOpen && (
          <TaskModal
            toggleTaskModal={toggleTaskModal}
            editingTodo={editingTodo}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

const TodoRow = ({
  todo,
  handleEditTaskModal,
}: {
  todo: Todo;
  handleEditTaskModal: (todo: Todo) => void;
}) => {
  return (
    <div
      onClick={() => handleEditTaskModal(todo)}
      className="flex cursor-pointer gap-2 border-t border-t-white/50 py-2">
      <input type="checkbox" className="mt-1 rounded-full border-2 bg-black" />
      <div className="flex w-full justify-between">
        <div className="flex flex-col">
          <span className="font-bold">{todo.title}</span>
          <span className="text-xs text-white/60">{todo.description}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-danger">
              {todo.dueDate ? format(todo.dueDate, "yyyy-MM-dd hh:mm a") : ""}
            </span>
            <span className="text-xs text-danger">{todo.priority}</span>
          </div>
        </div>
        <div className="flex items-end">
          <span className="text-xs">Inbox</span>
        </div>
      </div>
    </div>
  );
};
