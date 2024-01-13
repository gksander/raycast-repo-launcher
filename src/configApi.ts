import { useCachedState } from "@raycast/utils";

const CONFIG_KEYS = {
  PROJECTS_ROOTS: "PROJECTS_ROOTS",
} as const;

export const useProjectsRoots = () => useCachedState<string[]>(CONFIG_KEYS.PROJECTS_ROOTS, [])[0];

export const useAddProjectsRoot = () => {
  const [, setProjectsRoots] = useCachedState<string[]>(CONFIG_KEYS.PROJECTS_ROOTS, []);

  return (dir: string) => {
    setProjectsRoots((prev) => [...new Set([...prev, dir])]);
  };
};

export const useRemoveProjectsRoot = () => {
  const [, setProjectsRoots] = useCachedState<string[]>(CONFIG_KEYS.PROJECTS_ROOTS, []);

  return (dir: string) => {
    setProjectsRoots((prev) => prev.filter((p) => p !== dir));
  };
};
