import { bind, timeout, Variable } from "astal";
import { App, Astal, Gdk } from "astal/gtk4";
import AstalNotifd from "gi://AstalNotifd";
import Notification from "./Notification";

const TIME_OUT = 5000;

export default function NotificationPopup(gdkmonitor: Gdk.Monitor) {
  const { BOTTOM, RIGHT } = Astal.WindowAnchor;
  const notifd = AstalNotifd.get_default();
  const displayedNotifactionId = Variable<number>(-1);

  const notifactionQueue: number[] = [];

  let proccessing = false;
  function processNotificationQueue() {
    if (proccessing) return;
    if (notifactionQueue.length == 0) {
      displayedNotifactionId.set(-1);
      return;
    }

    proccessing = true;

    displayedNotifactionId.set(notifactionQueue.shift() ?? -1);

    timeout(TIME_OUT, () => {
      displayedNotifactionId.set(-1);
      timeout(500, () => {
        proccessing = false;
        processNotificationQueue();
      });
    });
  }

  notifd.connect("notified", (_, id) => {
    if (
      notifd.dontDisturb &&
      notifd.get_notification(id).urgency !== AstalNotifd.Urgency.CRITICAL
    )
      return;

    if (id == displayedNotifactionId.get()) {
      displayedNotifactionId.set(id);
    }
    if (!notifactionQueue.find((notifId) => notifId === id)) {
      notifactionQueue.push(id);
    }
    processNotificationQueue();
  });

  notifd.connect("resolved", (_, id) => {
    if (id == displayedNotifactionId.get()) {
      proccessing = false;
      displayedNotifactionId.set(-1);
      processNotificationQueue();
    }
  });

  return (
    <window
      visible={bind(displayedNotifactionId).as((id) => id != -1)}
      name={"notification-popup"}
      cssClasses={["notifaction-popup-center"]}
      layer={Astal.Layer.OVERLAY}
      gdkmonitor={gdkmonitor}
      application={App}
      anchor={BOTTOM | RIGHT}
    >
      {bind(displayedNotifactionId).as((id) => {
        if (id == -1) return;
        return (
          <Notification notification={notifd.get_notification(id)} border />
        );
      })}
    </window>
  );
}
