/**
 * Based on, or directly copied from, this repository:
 * https://github.com/ezerinz/epik-shell
 * @author @ezerinz
 */

import { App, Astal, Gdk, Gtk, hook } from "astal/gtk4";
import { WindowProps } from "astal/gtk4/widget";

function Padding({ winName }: { winName: string }) {
  return (
    <button
      cssClasses={["button-padding"]}
      canFocus={false}
      onClicked={() => App.toggle_window(winName)}
      hexpand
      vexpand
    />
  );
}

function Layout({
  child,
  name,
  position,
}: {
  child?: JSX.Element;
  name: string;
  position:
    | "top"
    | "top_center"
    | "top_left"
    | "top_right"
    | "bottom"
    | "bottom_center"
    | "bottom_left"
    | "bottom_right"
    | "center";
}) {
  switch (position) {
    case "top":
      return (
        <box vertical>
          {child}
          <Padding winName={name} />
        </box>
      );
    case "top_center":
      return (
        <box>
          <Padding winName={name} />
          <box vertical hexpand={false}>
            {child}
            <Padding winName={name} />
          </box>
          <Padding winName={name} />
        </box>
      );
    case "top_left":
      return (
        <box>
          <box vertical hexpand={false}>
            {child}
            <Padding winName={name} />
          </box>
          <Padding winName={name} />
        </box>
      );
    case "top_right":
      return (
        <box>
          <Padding winName={name} />
          <box vertical hexpand={false}>
            {child}
            <Padding winName={name} />
          </box>
        </box>
      );
    case "bottom":
      return (
        <box vertical>
          <Padding winName={name} />
          {child}
        </box>
      );
    case "bottom_center":
      return (
        <box>
          <Padding winName={name} />
          <box vertical hexpand={false}>
            <Padding winName={name} />
            {child}
          </box>
          <Padding winName={name} />
        </box>
      );
    case "bottom_left":
      return (
        <box>
          <box vertical hexpand={false}>
            <Padding winName={name} />
            {child}
          </box>
          <Padding winName={name} />
        </box>
      );
    case "bottom_right":
      return (
        <box>
          <Padding winName={name} />
          <box vertical hexpand={false}>
            <Padding winName={name} />
            {child}
          </box>
        </box>
      );
    //default to center
    default:
      return (
        <centerbox>
          <Padding winName={name} />
          <box vertical>
            <Padding winName={name} />
            {child}
            <Padding winName={name} />
          </box>
          <Padding winName={name} />
        </centerbox>
      );
  }
}

type PopupWindowProps = WindowProps & {
  child?: unknown;
  name: string;
  visible?: boolean;
  animation?: string;
  layout?:
    | "top"
    | "top_center"
    | "top_left"
    | "top_right"
    | "bottom"
    | "bottom_center"
    | "bottom_left"
    | "bottom_right"
    | "center";
};

export default function PopupWindow({
  child,
  name,
  visible,
  layout = "center",
  ...props
}: PopupWindowProps) {
  const { TOP, RIGHT, BOTTOM, LEFT } = Astal.WindowAnchor;

  return (
    <window
      visible={visible ?? false}
      cssClasses={["popup-window"]}
      name={name}
      namespace={name}
      layer={Astal.Layer.TOP}
      keymode={Astal.Keymode.EXCLUSIVE}
      application={App}
      anchor={TOP | BOTTOM | RIGHT | LEFT}
      onKeyPressed={(_, keyval) => {
        if (keyval === Gdk.KEY_Escape) {
          App.toggle_window(name);
        }
      }}
      {...props}
    >
      <Layout name={name} position={layout}>
        {child}
      </Layout>
    </window>
  );
}
