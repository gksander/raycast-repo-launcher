import { Action, ActionPanel, Icon, List, useNavigation } from "@raycast/api";
import { NewProjectsRoot } from "./NewProjectsRoot";
import { useProjectsRoots, useRemoveProjectsRoot } from "../configApi";

export function SettingsView() {
  const navigation = useNavigation();
  const projectsRoots = useProjectsRoots();
  const removeProjectsRoot = useRemoveProjectsRoot();

  return (
    <List>
      <List.Section title="Projects Roots">
        {/* Existing roots */}
        {[
          projectsRoots.map((dir) => (
            <List.Item
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

        {/* New projects link */}
        <List.Item
          title="New projects root"
          icon={Icon.PlusCircle}
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
    </List>
  );
}
