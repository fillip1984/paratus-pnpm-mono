"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { BsPlus } from "react-icons/bs";
import { FaInbox } from "react-icons/fa6";

import type { Project } from "~/trpc/types";
import { api } from "~/trpc/react";
import ProjectModal from "../_components/ProjectModal";
import { categoryIconLookup } from "../utils/IconHelper";

export default function Projects() {
  const { data: projects } = api.project.readAll.useQuery();
  const { data: inboxCount } = api.task.inboxCount.useQuery();

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const toggleProjectModal = (project: Project | undefined) => {
    setEditingProject(project);
    setIsProjectModalOpen((prev) => !prev);
  };

  return (
    <main className="flex h-full w-full flex-col items-center overflow-hidden bg-background text-white">
      <div id="heading" className="flex items-center gap-2 p-2">
        <h3>Projects</h3>
      </div>

      <div className="h-full w-full overflow-auto px-4 pb-12">
        <div className="flex flex-col gap-2">
          <div className="mx-auto flex w-full max-w-[400px] items-center gap-4 rounded-lg bg-white/30 p-2">
            <FaInbox className="text-3xl" />
            <span>Inbox</span>
            <span className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-foreground">
              {inboxCount}
            </span>
          </div>

          {projects?.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              toggleProjectModal={toggleProjectModal}
            />
          ))}

          <button
            type="button"
            onClick={() => toggleProjectModal(undefined)}
            className="mx-auto mt-4 flex w-full max-w-[400px] items-center justify-center rounded bg-primary">
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

const ProjectCard = ({
  project,
  toggleProjectModal,
}: {
  project: Project;
  toggleProjectModal: (project: Project) => void;
}) => {
  return (
    <button
      type="button"
      onClick={() => toggleProjectModal(project)}
      className="mx-auto flex w-full max-w-[400px] items-center gap-2 rounded-lg bg-white/30 p-2">
      <span className="text-3xl">{categoryIconLookup(project.category)}</span>
      <span>{project.title}</span>
      <span className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-foreground">
        {project._count.tasks}
      </span>
    </button>
  );
};
