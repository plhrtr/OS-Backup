import { Gtk } from "astal/gtk4";
import { bind, Variable } from "astal";
import SettingsPage from "./pages/SettingsPage";
import MainPage from "./pages/MainPage";
import AudioPage from "./pages/AudioPage";
import ScreenPage from "./pages/ScreenPage";
import NetworkPage from "./pages/NetworkPage";
import BluetoothPage from "./pages/BluetoothPage";

export default function Quicksettings() {
    const mainPanel = "mainPanel";
    const visibleWindow = Variable(mainPanel);

    const quicksettingsPages = [
        <SettingsPage
            visibleWindow={visibleWindow}
            previousWindow={mainPanel}
        />,
        <AudioPage visibleWindow={visibleWindow} previousWindow={mainPanel} />,
        <ScreenPage visibleWindow={visibleWindow} previousWindow={mainPanel} />,
        <NetworkPage
            visibleWindow={visibleWindow}
            previousWindow={mainPanel}
        />,
        <BluetoothPage
            visibleWindow={visibleWindow}
            previousWindow={mainPanel}
        />,
    ];

    return (
        <popover
            name={"quicksettings"}
            hasArrow={false}
            position={Gtk.PositionType.RIGHT}
            cssClasses={["quicksettings", "container"]}
            overflow={Gtk.Overflow.HIDDEN}
            setup={(self) => {
                self.connect("notify::visible", () =>
                    visibleWindow.set(mainPanel)
                );
            }}
        >
            <stack
                transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
                transitionDuration={200}
                visibleChildName={bind(visibleWindow).as(String)}
                vhomogeneous={false}
                interpolateSize
            >
                <MainPage visibleWindow={visibleWindow} pageName={mainPanel} />
                {quicksettingsPages}
            </stack>
        </popover>
    );
}
