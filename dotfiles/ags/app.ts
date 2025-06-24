import { App, Gdk, Gtk } from "astal/gtk4";
import style from "./style.scss";
import Bar from "./widgets/bar/Bar";
import OSD from "./widgets/osd/Osd";
import CommandPrompt from "./widgets/command_prompt/CommandPrompt";
import NotificationPopups from "./widgets/notifications/NotificationPopUps";
import LogoutManager from "./widgets/logout_mananger/LogoutManager";
import ClipBoardHistory from "./widgets/clipboard_history/ClipBoardHistory";
import { Gio } from "astal";

App.start({
  css: style,
  main() {
    App.get_monitors().map(OSD);
    App.get_monitors().map(CommandPrompt);
    App.get_monitors().map(NotificationPopups);
    App.get_monitors().map(LogoutManager);
    App.get_monitors().map(ClipBoardHistory);

    const bars = new Map<Gdk.Monitor, Gtk.Widget>();

    // initialize
    for (const monitor of App.get_monitors()) {
      bars.set(monitor, Bar(monitor));
    }

    const monitors =
      Gdk.Display.get_default()!.get_monitors() as Gio.ListModel<Gdk.Monitor>;
    monitors.connect("items-changed", () => {
      // remove all old bars
      for (const [_, bar] of bars.entries()) {
        (bar as Gtk.Window)?.destroy();
      }

      // create new bars
      for (const monitor of App.get_monitors()) {
        bars.set(monitor, Bar(monitor));
      }
    });
  },
});
