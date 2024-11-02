"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";

export default function TaskDetails({
  params,
}: {
  params: { id: number | "new" };
}) {
  const router = useRouter();

  const id = params.id;
  const isNew = id === "new";
  const { data: task } = api.task.readOne.useQuery(
    {
      id: parseInt(id as string, 10),
    },
    { enabled: !!id && !isNew, refetchOnWindowFocus: false },
  );

  const [text, setText] = useState("");
  const [complete, setComplete] = useState(false);
  const [timer, setTimer] = useState("");

  useEffect(() => {
    if (task) {
      setText(task.text);
      setComplete(task.complete);
      setTimer(
        isNaN(task.timer) || task.timer === 0 ? "" : task.timer.toString(),
      );
    }
  }, [task]);

  const utils = api.useUtils();
  const { mutate: createTask } = api.task.create.useMutation({
    onSuccess: async () => {
      await utils.task.invalidate();
      void router.push("/");
    },
  });
  const { mutate: updateTask } = api.task.update.useMutation({
    onSuccess: async () => {
      await utils.task.invalidate();
      void router.push("/");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    let newTimer = parseInt(timer, 10);
    if (isNaN(newTimer)) {
      newTimer = 0;
    }
    if (isNew) {
      createTask({ text, complete, timer: newTimer });
    } else {
      // TASK: There seems to be a bug that is forcing me to cast id to string then number to ensure it transmits as number
      updateTask({
        id: parseInt(id.toString(), 10),
        text,
        complete,
        timer: newTimer,
      });
    }
  };

  return (
    <main className="flex h-full w-full bg-black p-4">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex w-full flex-col gap-4 rounded-lg bg-white/10 p-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Task details..."
        />
        <label className="flex items-center gap-2 text-white">
          <input
            type="checkbox"
            checked={complete}
            onChange={() => setComplete((prev) => !prev)}
            className="rounded-md"
          />{" "}
          Complete
        </label>
        <input
          type="number"
          value={timer}
          onChange={(e) => setTimer(e.target.value)}
          placeholder="How many minutes does this task take?"
        />
        <div className="flex gap-2">
          <Link
            href="/"
            className="rounded-lg border border-white px-4 py-2 text-white">
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-lg bg-white px-4 py-2 text-xl text-black"
            disabled={!text}>
            Save
          </button>
        </div>
      </form>
    </main>
  );
}
