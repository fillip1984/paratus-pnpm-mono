import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import TextareaAutosize from "react-textarea-autosize";
import { Popover } from "react-tiny-popover";

import type { Category, Project } from "~/trpc/types";
import { api } from "~/trpc/react";
import { categoryIconLookup } from "../utils/IconHelper";

export default function ProjectModal({
  toggleProjectModal,
  editingProject,
}: {
  toggleProjectModal: (project: Project | undefined) => void;
  editingProject: Project | undefined;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category | undefined>();
  const { data: categories } = api.project.readAllCategories.useQuery();

  const [isAdditionalOptionsOpen, setIsAdditionalOptionsOpen] = useState(false);
  const [isCategorySelectorOpen, setIsCategorySelectorOpen] = useState(false);

  const toggleCategorySelector = () => {
    setIsCategorySelectorOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!title || !categories) {
      setCategory(undefined);
    } else {
      const possible = categories.find((category) =>
        category.title.toLocaleLowerCase().includes(title.toLocaleLowerCase()),
      );

      if (possible) {
        setCategory(possible);
      }
    }
  }, [title, categories]);

  useEffect(() => {
    if (editingProject) {
      setTitle(editingProject.title);
      setDescription(editingProject.description ?? "");
      setCategory(editingProject.category);
    }
  }, [editingProject]);

  const apiUtils = api.useUtils();
  const { mutate: addProject } = api.project.create.useMutation({
    onSuccess: () => {
      void apiUtils.invalidate();
      toggleProjectModal(undefined);
    },
  });

  const { mutate: updateProject } = api.project.update.useMutation({
    onSuccess: () => {
      void apiUtils.invalidate();
      toggleProjectModal(undefined);
    },
  });

  const handleAddOrUpdate = () => {
    if (!category) {
      return;
    }

    if (editingProject) {
      updateProject({
        id: editingProject.id,
        title,
        description,
        category: category,
      });
    } else {
      addProject({
        title,
        description,
        category: category,
      });
    }
  };

  const { mutate: removeProject } = api.project.delete.useMutation({
    onSuccess: () => {
      void apiUtils.invalidate();
      toggleProjectModal(undefined);
    },
  });
  const handleRemoveProject = () => {
    if (!editingProject) {
      throw Error(
        "Unable to delete project, was not given a project to delete",
      );
    }
    removeProject([editingProject.id]);
  };

  return (
    <div className="fixed inset-0">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => toggleProjectModal(undefined)}
        className="overlay fixed inset-0 z-[980] bg-black/50"></motion.div>
      <div className="modal-container z-[990] flex h-full w-full items-start justify-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="modal z-[991] max-w-[800px] rounded border border-gray bg-black shadow-lg shadow-black">
          <div className="flex gap-2">
            <div className="flex flex-col items-center gap-2 border-r border-r-gray p-2">
              <Popover
                isOpen={isCategorySelectorOpen}
                positions={["bottom", "right"]}
                padding={11}
                onClickOutside={(e) => {
                  e.stopPropagation();
                  toggleCategorySelector();
                }}
                content={
                  <CategorySelector
                    categories={categories}
                    setCategory={setCategory}
                    toggleIsCategorySelector={toggleCategorySelector}
                  />
                }>
                {category ? (
                  <button onClick={toggleCategorySelector}>
                    <CategoryCard category={category} />
                  </button>
                ) : (
                  <button
                    onClick={toggleCategorySelector}
                    className="flex flex-col items-center justify-center rounded px-1">
                    Category
                    <BiSolidCategoryAlt className="text-3xl" />
                  </button>
                )}
              </Popover>
            </div>
            <div className="flex-1 p-2 px-1">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-0 bg-black p-0 font-bold placeholder:font-bold focus:border-0 focus:ring-0"
                placeholder="Project title..."
              />
              <TextareaAutosize
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full resize-none border-0 bg-black p-0 text-xs text-white placeholder:text-sm focus:border-0 focus:ring-0"
                placeholder="Description..."
              />
            </div>
          </div>
          <div className="border-t border-gray">
            <div className="flex items-center justify-end p-3">
              <div className="flex gap-2">
                {editingProject && (
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
                          onClick={handleRemoveProject}
                          className="text-danger">
                          Delete
                        </button>
                      </div>
                    )}>
                    <button
                      onClick={() =>
                        setIsAdditionalOptionsOpen((prev) => !prev)
                      }
                      className="flex items-center justify-center rounded border border-gray px-1">
                      <BsThreeDots />
                    </button>
                  </Popover>
                )}

                <button
                  type="button"
                  onClick={() => toggleProjectModal(undefined)}
                  className="rounded border border-primary px-2 py-2 text-xs font-semibold text-primary">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddOrUpdate}
                  className="rounded bg-primary px-2 text-xs font-bold text-black transition-colors ease-in"
                  disabled={!(title && category)}>
                  Save project
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const CategorySelector = ({
  categories,
  setCategory,
  toggleIsCategorySelector,
}: {
  categories: Category[] | undefined;
  setCategory: Dispatch<SetStateAction<Category | undefined>>;
  toggleIsCategorySelector: () => void;
}) => {
  return (
    <div className="grid grid-cols-3 gap-2 rounded border border-gray bg-black">
      {categories?.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => {
            setCategory(category);
            toggleIsCategorySelector();
          }}
          className="hover:bg-secondary">
          <CategoryCard category={category} />
        </button>
      ))}
    </div>
  );
};

const CategoryCard = ({ category }: { category: Category }) => {
  return (
    <div className="flex flex-col items-center gap-1 p-1 text-white">
      <span className="text-3xl">{categoryIconLookup(category)}</span>
      <span>{category.title}</span>
    </div>
  );
};
