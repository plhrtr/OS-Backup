import { Binding } from "astal";
import { App, Gtk } from "astal/gtk4";

export type CommandPromptItemProps = {
    /**
     * Executes the command
     */
    execute: Function;
    iconName: string | Binding<string>;
    iconIsText?: boolean;
    value: string | Binding<string>;
};

export default function CommandPromptItem({
    execute,
    iconName,
    iconIsText,
    value,
}: CommandPromptItemProps) {
    function hide() {
        App.get_window("launcher")!.hide();
    }

    return (
        <button
            cssClasses={["search-result"]}
            onClicked={() => {
                hide();
                execute();
            }}
            hexpand
        >
            <box spacing={10}>
                {iconIsText ? (
                    <label label={iconName} />
                ) : (
                    <image iconName={iconName} iconSize={Gtk.IconSize.LARGE} />
                )}
                <box valign={Gtk.Align.CENTER} vertical>
                    <label cssClasses={["name"]} label={value} />
                </box>
            </box>
        </button>
    );
}
