import { execAsync } from "astal";

/**
 * Class to handle power management
 */
export default class PowerHandler {
  static instance: PowerHandler;

  /**
   * Contains the commands executed for each option
   */
  options = {
    supend: "loginctl lock-session && systemctl suspend",
    logout: "hyprctl dispatch exit 0",
    reboot: "systemctl reboot",
    shutdown: "systemctl poweroff",
  };

  /**
   * @returns the default instance of this class
   */
  static get_default() {
    if (!this.instance) this.instance = new PowerHandler();
    return this.instance;
  }

  private executeCommand(option: string) {
    execAsync(["bash", "-c", option]);
  }

  suspend() {
    this.executeCommand(this.options.supend);
  }

  logout() {
    this.executeCommand(this.options.logout);
  }

  reboot() {
    this.executeCommand(this.options.reboot);
  }

  shutdown() {
    this.executeCommand(this.options.shutdown);
  }
}
