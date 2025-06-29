import { App, Gtk } from "astal/gtk4";
import PowerHandler from "../../../utils/power";

export default function () {
  const powerHandler = PowerHandler.get_default();

  return (
    <popover hasArrow={false} cssClasses={["powermenu"]}>
      <box orientation={Gtk.Orientation.VERTICAL} spacing={5}>
        <button onClicked={() => powerHandler.suspend()}>Suspend</button>
        <button onClicked={() => powerHandler.logout()}>Logout</button>
        <button onClicked={() => powerHandler.reboot()}>Reboot</button>
        <button onClicked={() => powerHandler.shutdown()}>Shutdown</button>
      </box>
    </popover>
  );
}
