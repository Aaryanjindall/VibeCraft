import { useEffect } from "react";

export const useAutoSave = (
  files,
  currentProject,
  unsaved,
  handleSave
) => {
  useEffect(() => {
    if (!currentProject) return;
    if (!files) return;
    if (Object.keys(files).length === 0) return;
    if (!unsaved) return;

    const timer = setTimeout(() => {
      handleSave();
      console.log("auto saved after 5 sec");
    }, 5000);

    return () => clearTimeout(timer);
  }, [files, currentProject, unsaved, handleSave]);
};