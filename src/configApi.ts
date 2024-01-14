import { useCachedState } from "@raycast/utils";

const CONFIG_KEYS = {
  PROJECTS_ROOTS: "PROJECTS_ROOTS",
  LAUNCH_COMMANDS: "LAUNCH_COMMANDS",
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

type LaunchCommand = {
  title: string;
  command: string;
};

export const useLaunchCommands = () => useCachedState<LaunchCommand[]>(CONFIG_KEYS.LAUNCH_COMMANDS, [])[0];

export const useAddLaunchCommand = () => {
  const [, setLaunchCommands] = useCachedState<LaunchCommand[]>(CONFIG_KEYS.LAUNCH_COMMANDS, []);

  // TODO: uniqBy bundleId
  return (cmd: LaunchCommand) => {
    setLaunchCommands((prev) => [...prev, cmd]);
  };
};

export const useRemoveLaunchCommand = () => {
  const [, setLaunchCommands] = useCachedState<LaunchCommand[]>(CONFIG_KEYS.LAUNCH_COMMANDS, []);

  return (commandToDelete: LaunchCommand) => {
    setLaunchCommands((prev) => prev.filter((cmd) => cmd.command !== commandToDelete.command));
  };
};

export const useMoveLaunchCommand = () => {
  const [, setLaunchCommands] = useCachedState<LaunchCommand[]>(CONFIG_KEYS.LAUNCH_COMMANDS, []);

  return (cmd: LaunchCommand, direction: "up" | "down" | "top" | "bottom") => {
    setLaunchCommands((prev) => {
      const index = prev.findIndex((c) => c.command === cmd.command);
      const newIndex =
        direction === "up" ? index - 1 : direction === "down" ? index + 1 : direction === "top" ? 0 : prev.length - 1;
      const newCommands = [...prev];
      newCommands.splice(index, 1);
      newCommands.splice(newIndex, 0, cmd);
      return newCommands;
    });
  };
};
