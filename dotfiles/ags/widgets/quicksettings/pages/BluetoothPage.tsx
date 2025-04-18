import { bind, Binding, Variable } from "astal";
import QuicksettingsPage from "./QuicksettingsPage";
import Bluetooth from "gi://AstalBluetooth";
import { Gtk } from "astal/gtk4";
import BluetoothDevice from "../misc/BluetoothDevice";

type BluetoothPageProps = {
    visibleWindow: Variable<string>;
    previousWindow: string;
};

export default function BluetoothPage({
    visibleWindow,
    previousWindow,
}: BluetoothPageProps) {
    const bluetooth = Bluetooth.get_default();
    const connectedDevices = Variable<Bluetooth.Device[]>([]);
    const previousConnectedDevices = Variable<Bluetooth.Device[]>([]);

    function getDevices() {
        const connected: Bluetooth.Device[] = [];
        const previous: Bluetooth.Device[] = [];
        bluetooth.devices.forEach((device) => {
            if (device.connected) {
                connected.push(device);
            } else {
                previous.push(device);
            }
        });
        connectedDevices.set(connected);
        previousConnectedDevices.set(previous);
    }

    visibleWindow.subscribe((window) => {
        if (window == "Bluetooth") {
            getDevices();
        }
    });
    getDevices();

    return (
        <QuicksettingsPage
            visibleWindow={visibleWindow}
            previousWindow={previousWindow}
            pageName="Bluetooth"
            settingsApp="bluetooth manager"
        >
            <box vertical spacing={4} hexpand cssClasses={["bluetooth-page"]}>
                <box cssClasses={["qs-page-content-header"]}>
                    <label
                        label={"Use bluetooth"}
                        halign={Gtk.Align.START}
                        hexpand
                    />
                    <switch
                        active={bind(bluetooth, "isPowered")}
                        setup={(self) => {
                            self.connect("notify::active", (self) => {
                                bluetooth.adapters.forEach((adapter) => {
                                    adapter.set_powered(self.active);
                                });
                            });
                        }}
                    />
                </box>
                {bind(bluetooth, "isPowered").as((isPowered) => {
                    if (isPowered) {
                        return (
                            <box vertical spacing={4}>
                                <box
                                    cssClasses={["qs-page-content"]}
                                    vertical
                                    spacing={10}
                                >
                                    <label
                                        label={"Currently connected"}
                                        halign={Gtk.Align.START}
                                        cssClasses={["headline"]}
                                    />
                                    {bind(connectedDevices).as((devices) => {
                                        return devices.length > 0 ? (
                                            devices
                                                .filter(
                                                    (device) => device.connected
                                                )
                                                .map((device) => {
                                                    return (
                                                        <BluetoothDevice
                                                            device={device}
                                                            getDevices={
                                                                getDevices
                                                            }
                                                        />
                                                    );
                                                })
                                        ) : (
                                            <box
                                                hexpand
                                                cssClasses={["no-entry"]}
                                                halign={Gtk.Align.START}
                                            >
                                                No connected devices
                                            </box>
                                        );
                                    })}
                                </box>
                                <box
                                    cssClasses={["qs-page-content-footer"]}
                                    vertical
                                    spacing={10}
                                >
                                    <label
                                        label={"Previously connected"}
                                        halign={Gtk.Align.START}
                                        cssClasses={["headline"]}
                                    />
                                    {bind(previousConnectedDevices).as(
                                        (devices) => {
                                            const seenDevices = new Set();
                                            return devices.length > 0 ? (
                                                devices
                                                    .filter((device) => {
                                                        if (
                                                            seenDevices.has(
                                                                device
                                                            ) ||
                                                            device.connected
                                                        ) {
                                                            return false;
                                                        }
                                                        seenDevices.add(device);
                                                        return true;
                                                    })
                                                    .map((device) => {
                                                        return (
                                                            <BluetoothDevice
                                                                device={device}
                                                                getDevices={
                                                                    getDevices
                                                                }
                                                            />
                                                        );
                                                    })
                                            ) : (
                                                <box
                                                    hexpand
                                                    halign={Gtk.Align.CENTER}
                                                    cssClasses={["no-entry"]}
                                                >
                                                    No previously connected
                                                    devices
                                                </box>
                                            );
                                        }
                                    )}
                                </box>
                            </box>
                        );
                    }
                    return (
                        <box
                            cssClasses={["qs-page-content-footer", "no-entry"]}
                        >
                            <label
                                label={"Bluetooth is disabled"}
                                hexpand
                                halign={Gtk.Align.START}
                            />
                        </box>
                    );
                })}
            </box>
        </QuicksettingsPage>
    );
}
