import { bind, exec, execAsync, Variable } from "astal";
import QuicksettingsPage from "./QuicksettingsPage";
import { Gtk } from "astal/gtk4";
import Network from "gi://AstalNetwork";

type NetworkPageProps = {
    visibleWindow: Variable<string>;
    previousWindow: string;
};

function WifiEntry({ accessPoint }: { accessPoint: Network.AccessPoint }) {
    const network = Network.get_default();

    return (
        <button
            cssClasses={["wifi-entry"]}
            onClicked={() => {
                exec(`nmcli device wifi connect ${accessPoint.bssid}`);
            }}
        >
            <box spacing={10}>
                <image iconName={accessPoint.iconName} />
                <box>
                    {bind(network.wifi, "ssid").as((ssid) => {
                        if (ssid == accessPoint.ssid) {
                            return (
                                <box spacing={5} vertical>
                                    <label
                                        label={accessPoint.ssid}
                                        halign={Gtk.Align.START}
                                    />
                                    <box
                                        cssClasses={["connected"]}
                                        halign={Gtk.Align.START}
                                    >
                                        Connected
                                    </box>
                                </box>
                            );
                        } else {
                            return (
                                <box>
                                    <label
                                        label={accessPoint.ssid}
                                        halign={Gtk.Align.START}
                                    />
                                </box>
                            );
                        }
                    })}
                </box>
            </box>
        </button>
    );
}

function WifiPage() {
    const wifi = Network.get_default().wifi;

    return (
        <box vertical spacing={4}>
            <box cssClasses={["qs-page-content-header"]} hexpand>
                <box>
                    <label label={"Wifi"} halign={Gtk.Align.START} hexpand />
                    <switch
                        active={bind(wifi, "enabled")}
                        setup={(self) => {
                            self.connect("notify::active", (self) => {
                                wifi.set_enabled(self.active);
                            });
                        }}
                    />
                </box>
            </box>
            <box cssClasses={["qs-page-content-footer"]} vertical spacing={15}>
                {bind(wifi, "accessPoints").as((aps) => {
                    const seenSsids = new Set();
                    return aps.length > 0 ? (
                        aps
                            .filter((ap) => {
                                if (seenSsids.has(ap.ssid)) {
                                    return false;
                                }
                                seenSsids.add(ap.ssid);
                                return !!ap.ssid;
                            })
                            .map((accessPoint) => {
                                return <WifiEntry accessPoint={accessPoint} />;
                            })
                    ) : (
                        <box
                            hexpand
                            halign={Gtk.Align.CENTER}
                            cssClasses={["no-entry"]}
                        >
                            Wifi is disabled
                        </box>
                    );
                })}
            </box>
        </box>
    );
}

export default function NetworkPage({
    visibleWindow,
    previousWindow,
}: NetworkPageProps) {
    return (
        <QuicksettingsPage
            visibleWindow={visibleWindow}
            previousWindow={previousWindow}
            pageName="Network"
            settingsApp="Netzwerkkonfiguration"
        >
            <box cssClasses={["network-page"]}>
                <WifiPage />
            </box>
        </QuicksettingsPage>
    );
}
