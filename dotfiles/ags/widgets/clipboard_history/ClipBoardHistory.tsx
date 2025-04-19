import { bind, execAsync, Variable } from "astal";
import { App, Astal, Gdk, Gtk } from "astal/gtk4";

function EmptyClipBoard() {
    return (
        <box
            cssClasses={["empty-clipboard"]}
            vertical
            spacing={5}
            valign={Gtk.Align.CENTER}
            halign={Gtk.Align.CENTER}
            vexpand
            hexpand
        >
            <image
                iconName={"clipman-symbolic"}
                iconSize={Gtk.IconSize.LARGE}
            />
            <label label={"Clipboard is empty"} />
        </box>
    );
}

type ClipBoardEntryProps = {
    text: string;
    clipHistIndex: number;
};

function ClipBoardEntry({ text, clipHistIndex }: ClipBoardEntryProps) {
    return (
        <button
            onClicked={() => {
                execAsync([
                    "bash",
                    "-c",
                    `ags toggle clipboard-history && cliphist decode ${clipHistIndex} | wl-copy`,
                ]);
            }}
        >
            <label label={text} />
        </button>
    );
}

export default function ClipBoardHistory() {
    const clipboardHistory = Variable<ClipBoardEntryProps[]>([]);

    return (
        <window
            name="clipboard-history"
            cssClasses={["clipboard-history"]}
            exclusivity={Astal.Exclusivity.IGNORE}
            keymode={Astal.Keymode.ON_DEMAND}
            anchor={Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT}
            application={App}
            onKeyPressed={(_, keyval) => {
                if (keyval === Gdk.KEY_Escape) {
                    App.toggle_window("clipboard-history");
                }
            }}
            setup={(self) => {
                self.connect("notify::visible", () => {
                    if (self.visible) {
                        execAsync([
                            "bash",
                            "-c",
                            "cliphist --preview-width 40 list",
                        ])
                            .then((output) => {
                                if (output == "") {
                                    clipboardHistory.set([]);
                                    return;
                                }
                                clipboardHistory.set(
                                    output.split("\n").map((entry) => {
                                        return {
                                            text: entry.split("\t")[1],
                                            clipHistIndex: parseInt(
                                                entry.split("\t")[0]
                                            ),
                                        } as ClipBoardEntryProps;
                                    })
                                );
                            })
                            .catch((error) => print(error));
                    }
                });
            }}
        >
            <box vertical spacing={10}>
                <box cssClasses={["header"]}>
                    <label
                        label={"Clipboard"}
                        hexpand
                        halign={Gtk.Align.START}
                    />
                    <button
                        onClicked={() => {
                            clipboardHistory.set([]);
                            execAsync(["bash", "-c", "cliphist wipe"]);
                        }}
                    >
                        Clear all
                    </button>
                </box>
                <box cssClasses={["content"]} overflow={Gtk.Overflow.HIDDEN}>
                    {bind(clipboardHistory).as((clipboardHistory) => {
                        print(clipboardHistory.length);
                        if (clipboardHistory.length == 0) {
                            return <EmptyClipBoard />;
                        }
                        return (
                            <Gtk.ScrolledWindow>
                                <box vexpand hexpand vertical spacing={5}>
                                    {clipboardHistory.map((entry) => {
                                        return (
                                            <ClipBoardEntry
                                                text={entry.text}
                                                clipHistIndex={
                                                    entry.clipHistIndex
                                                }
                                            />
                                        );
                                    })}
                                </box>
                            </Gtk.ScrolledWindow>
                        );
                    })}
                </box>
            </box>
        </window>
    );
}
