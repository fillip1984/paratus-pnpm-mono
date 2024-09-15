"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BsPlus } from "react-icons/bs";

export default function Timeline() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    console.log("togglin");
    setIsOpen((prev) => !prev);
  };

  return (
    <main className="relative h-full w-full overflow-hidden bg-black text-white">
      <div id="heading" className="flex items-center gap-2 p-2">
        <h3>Timeline</h3>
        {isOpen}
      </div>

      <button
        type="button"
        onClick={toggleModal}
        className="absolute bottom-4 right-4 z-[991] flex h-12 w-12 items-center justify-center rounded-full bg-danger">
        <BsPlus
          className={`text-6xl transition ${isOpen ? "rotate-45" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleModal}
              className="overlay fixed inset-0 z-[980] bg-black/50"></motion.div>
            <div className="modal-container z-[990] flex h-full w-full items-start justify-center pt-20">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="modal z-[991] min-w-[75%] rounded bg-primary p-2">
                asdf
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
