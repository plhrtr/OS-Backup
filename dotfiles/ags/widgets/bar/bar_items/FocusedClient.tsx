import Hyprland from "gi://AstalHyprland";
import { bind } from "astal";
import { Gtk } from "astal/gtk4";

export default function FocusedClient() {
    const hypr = Hyprland.get_default();
    const focused = bind(hypr, "focusedClient");

    return (
        <box cssClasses={["focused-client"]}>
            {focused.as((client) =>
                client ? (
                    <box orientation={Gtk.Orientation.VERTICAL}>
                        <box>
                            <label
                                cssClasses={["initial-title"]}
                                label={bind(client, "initialTitle")}
                            />
                        </box>
                        <box>
                            <label
                                cssClasses={["title"]}
                                label={bind(client, "title").as((title) => {
                                    return title.length < 50
                                        ? title
                                        : title.slice(0, 47) + "...";
                                })}
                            />
                        </box>
                    </box>
                ) : (
                    <image iconName={"dino-symbolic"} />
                )
            )}
        </box>
    );
}
