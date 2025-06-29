import { App, Astal, Gtk, Gdk } from "astal/gtk4";
import Workspaces from "./bar_items/Workspaces";
import FocusedClient from "./bar_items/FocusedClient";
import BarMenu from "./bar_items/BarMenu";

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;
  return (
    <window
      visible
      cssClasses={["bar"]}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      layer={Astal.Layer.OVERLAY}
      anchor={TOP | LEFT | RIGHT}
      application={App}
    >
      <centerbox cssName="centerbox">
        <box>
          <FocusedClient />
        </box>
        <box hexpand halign={Gtk.Align.CENTER}>
          <Workspaces />
        </box>
        <box>
          <BarMenu />
        </box>
      </centerbox>
    </window>
  );
}
