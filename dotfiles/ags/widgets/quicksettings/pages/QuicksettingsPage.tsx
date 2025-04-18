import { Variable } from "astal";
import { Gtk } from "astal/gtk4";
import Apps from "gi://AstalApps";

type QuicksettingsPageProps = {
    child?: JSX.Element;
    visibleWindow: Variable<string>;
    previousWindow: string;
    pageName: string;
    settingsApp?: string;
};

export default function QuicksettingsPage({
    child,
    visibleWindow,
    previousWindow,
    pageName,
    settingsApp,
    ...props
}: QuicksettingsPageProps) {
    const apps = new Apps.Apps();

    return (
        <box
            orientation={Gtk.Orientation.VERTICAL}
            spacing={10}
            name={pageName}
            {...props}
        >
            <box cssClasses={["qs-header"]}>
                <button
                    onClicked={() => visibleWindow.set(previousWindow)}
                    iconName={"go-previous-symbolic"}
                    cssClasses={["back-button"]}
                ></button>
                <box hexpand halign={Gtk.Align.CENTER}>
                    {pageName}
                </box>
                {settingsApp != undefined ? (
                    <button
                        iconName={"system-settings-symbolic"}
                        cssClasses={["settings-button"]}
                        onClicked={() => {
                            apps.fuzzy_query(settingsApp)[0].launch();
                        }}
                    />
                ) : (
                    <></>
                )}
            </box>
            <Gtk.Separator />
            <box cssClasses={["qs-header-child"]}>{child}</box>
        </box>
    );
}
