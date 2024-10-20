import { useEffect, useState } from "react";
import {
  addDays,
  format,
  formatISO,
  isValid,
  parse,
  parseISO,
  startOfToday,
  startOfTomorrow,
  startOfWeek,
} from "date-fns";
import { motion } from "framer-motion";
import Calendar from "react-calendar";
import { BsThreeDots } from "react-icons/bs";
import TextareaAutosize from "react-textarea-autosize";
import { Popover } from "react-tiny-popover";
import Toggle from "react-toggle";

import "react-toggle/style.css";

import type { RouterOutputs } from "@acme/api";

import { api } from "~/trpc/react";

export default function TaskModal({
  toggleTaskModal,
  editingTodo,
}: {
  toggleTaskModal: () => void;
  editingTodo: RouterOutputs["todo"]["readAll"][number] | undefined;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isDueDateOpen, setIsDueDateOpen] = useState(false);
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [priority, setPriority] = useState("");
  const [isAdditionalOptionsOpen, setIsAdditionalOptionsOpen] = useState(false);
  const [isAtSpecificTime, setIsAtSpecificTime] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title);
      setDescription(editingTodo.description ?? "");
      console.log({ dd: editingTodo.dueDate });
      setDueDate(parseISO(editingTodo.dueDate, "yyyy-MM-dd"));
      if (editingTodo.priority) {
        setPriority(editingTodo.priority);
      }
    }
  }, [editingTodo]);

  const handleDueDate = (
    newDueDate: Date | undefined,
    newDueTime: string | undefined,
  ) => {
    if (newDueDate && newDueTime) {
      const parsedTime = parse(newDueTime, "hh:mm a", newDueDate);
      if (isValid(parsedTime)) {
        setDueDate(parsedTime);
        setTime(newDueTime);
      }
    } else {
      setDueDate(newDueDate);
      setTime("");
    }
  };

  const handlePriority = (priority: string) => {
    setPriority(priority);
    setIsPriorityOpen(false);
  };

  const apiUtils = api.useUtils();
  const { mutate: addTask } = api.todo.create.useMutation({
    onSuccess: () => {
      void apiUtils.invalidate();
      toggleTaskModal();
    },
  });
  const handleAddOrUpdateTask = () => {
    const isoDueDate = dueDate ? formatISO(dueDate) : null;
    if (editingTodo) {
      updateTask({
        id: editingTodo.id,
        title,
        description,
        dueDate: isoDueDate,
        priority,
        completedAt: null,
      });
    } else {
      addTask({ title, description, dueDate: isoDueDate, priority });
    }
  };

  const { mutate: updateTask } = api.todo.update.useMutation({
    onSuccess: () => {
      void apiUtils.invalidate();
      toggleTaskModal();
    },
  });

  const { mutate: removeTask } = api.todo.delete.useMutation({
    onSuccess: () => {
      void apiUtils.invalidate();
      toggleTaskModal();
    },
  });
  const handleRemoveTask = () => {
    if (!editingTodo) {
      throw Error("Unable to delete todo, was not given a todo to delete");
    }
    removeTask([editingTodo.id]);
  };

  return (
    <div className="fixed inset-0">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={toggleTaskModal}
        className="overlay fixed inset-0 z-[980] bg-black/50"></motion.div>
      <div className="modal-container z-[990] flex h-full w-full items-start justify-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="modal z-[991] min-w-[75%] rounded border border-white/50 bg-black shadow-lg shadow-black">
          <div className="p-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-0 bg-black p-0 font-bold placeholder:font-bold focus:border-0 focus:ring-0"
              placeholder="Todo title..."
            />
            <TextareaAutosize
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none border-0 bg-black p-0 text-xs text-white placeholder:text-sm focus:border-0 focus:ring-0"
              placeholder="Description..."
            />
            <div className="relative flex gap-2">
              <Popover
                isOpen={isDueDateOpen}
                positions={["bottom", "right"]}
                padding={1}
                onClickOutside={(e) => {
                  e.stopPropagation();
                  setIsDueDateOpen(false);
                }}
                content={() => (
                  <div className="max-w-[300px] rounded border-white/30 bg-gray p-1">
                    <div className="text-xs text-white">
                      <div className="flex flex-col items-start gap-1">
                        <button
                          onClick={() => handleDueDate(startOfToday(), time)}
                          className="w-full text-left hover:bg-primary">
                          Today
                        </button>
                        <button
                          onClick={() => handleDueDate(startOfTomorrow(), time)}
                          className="w-full text-left hover:bg-primary">
                          Tomorrow
                        </button>
                        <button
                          onClick={() =>
                            handleDueDate(startOfWeek(startOfToday()), time)
                          }
                          className="w-full text-left hover:bg-primary">
                          This Week
                        </button>
                        <button
                          onClick={() =>
                            handleDueDate(
                              startOfWeek(addDays(startOfToday(), 7)),
                              time,
                            )
                          }
                          className="w-full text-left hover:bg-primary">
                          Next Week
                        </button>
                        <button
                          onClick={() => handleDueDate(undefined, undefined)}
                          className="w-full text-left hover:bg-primary">
                          No Date
                        </button>
                      </div>
                    </div>
                    <div className="mt-1 border-t border-t-white/30 text-xs text-white">
                      <Calendar onClickDay={(v) => handleDueDate(v, time)} />
                    </div>
                    <div className="mt-1 border-t border-t-white/30 py-2 text-xs text-white">
                      {/* Time, duration, time zone: Floating or Louisville */}
                      <label className="flex items-center gap-2">
                        <Toggle
                          defaultChecked={isAtSpecificTime}
                          onChange={() => {
                            handleDueDate(dueDate, undefined);
                            setIsAtSpecificTime((prev) => !prev);
                          }}
                        />
                        <span>At specific time</span>
                      </label>
                      {isAtSpecificTime && (
                        <input
                          type="string"
                          value={time}
                          onChange={(e) => {
                            setTime(e.target.value);
                            handleDueDate(dueDate, e.target.value);
                          }}
                          className="my-2 rounded p-2 text-black"
                          placeholder="12:00 AM"
                        />
                      )}
                    </div>
                  </div>
                )}>
                <button
                  onClick={() => setIsDueDateOpen((prev) => !prev)}
                  className="relative rounded border border-white/50 px-1">
                  {dueDate !== undefined
                    ? isAtSpecificTime
                      ? format(dueDate, "yyyy-MM-dd hh:mm a")
                      : format(dueDate, "yyyy-MM-dd")
                    : "Due Date"}
                </button>
              </Popover>
              <Popover
                isOpen={isPriorityOpen}
                positions={["bottom", "right"]}
                padding={1}
                onClickOutside={(e) => {
                  e.stopPropagation();
                  setIsPriorityOpen(false);
                }}
                content={() => (
                  <div className="flex max-w-[300px] flex-col rounded border-white/30 bg-gray p-1 text-white">
                    <button
                      onClick={() => handlePriority("Urgent & Important")}
                      className="w-full text-left hover:bg-primary">
                      Urgent & Important
                    </button>
                    <button
                      onClick={() => handlePriority("Urgent")}
                      className="w-full text-left hover:bg-primary">
                      Urgent
                    </button>
                    <button
                      onClick={() => handlePriority("Important")}
                      className="w-full text-left hover:bg-primary">
                      Important
                    </button>
                    <button
                      onClick={() => handlePriority("")}
                      className="w-full text-left hover:bg-primary">
                      Neither
                    </button>
                  </div>
                )}>
                <button
                  onClick={() => setIsPriorityOpen((prev) => !prev)}
                  className="rounded border border-white/50 px-1">
                  {priority ? priority : "Priority"}
                </button>
              </Popover>
              {editingTodo && (
                <Popover
                  isOpen={isAdditionalOptionsOpen}
                  positions={["bottom", "right"]}
                  padding={1}
                  onClickOutside={(e) => {
                    e.stopPropagation();
                    setIsAdditionalOptionsOpen(false);
                  }}
                  content={() => (
                    <div className="flex max-w-[300px] flex-col rounded border-white/30 bg-gray p-1 text-white">
                      <button
                        onClick={handleRemoveTask}
                        className="text-danger">
                        Delete
                      </button>
                    </div>
                  )}>
                  <button
                    onClick={() => setIsAdditionalOptionsOpen((prev) => !prev)}
                    className="flex items-center justify-center rounded border border-white/50 px-1">
                    <BsThreeDots />
                  </button>
                </Popover>
              )}
            </div>
          </div>
          <div className="border-t border-white/50">
            <div className="flex items-center justify-between p-3">
              <span>Inbox</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={toggleTaskModal}
                  className="rounded bg-secondary px-2 py-2 text-xs font-semibold">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddOrUpdateTask}
                  className="rounded bg-primary px-2 text-xs font-bold transition-colors ease-in"
                  disabled={!title}>
                  Save task
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
