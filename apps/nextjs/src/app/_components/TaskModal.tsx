import { useState } from "react";
import { motion } from "framer-motion";
import { BsThreeDots } from "react-icons/bs";
import TextareaAutosize from "react-textarea-autosize";
import { Popover } from "react-tiny-popover";

import { api } from "~/trpc/react";

export default function TaskModal({
  toggleTaskModal,
}: {
  toggleTaskModal: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isDueDateOpen, setIsDueDateOpen] = useState(false);

  const [dueDate, setDueDate] = useState("");

  const toggleDueDateOpen = () => {
    setIsDueDateOpen((prev) => !prev);
  };

  const handleDueDate = (newDueDate: string) => {
    console.log(newDueDate);
    setDueDate(newDueDate);
  };

  const apiUtils = api.useUtils();
  const { mutate: addTask } = api.todo.create.useMutation({
    onSuccess: () => {
      void apiUtils.invalidate();
      toggleTaskModal();
    },
  });
  const handleAddTask = () => {
    addTask({ text: name, complete: false, timer: 0 });
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-0 bg-black p-0 font-bold placeholder:font-bold focus:border-0 focus:ring-0"
              placeholder="Todo name"
            />
            <TextareaAutosize
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none border-0 bg-black p-0 text-xs text-white placeholder:text-sm focus:border-0 focus:ring-0"
              placeholder="Description"
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
                  <div className="bg-primary">
                    <div className="max-w-[300px] border-white/30 bg-black p-1">
                      <input
                        type="text"
                        value={dueDate}
                        onChange={(e) => handleDueDate(e.target.value)}
                        placeholder="Type a due date"
                      />
                      <div className="mt-1 border-t border-t-white/30 text-xs text-white">
                        Text which recommends based on input, like tomorrow,
                        next weekend, no date ...or (shortcuts)...
                        <div className="flex flex-col">
                          <span>Icon</span>
                          <span>Icon</span>
                          <span>Icon</span>
                        </div>
                      </div>
                      <div className="mt-1 border-t border-t-white/30 text-xs text-white">
                        calendar compact with days of week, arrows and open
                        circle which goes back to today
                      </div>
                      <div className="mt-1 border-t border-t-white/30 text-xs text-white">
                        Time, duration, time zone: Floating or Louisville
                      </div>
                    </div>
                  </div>
                )}>
                <button
                  onClick={toggleDueDateOpen}
                  className="relative rounded border border-white/50 px-1">
                  Due Date
                </button>
              </Popover>
              <button className="rounded border border-white/50 px-1">
                Priority
              </button>
              <button className="rounded border border-white/50 px-1">
                Reminders
              </button>
              <button className="flex items-center justify-center rounded border border-white/50 px-1">
                <BsThreeDots />
              </button>
            </div>
          </div>
          <div className="border-t">
            <div className="flex items-center justify-between p-3">
              <span>Inbox</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={toggleTaskModal}
                  className="rounded bg-secondary p-1">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddTask}
                  className="rounded bg-primary p-1">
                  Add task
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
