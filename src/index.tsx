import { SettingsView } from "./Settings/SettingsView";
import { readdir } from "node:fs/promises";
import { useProjectsRoots } from "./configApi";
import { useCachedPromise } from "@raycast/utils";
import { List } from "@raycast/api";

export default function Command() {
  const projectsRoots = useProjectsRoots();

  const { isLoading, data } = useCachedPromise(
    async () => {
      const proms = projectsRoots.map((dir) =>
        readdir(dir, { withFileTypes: true }).then((els) =>
          els
            .filter((dirent) => dirent.isDirectory())
            .map<ProjectItem>((dirent) => ({
              name: dirent.name,
              parentDir: dir,
            })),
        ),
      );

      return Promise.all(proms).then((res) => res.flat());
    },
    [],
    {
      keepPreviousData: true,
      initialData: [],
    },
  );

  return (
    <List isLoading={isLoading}>
      {data.map((item) => (
        <List.Item
          title={item.name}
          subtitle={item.parentDir}
          key={`${item.parentDir}/${item.name}`}
          // actions={<ProjectActions item={item} />}
        />
      ))}
    </List>
  );

  return <SettingsView />;
}

type ProjectItem = {
  name: string;
  parentDir: string;
};
