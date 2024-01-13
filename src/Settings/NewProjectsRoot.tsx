import { Action, ActionPanel, Form, useNavigation } from "@raycast/api";
import { useAddProjectsRoot } from "../configApi";

export function NewProjectsRoot() {
  // const addProjectsRoot = useAddProjectsRoot();
  const navigation = useNavigation();
  const addProjectsRoot = useAddProjectsRoot();

  return (
    <Form
      navigationTitle="New Projects Root"
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Submit"
            onSubmit={async ({ dir: [dir] }: { dir: [string] }) => {
              addProjectsRoot(dir);
              navigation.pop();
            }}
          />
        </ActionPanel>
      }
    >
      <Form.Description
        title="Select a projects root"
        text="Select a directory to add to the list of projects roots."
      />
      <Form.FilePicker
        id="dir"
        title="Directory"
        allowMultipleSelection={false}
        canChooseDirectories={true}
        canChooseFiles={false}
      />
    </Form>
  );
}
