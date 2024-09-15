"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { BsPlusLg, BsTrash } from "react-icons/bs";
import { RiTimerLine } from "react-icons/ri";

import { api } from "~/trpc/react";

export default function Home() {
  const { data: todos } = api.todo.readAll.useQuery();

  const utils = api.useUtils();
  const queryClient = useQueryClient();
  const { mutate: toggleTodo } = api.todo.update.useMutation({
    // https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates
    onMutate: async (newTodo) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await utils.todo.readAll.cancel();

      // Snapshot the previous value
      const previousTodos = utils.todo.readAll.getData();

      // Optimistically update to the new value
      queryClient.setQueryData(["todos", newTodo.id], newTodo);

      // Return a context with the previous and new todo
      return { previousTodos, newTodo };
    },
    // If the mutation fails, use the context we returned above
    onError: (err, newTodo, context) => {
      utils.todo.readAll.setData(undefined, context?.previousTodos);
    },
    // Always refetch after error or success:
    onSettled: () => {
      void utils.todo.readAll.invalidate();
    },
  });

  const { mutate: deleteTodos } = api.todo.delete.useMutation({
    onSettled: () => utils.todo.invalidate(),
  });

  const handleToggleTodo = (todo: {
    id: number;
    text: string;
    complete: boolean;
    timer: number;
  }) => {
    // console.log("togglin " + todo.id);
    toggleTodo({ ...todo, complete: !todo.complete });
  };

  const handleDeleteComplete = () => {
    const todosToDelete = todos?.filter((t) => t.complete).map((t) => t.id);
    deleteTodos(todosToDelete ?? []);
  };

  return (
    <main className="h-full w-full overflow-hidden bg-black text-white">
      <div id="heading" className="flex items-center gap-2 p-2">
        <h3>Todos</h3>
        <Link href="/todos/new" className="rounded-lg bg-white/30 p-2">
          <BsPlusLg className="text-2xl" />
        </Link>
      </div>

      <div id="actions" className="flex justify-end px-2">
        <button
          type="button"
          onClick={handleDeleteComplete}
          className="flex items-center gap-2 rounded-lg border p-2 text-danger"
          disabled={
            todos?.filter((t) => t.complete).length === 0 ? true : false
          }>
          <BsTrash className="text-xl" /> Completed
        </button>
      </div>

      <div className="h-full overflow-auto pb-80">
        <div className="flex flex-col gap-2 p-4">
          {todos?.length === 0 && (
            <div>
              There are no todos... you can add a todo with the plus button
              above
            </div>
          )}
          {todos?.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-2 rounded-lg bg-white/30 p-2">
              <input
                type="checkbox"
                checked={todo.complete}
                onChange={() => handleToggleTodo(todo)}
                className="rounded-md"
              />
              <Link href={`/todos/${todo.id}`} className="flex w-full">
                <span
                  className={`text-white ${todo.complete ? "line-through" : ""}`}>
                  {todo.text}
                </span>
                {todo.timer > 0 && (
                  <div className="ml-auto flex items-center gap-1">
                    <RiTimerLine className="text-2xl" />
                    <span>{todo.timer} minutes</span>
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
