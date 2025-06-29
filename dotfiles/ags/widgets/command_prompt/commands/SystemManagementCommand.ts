import { CommandPromptItemProps } from "../CommandPromptItem";
import SearchHandler from "../utils/SearchHandler";
import Command, { commandPriority } from "./Command";
import { execAsync } from "astal";

export default class SystemManagementCommand implements Command {
  private commands = [
    {
      name: "shutdown",
      execute: () => execAsync(["bash", "-c", "systemctl poweroff"]),
      iconName: "system-shutdown-symbolic",
      value: "Shutdown the computer",
    },
    {
      name: "reboot",
      execute: () => execAsync(["bash", "-c", "systemctl reboot"]),
      iconName: "system-reboot-symbolic",
      value: "Reboot the computer",
    },
    {
      name: "suspend",
      execute: () =>
        execAsync(["bash", "-c", "loginctl lock-session && systemctl suspend"]),
      iconName: "media-playback-pause-symbolic",
      value: "Suspend the computer",
    },
    {
      name: "lock",
      execute: () => execAsync(["bash", "-c", "loginctl lock-session"]),
      iconName: "system-lock-screen-symbolic",
      value: "Lock the computer",
    },
    {
      name: "logout",
      execute: () => execAsync(["bash", "-c", "hyprctl dispatch exit 0"]),
      iconName: "brisk_system-log-out-symbolic",
      value: "Logout from this session",
    },
  ];

  private searchHandler = new SearchHandler(
    [...this.commands].map((command) => command.name),
  );

  getPriority(): commandPriority {
    return commandPriority.MEDIUM;
  }

  parseInput(input: string): CommandPromptItemProps[] {
    const found_command_strings = this.searchHandler.search(input);
    const found_commands = [...this.commands].filter(
      (command) => found_command_strings.indexOf(command.name) !== -1,
    );

    return found_commands.map(
      (command) =>
        ({
          execute: command.execute,
          iconName: command.iconName,
          value: command.value,
        }) as CommandPromptItemProps,
    );
  }
}
