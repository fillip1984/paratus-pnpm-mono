"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { BsPlus } from "react-icons/bs";
import { FaInbox } from "react-icons/fa6";

import type { RouterOutputs } from "@acme/api";

import { api } from "~/trpc/react";
import ProjectModal from "../_components/ProjectModal";

type Project = RouterOutputs["project"]["readAll"][number] | undefined;

export default function Projects() {
  const { data: projects } = api.project.readAll.useQuery();
  const { data: inboxCount } = api.todo.inboxCount.useQuery();

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const toggleProjectModal = (project: Project | undefined) => {
    setEditingProject(project);
    setIsProjectModalOpen((prev) => !prev);
  };

  return (
    <main className="h-full w-full overflow-hidden bg-black text-white">
      <div id="heading" className="flex items-center gap-2 p-2">
        <h3>Projects</h3>
      </div>

      <div className="h-full overflow-auto px-4 pb-80">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4 rounded-lg bg-white/30 p-2">
            <FaInbox className="text-3xl" />
            <span>Inbox</span>
            <span className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-foreground">
              {inboxCount}
            </span>
          </div>
          {projects?.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => toggleProjectModal(project)}
              className="flex items-center gap-2 rounded-lg bg-white/30 p-2">
              <span>{project.title}</span>
              <span className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-foreground">
                {project._count.Todo}
              </span>
            </button>
          ))}

          <button
            type="button"
            onClick={() => toggleProjectModal(undefined)}
            className="mt-4 flex w-full items-center justify-center rounded bg-primary">
            <BsPlus className="text-6xl" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isProjectModalOpen && (
          <ProjectModal
            toggleProjectModal={toggleProjectModal}
            editingProject={editingProject}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
