"use client";

import { useState } from "react";
import { BsPlusLg } from "react-icons/bs";

import { api } from "~/trpc/react";

export default function Projects() {
  const { data: projects } = api.project.readAll.useQuery();
  const utils = api.useUtils();
  const { mutate: createProject } = api.project.create.useMutation({
    onSuccess: () => {
      setNewProject("");
      void utils.project.invalidate();
    },
  });

  const [newProject, setNewProject] = useState("");

  const handleAddProject = () => {
    createProject({ title: newProject });
  };

  return (
    <main className="h-full w-full overflow-hidden bg-black text-white">
      <div id="heading" className="flex items-center gap-2 p-2">
        <h3>Projects</h3>
      </div>

      <div className="h-full overflow-auto px-4 pb-80">
        <div className="flex flex-col gap-2">
          {projects?.length === 0 && (
            <div className="rounded bg-primary p-2">
              There are no projects...
            </div>
          )}
          {projects?.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-2 rounded-lg bg-white/30 p-2">
              <span>{project.title}</span>
            </div>
          ))}

          <div className="flex w-full rounded bg-primary p-2">
            <input
              type="text"
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              className="rounded-r-none bg-black text-white"
              placeholder="Add a new project..."
            />
            <button
              onClick={handleAddProject}
              className="bg-accent rounded-r px-2">
              <BsPlusLg className="text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
