import { Gtk } from "astal/gtk4";
import NotificationPanel from "./NotificationPanel";
import AppointmentsPanel from "./AppointmentsPanel";

export default function InfoPanel() {
    return (
        <popover
            hasArrow={false}
            cssClasses={["notification-center", "quicksettings"]}
            position={Gtk.PositionType.RIGHT}
            vexpand
        >
            <box vertical spacing={7} vexpand>
                <AppointmentsPanel />
                <NotificationPanel />
            </box>
        </popover>
    );
}
