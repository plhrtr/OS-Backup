import { bind } from "astal";
import AstalNotifd from "gi://AstalNotifd?version=0.1";
import Notification from "../notifications/Notification";
import { Gtk } from "astal/gtk4";
import Notify from "gi://Notify?version=0.7";

function ScrolledNotifications() {
  const notifd = AstalNotifd.get_default();
  notifd.notifications.forEach((e) => e.dismiss());

  return (
    <box vertical spacing={7} vexpand cssClasses={["scrolled-notifications"]}>
      {bind(notifd, "notifications").as((notifications) => {
        if (notifications.length > 0) {
          return notifications
            .sort((a, b) => b.time - a.time)
            .slice(0, 5)
            .map((notification) => {
              return (
                <Notification
                  notification={notification}
                  border={notification.urgency == Notify.Urgency.CRITICAL}
                />
              );
            });
        }
        return (
          <box vertical spacing={10} cssClasses={["no-notifications"]} vexpand>
            <image
              iconName={"notifications-disabled-symbolic"}
              iconSize={Gtk.IconSize.LARGE}
            />
            <label label={"No notifications"} />
          </box>
        );
      })}
    </box>
  );
}

function DNDSwitch() {
  const notifd = AstalNotifd.get_default();

  return (
    <box spacing={10} cssClasses={["dont-disturb"]}>
      <box hexpand halign={Gtk.Align.START} spacing={5}>
        <image iconName={"dialog-error-symbolic"} />
        <label label={"Do not disturb"} />
      </box>
      <switch
        active={bind(notifd, "dontDisturb")}
        setup={(self) => {
          self.connect("notify::active", (self) => {
            notifd.set_dont_disturb(self.active);
          });
        }}
      />
    </box>
  );
}

function ClearAllNotifications() {
  const notifd = AstalNotifd.get_default();

  return (
    <box hexpand>
      <box hexpand />
      <button
        halign={Gtk.Align.END}
        onClicked={() => notifd.notifications.forEach((e) => e.dismiss())}
        cssClasses={["clear-all"]}
        visible={bind(notifd, "notifications").as(
          (notifications) => notifications.length > 0,
        )}
      >
        Clear all
      </button>
    </box>
  );
}

export default function NotificationPanel() {
  return (
    <box
      vertical
      cssClasses={["container"]}
      vexpand
      hexpand
      overflow={Gtk.Overflow.HIDDEN}
      spacing={5}
    >
      <label label={"Notifications"} cssClasses={["headline"]} />
      <box
        vertical
        hexpand
        vexpand
        cssClasses={["inner-container"]}
        spacing={10}
      >
        <DNDSwitch />
        <ScrolledNotifications />
        <ClearAllNotifications />
      </box>
    </box>
  );
}
