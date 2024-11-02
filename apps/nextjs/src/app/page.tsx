"use client";

import { useState } from "react";
import { format } from "date-fns";
import { AnimatePresence } from "framer-motion";
import { BsPlus } from "react-icons/bs";

import { api } from "~/trpc/react";
import TaskModal from "./_components/TaskModal";

export default function Timeline() {
  const { data: tasks } = api.task.readAll.useQuery();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const toggleTaskModal = () => {
    if (isTaskModalOpen) {
      // clear out the task that was being edited
      setEditingTask(undefined);
    }
    setIsTaskModalOpen((prev) => !prev);
  };

  const handleEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen((prev) => !prev);
  };

  return (
    <main className="relative h-full w-full overflow-hidden bg-background text-white">
      <div id="heading" className="mt-4 flex flex-col gap-2 p-2">
        <h3 className="flex">Today</h3>
        <span className="text-sm text-white/60">
          {tasks?.length ?? 0} tasks
        </span>
      </div>

      {/* <div className="flex flex-wrap gap-2 px-2 py-4">
        <div className="flex h-10 w-24 items-center justify-center rounded border border-white bg-primary">
          Primary
        </div>
        <div className="flex h-10 w-24 items-center justify-center rounded border border-white bg-secondary">
          Secondary
        </div>
        <div className="flex h-10 w-24 items-center justify-center rounded border border-white bg-background">
          Background
        </div>
        <div className="bg-foreground flex h-10 w-24 items-center justify-center rounded border border-white">
          Foreground
        </div>
        <div className="flex h-10 w-24 items-center justify-center rounded border border-white bg-black">
          Black
        </div>
        <div className="flex h-10 w-24 items-center justify-center rounded border border-black bg-white text-black">
          White
        </div>
        <div className="flex h-10 w-24 items-center justify-center rounded border border-white bg-gray">
          Gray
        </div>
        <div className="flex h-10 w-24 items-center justify-center rounded bg-danger text-black">
          Secondary
        </div>
        <div className="flex h-10 w-24 items-center justify-center rounded bg-warning text-black">
          Secondary
        </div>
        <div className="flex h-10 w-24 items-center justify-center rounded bg-success text-black">
          Secondary
        </div>
        <div className="flex h-10 w-24 items-center justify-center rounded bg-info text-black">
          Secondary
        </div>
      </div> */}

      <div className="flex h-full justify-center overflow-y-auto p-4">
        <div className="flex w-full max-w-[800px] flex-col">
          {tasks?.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
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
            editingTask={editingTask}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

const TaskRow = ({
  task,
  handleEditTaskModal,
}: {
  task: Task;
  handleEditTaskModal: (task: Task) => void;
}) => {
  return (
    <div
      onClick={() => handleEditTaskModal(task)}
      className="flex cursor-pointer gap-2 border-t border-t-white/50 py-2">
      <input type="checkbox" className="mt-1 rounded-full border-2" />
      <div className="flex w-full justify-between">
        <div className="flex flex-col">
          <span className="font-bold">{task.title}</span>
          <span className="text-xs text-white/60">{task.description}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-danger">
              {task.dueDate ? format(task.dueDate, "yyyy-MM-dd hh:mm a") : ""}
            </span>
            <span className="text-xs text-danger">{task.priority}</span>
          </div>
        </div>
        <div className="flex items-end">
          <span className="text-xs">
            {task.project?.title ? task.project.title : "Inbox"}
          </span>
        </div>
      </div>
    </div>
  );
};
