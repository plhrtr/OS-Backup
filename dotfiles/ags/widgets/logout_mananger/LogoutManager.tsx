import { App, Astal, Gdk, Gtk } from "astal/gtk4";
import { FlowBox } from "../common_widgets/Flowbox";
import PowerHandler from "../../utils/power";
import { DropDown } from "../common_widgets/DropDown";

type SystemButtonProps = {
    icon: string;
    isPrimary: boolean;
    action: Function;
};

function ManagementButton({ icon, isPrimary, action }: SystemButtonProps) {
    return (
        <button
            cssClasses={["management-button", isPrimary ? "primary" : ""]}
            onClicked={() => {
                App.toggle_window("logout-manager");
                action();
            }}
        >
            <image iconName={icon} iconSize={Gtk.IconSize.LARGE} />
        </button>
    );
}

export default function LogoutManager() {
    const powerHandler = PowerHandler.get_default();

    return (
        <window
            name="logout-manager"
            cssClasses={["logout-manager"]}
            exclusivity={Astal.Exclusivity.IGNORE}
            layer={Astal.Layer.TOP}
            keymode={Astal.Keymode.ON_DEMAND}
            anchor={
                Astal.WindowAnchor.TOP |
                Astal.WindowAnchor.BOTTOM |
                Astal.WindowAnchor.LEFT |
                Astal.WindowAnchor.RIGHT
            }
            application={App}
            onKeyPressed={(_, keyval) => {
                if (keyval === Gdk.KEY_Escape) {
                    App.toggle_window("logout-manager");
                }
            }}
        >
            <FlowBox
                vexpand
                hexpand
                valign={Gtk.Align.CENTER}
                halign={Gtk.Align.CENTER}
                maxChildrenPerLine={2}
                minChildrenPerLine={2}
                cssClasses={["container"]}
                overflow={Gtk.Overflow.HIDDEN}
            >
                <ManagementButton
                    icon="media-playback-pause-symbolic"
                    isPrimary={false}
                    action={() => powerHandler.suspend()}
                />
                <ManagementButton
                    icon="system-shutdown-symbolic"
                    isPrimary
                    action={() => powerHandler.shutdown()}
                />
                <ManagementButton
                    icon="system-reboot-symbolic"
                    isPrimary={false}
                    action={() => powerHandler.reboot()}
                />
                <ManagementButton
                    icon="brisk_system-log-out-symbolic"
                    isPrimary={false}
                    action={() => powerHandler.logout()}
                />
            </FlowBox>
        </window>
    );
}
