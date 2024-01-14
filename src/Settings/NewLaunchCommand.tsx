import { Action, ActionPanel, Form, getApplications, useNavigation } from "@raycast/api";
import { FormValidation, useCachedPromise, useForm } from "@raycast/utils";
import { useAddLaunchCommand } from "../configApi";

export function NewLaunchCommand() {
  const navigation = useNavigation();

  const { isLoading, data } = useCachedPromise(getApplications, [], {
    keepPreviousData: true,
    initialData: [],
  });
  const addLaunchCommand = useAddLaunchCommand();

  const { handleSubmit, itemProps, setValue, setValidationError } = useForm<FormValues>({
    onSubmit: ({ command, title }) => {
      addLaunchCommand({ title, command });
      navigation.pop();
    },
    validation: {
      title: FormValidation.Required,
      command: FormValidation.Required,
    },
  });

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description title="New Launch Command" text="..." />

      <Form.Dropdown
        id="bundleId"
        title="Application"
        onChange={(value) => {
          setValue("command", value ? `bundleId:${value}` : "");
          setValue("title", value ? data.find((app) => app.bundleId === value)?.name ?? "" : "");
          setValidationError("command", null);
        }}
      >
        <Form.DropdownItem key="none" title="None" value="" />
        {data.map((app) => (
          <Form.DropdownItem key={app.bundleId} title={app.name} value={app.bundleId ?? ""} />
        ))}
      </Form.Dropdown>

      <Form.Separator />

      <Form.TextField title="Title" placeholder="PyCharm" {...itemProps.title} />
      <Form.TextField title="Raw Command" placeholder="pycharm ." {...itemProps.command} />
    </Form>
  );
}

type FormValues = {
  title: string;
  command: string;
};
