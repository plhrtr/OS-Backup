import Command, { commandPriority } from "./Command";
import Apps from "gi://AstalApps";
import { MAX_ITEMS } from "../CommandPrompt";
import { CommandPromptItemProps } from "../CommandPromptItem";

export default class AppLauncher implements Command {
  apps = new Apps.Apps();

  getPriority(): commandPriority {
    return commandPriority.HIGH;
  }

  parseInput(input: string): CommandPromptItemProps[] {
    this.apps = new Apps.Apps();

    const list = this.apps.fuzzy_query(input).slice(0, MAX_ITEMS);
    const commandPromptItems: CommandPromptItemProps[] = [];
    list.forEach((app) => {
      commandPromptItems.push({
        execute: () => app.launch(),
        iconName: app.iconName,
        value: app.name,
      } as CommandPromptItemProps);
    });

    return commandPromptItems;
  }
}
