"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { BsPlus } from "react-icons/bs";

import TaskModal from "./_components/TaskModal";

export default function Timeline() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const toggleTaskModal = () => {
    setIsTaskModalOpen((prev) => !prev);
  };

  return (
    <main className="relative h-full w-full overflow-hidden bg-black text-white">
      <div id="heading" className="flex items-center gap-2 p-2">
        <h3>Timeline</h3>
      </div>

      <button
        type="button"
        onClick={toggleTaskModal}
        className="absolute bottom-4 right-4 z-[991] flex h-12 w-12 items-center justify-center rounded-full bg-danger">
        <BsPlus
          className={`text-6xl transition ${isTaskModalOpen ? "rotate-45" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isTaskModalOpen && <TaskModal toggleTaskModal={toggleTaskModal} />}
      </AnimatePresence>
    </main>
  );
}
