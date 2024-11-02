"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { BsPlusLg, BsTrash } from "react-icons/bs";
import { RiTimerLine } from "react-icons/ri";

import { api } from "~/trpc/react";

export default function Home() {
  const { data: tasks } = api.task.readAll.useQuery();

  const utils = api.useUtils();
  const queryClient = useQueryClient();
  const { mutate: toggleTask } = api.task.update.useMutation({
    // https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates
    onMutate: async (newTask) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await utils.task.readAll.cancel();

      // Snapshot the previous value
      const previousTasks = utils.task.readAll.getData();

      // Optimistically update to the new value
      queryClient.setQueryData(["tasks", newTask.id], newTask);

      // Return a context with the previous and new task
      return { previousTasks, newTask };
    },
    // If the mutation fails, use the context we returned above
    onError: (err, newTask, context) => {
      utils.task.readAll.setData(undefined, context?.previousTasks);
    },
    // Always refetch after error or success:
    onSettled: () => {
      void utils.task.readAll.invalidate();
    },
  });

  const { mutate: deleteTasks } = api.task.delete.useMutation({
    onSettled: () => utils.task.invalidate(),
  });

  const handleToggleTask = (task: {
    id: number;
    text: string;
    complete: boolean;
    timer: number;
  }) => {
    // console.log("togglin " + task.id);
    toggleTask({ ...task, complete: !task.complete });
  };

  const handleDeleteComplete = () => {
    const tasksToDelete = tasks?.filter((t) => t.complete).map((t) => t.id);
    deleteTasks(tasksToDelete ?? []);
  };

  return (
    <main className="h-full w-full overflow-hidden bg-black text-white">
      <div id="heading" className="flex items-center gap-2 p-2">
        <h3>Tasks</h3>
        <Link href="/tasks/new" className="rounded-lg bg-white/30 p-2">
          <BsPlusLg className="text-2xl" />
        </Link>
      </div>

      <div id="actions" className="flex justify-end px-2">
        <button
          type="button"
          onClick={handleDeleteComplete}
          className="flex items-center gap-2 rounded-lg border p-2 text-danger"
          disabled={
            tasks?.filter((t) => t.complete).length === 0 ? true : false
          }>
          <BsTrash className="text-xl" /> Completed
        </button>
      </div>

      <div className="h-full overflow-auto pb-80">
        <div className="flex flex-col gap-2 p-4">
          {tasks?.length === 0 && (
            <div>
              There are no tasks... you can add a task with the plus button
              above
            </div>
          )}
          {tasks?.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-2 rounded-lg bg-white/30 p-2">
              <input
                type="checkbox"
                checked={task.complete}
                onChange={() => handleToggleTask(task)}
                className="rounded-md"
              />
              <Link href={`/tasks/${task.id}`} className="flex w-full">
                <span
                  className={`text-white ${task.complete ? "line-through" : ""}`}>
                  {task.text}
                </span>
                {task.timer > 0 && (
                  <div className="ml-auto flex items-center gap-1">
                    <RiTimerLine className="text-2xl" />
                    <span>{task.timer} minutes</span>
                  </div>
                )}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
