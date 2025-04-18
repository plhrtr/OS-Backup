import { bind, Variable } from "astal";
import { Gtk } from "astal/gtk4";
import AstalBattery from "gi://AstalBattery";
import Powermenu from "../popups/Powermenu";
import AudioSlider from "../misc/AudioSlider";
import BrightnessSlider from "../misc/BrightnessSlider";
import NetworkButton from "../qs_buttons/NetworkButton";
import { FlowBox } from "../../common_widgets/Flowbox";
import BluetoothButton from "../qs_buttons/BluetoothButton";
import MediaPlayer from "../misc/MediaPlayer";

type MainPageProps = {
    visibleWindow: Variable<string>;
    pageName: string;
};

export default function MainPage({ visibleWindow, pageName }: MainPageProps) {
    const bat = AstalBattery.get_default();

    return (
        <box
            orientation={Gtk.Orientation.VERTICAL}
            spacing={15}
            name={pageName}
            cssClasses={["qs-child"]}
        >
            <box spacing={10}>
                <box hexpand halign={Gtk.Align.START}>
                    <label
                        cssClasses={["info"]}
                        label={bind(bat, "percentage").as(() => {
                            if (bat.charging) {
                                const hours = Math.floor(bat.timeToFull / 3600);
                                const minutes = Math.floor(
                                    (bat.timeToFull % 3600) / 60
                                );
                                const paddedHours = hours
                                    .toString()
                                    .padStart(2, "0");
                                const paddedMinutes = minutes
                                    .toString()
                                    .padStart(2, "0");
                                return `${(bat.percentage * 100).toFixed(
                                    0
                                )}% - ${paddedHours}:${paddedMinutes} until full`;
                            } else {
                                if (bat.timeToEmpty == 0) {
                                    return "Plugged in";
                                }
                                const hours = Math.floor(
                                    bat.timeToEmpty / 3600
                                );
                                const minutes = Math.floor(
                                    (bat.timeToEmpty % 3600) / 60
                                );
                                const paddedHours = hours
                                    .toString()
                                    .padStart(2, "0");
                                const paddedMinutes = minutes
                                    .toString()
                                    .padStart(2, "0");
                                return `${(bat.percentage * 100).toFixed(
                                    0
                                )}% - ${paddedHours}:${paddedMinutes} left`;
                            }
                        })}
                    />
                </box>
                <box spacing={5} cssClasses={["system-management"]}>
                    <button
                        iconName={"system-settings-symbolic"}
                        cssClasses={["settings-button"]}
                        onClicked={() => {
                            visibleWindow.set("Settings");
                        }}
                    ></button>
                    <menubutton cssClasses={["shutdown-button"]}>
                        <box spacing={3}>
                            <image iconName={"system-shutdown-symbolic"} />
                            <image iconName={"go-down-symbolic"} />
                        </box>
                        <Powermenu />
                    </menubutton>
                </box>
            </box>
            <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>
                <AudioSlider visibleWindow={visibleWindow} />
                <BrightnessSlider visibleWindow={visibleWindow} />
            </box>
            <FlowBox
                minChildrenPerLine={2}
                maxChildrenPerLine={2}
                rowSpacing={8}
                columnSpacing={8}
                homogeneous
            >
                <NetworkButton visibleWindow={visibleWindow} />
                <BluetoothButton visibleWindow={visibleWindow} />
            </FlowBox>
            <MediaPlayer />
        </box>
    );
}
