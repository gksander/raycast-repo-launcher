import { Action, ActionPanel, Icon, List, useNavigation } from "@raycast/api";
import { NewProjectsRoot } from "./NewProjectsRoot";
import {
  useLaunchCommands,
  useMoveLaunchCommand,
  useProjectsRoots,
  useRemoveLaunchCommand,
  useRemoveProjectsRoot,
} from "../configApi";
import { NewLaunchCommand } from "./NewLaunchCommand";

export function SettingsView() {
  const navigation = useNavigation();

  const projectsRoots = useProjectsRoots();
  const removeProjectsRoot = useRemoveProjectsRoot();

  const launchCommands = useLaunchCommands();
  const removeLaunchCommand = useRemoveLaunchCommand();
  const moveLaunchCommand = useMoveLaunchCommand();

  return (
    <List>
      <List.Section title="Projects Roots">
        {[
          projectsRoots.map((dir) => (
            <List.Item
              key={dir}
              title={dir}
              icon={Icon.Folder}
              actions={
                <ActionPanel>
                  <Action.ShowInFinder title="Show in Finder" path={dir} />
                  <Action title="Remove Projects Root" onAction={() => removeProjectsRoot(dir)} />
                </ActionPanel>
              }
            />
          )),
        ]}

        <List.Item
          title="New projects root"
          icon={{ source: Icon.PlusCircle, tintColor: "raycast-green" }}
          actions={
            <ActionPanel>
              <Action
                title="New Projects Root"
                onAction={() => {
                  navigation.push(<NewProjectsRoot />);
                }}
              />
            </ActionPanel>
          }
        />
      </List.Section>

      <List.Section title="Commands">
        {launchCommands.map((cmd) => (
          <List.Item
            title={cmd.title}
            key={cmd.title}
            actions={
              <ActionPanel>
                <Action title="Move to Top" onAction={() => moveLaunchCommand(cmd, "top")} />
                <Action
                  title="Move Up"
                  shortcut={{ modifiers: ["shift"], key: "arrowUp" }}
                  onAction={() => moveLaunchCommand(cmd, "up")}
                />
                <Action
                  title="Move Down"
                  shortcut={{ modifiers: ["shift"], key: "arrowDown" }}
                  onAction={() => moveLaunchCommand(cmd, "down")}
                />
                <Action title="Move to Bottom" onAction={() => moveLaunchCommand(cmd, "bottom")} />
                <Action title={`Remove ${cmd.title}`} onAction={() => removeLaunchCommand(cmd)} />
              </ActionPanel>
            }
          />
        ))}

        <List.Item
          title="New launch command"
          icon={{ source: Icon.PlusCircle, tintColor: "raycast-green" }}
          actions={
            <ActionPanel>
              <Action title="New Launch Command" onAction={() => navigation.push(<NewLaunchCommand />)} />
            </ActionPanel>
          }
        />
      </List.Section>
    </List>
  );
}
