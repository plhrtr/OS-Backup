import { GLib } from "astal";
import { Astal, Gtk } from "astal/gtk4";
import Notifd from "gi://AstalNotifd";

const isIcon = (icon: string) => {
  const iconTheme = new Gtk.IconTheme();
  return iconTheme.has_icon(icon);
};
const fileExists = (path: string) => GLib.file_test(path, GLib.FileTest.EXISTS);

const time = (time: number, format = "%H:%M") =>
  GLib.DateTime.new_from_unix_local(time).format(format)!;

const urgency = (n: Notifd.Notification) => {
  const { LOW, NORMAL, CRITICAL } = Notifd.Urgency;
  switch (n.urgency) {
    case LOW:
      return "low";
    case CRITICAL:
      return "critical";
    case NORMAL:
    default:
      return "normal";
  }
};

type Props = {
  notification: Notifd.Notification;
  border?: boolean;
};

export default function Notification(props: Props) {
  const { notification: n, border } = props;
  const { START, CENTER, END } = Gtk.Align;

  return (
    <box
      cssClasses={["notification", `${urgency(n)}`, border ? "border" : ""]}
      hexpand={false}
      vexpand={false}
    >
      <box vertical spacing={10}>
        <box cssClasses={["header"]} spacing={10}>
          <box spacing={5}>
            {(n.appIcon || n.desktopEntry) && (
              <image
                cssClasses={["app-icon"]}
                visible={Boolean(n.appIcon || n.desktopEntry)}
                iconName={n.appIcon || n.desktopEntry}
              />
            )}

            <label
              cssClasses={["app-name"]}
              halign={START}
              truncate
              label={n.appName || "Unknown"}
            />
          </box>
          <label
            cssClasses={["time"]}
            hexpand
            halign={END}
            label={time(n.time)}
          />
          <button onClicked={() => n.dismiss()} cssClasses={["close-btn"]}>
            <image iconName="window-close-symbolic" />
          </button>
        </box>
        <box cssClasses={["content"]} halign={START} spacing={10}>
          {n.image && fileExists(n.image) && (
            <box
              cssClasses={["image"]}
              halign={START}
              overflow={Gtk.Overflow.HIDDEN}
            >
              <image file={n.image} />
            </box>
          )}
          {n.image && isIcon(n.image) && (
            <box expand={false} valign={START} cssClasses={["icon-image"]}>
              <image
                iconName={n.image}
                expand
                halign={CENTER}
                valign={CENTER}
              />
            </box>
          )}
          <box vertical vexpand>
            <label
              cssClasses={["summary"]}
              halign={START}
              xalign={0}
              label={
                n.summary.length < 50
                  ? n.summary
                  : n.summary.slice(0, 47) + "..."
              }
              truncate
            />
            {n.body && (
              <label
                cssClasses={["body"]}
                wrap
                useMarkup
                halign={START}
                xalign={0}
                label={
                  n.body.length < 100 ? n.body : n.body.slice(0, 97) + "..."
                }
              />
            )}
          </box>
        </box>
        {n.get_actions().length > 0 && (
          <box cssClasses={["actions"]} spacing={5}>
            {n.get_actions().map(({ label, id }) => (
              <button hexpand onClicked={() => n.invoke(id)}>
                <label label={label} halign={CENTER} hexpand />
              </button>
            ))}
          </box>
        )}
      </box>
    </box>
  );
}
