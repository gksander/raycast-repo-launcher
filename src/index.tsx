import * as React from "react";
import { readdir } from "node:fs/promises";
import { useLaunchCommands, useProjectsRoots } from "./configApi";
import { useCachedPromise } from "@raycast/utils";
import { Action, ActionPanel, List, open } from "@raycast/api";
import path from "node:path";
import { promisify } from "node:util";
import { exec as _exec } from "node:child_process";

const exec = promisify(_exec);

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
          actions={<ProjectActions item={item} />}
        />
      ))}
    </List>
  );
}

type ProjectItem = {
  name: string;
  parentDir: string;
};

function ProjectActions({ item }: { item: ProjectItem }) {
  const launchCommands = useLaunchCommands();
  const { data: repoUrl } = useCachedPromise(getRepoUrl, [getProjectDir(item)], {
    keepPreviousData: true,
    initialData: "",
  });

  const openInGitHubSite = (path: string) => open(`${repoUrl}${path}`);

  return (
    <ActionPanel title={item.name}>
      <ActionPanel.Section title="User Actions">
        {launchCommands.map((cmd) => (
          <Action
            title={`Open with ${cmd.title}`}
            key={cmd.title}
            onAction={() => {
              if (cmd.command.startsWith("bundleId:")) {
                open(getProjectDir(item), cmd.command.split("bundleId:")[1]);
                return;
              }

              exec(cmd.command, { cwd: getProjectDir(item) });
            }}
          />
        ))}
      </ActionPanel.Section>

      {repoUrl && (
        <ActionPanel.Section title="GitHub.com Actions">
          <Action title="Repo Site" onAction={() => openInGitHubSite("/")} />
          <Action title="Issues" onAction={() => openInGitHubSite("/issues")} />
          <Action title="Pull Requests" onAction={() => openInGitHubSite("/pulls")} />
          <Action title="GH Actions" onAction={() => openInGitHubSite("/actions")} />
          <Action title="Compare Branches" onAction={() => openInGitHubSite("/compare")} />
        </ActionPanel.Section>
      )}

      <ActionPanel.Section title="Mac Actions">
        <Action.ShowInFinder title="Show in Finder" path={getProjectDir(item)} />
        <Action.CopyToClipboard title="Copy Path to Clipboard" content={getProjectDir(item)} />
        <Action.OpenWith path={path.join(item.parentDir, item.name)} />
      </ActionPanel.Section>
    </ActionPanel>
  );
}

const getProjectDir = (item: ProjectItem) => path.join(item.parentDir, item.name);

async function getRepoUrl(dir: string) {
  try {
    const repoUrl = (await exec(`git config --get remote.origin.url`, { cwd: dir })).stdout.replace(/\n/g, "");

    let remoteHttpsUrl = "";
    if (repoUrl.startsWith("https")) {
      remoteHttpsUrl = repoUrl.replace(/\.git$/g, "");
    } else {
      const r = /^git@(.*):(.*)\/(.*)\.git$/;
      const match = repoUrl.match(r);
      if (match) {
        const [, base, org, repo] = match;

        if (base !== "github.com") return "";

        remoteHttpsUrl = `https://${base}/${org}/${repo}`;
      }
    }

    return remoteHttpsUrl;
  } catch {
    return "";
  }
}
