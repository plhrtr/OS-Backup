import Tray from "gi://AstalTray";
import { bind, Variable } from "astal";
import { Gtk } from "astal/gtk4";

function SystrayItem({ item }: { item: Tray.TrayItem }) {
    const popover = Gtk.PopoverMenu.new_from_model(item.menuModel);
    popover.hasArrow = false;

    return (
        <menubutton
            setup={(self) => {
                self.insert_action_group("dbusmenu", item.actionGroup);
            }}
            tooltipText={bind(item, "tooltipMarkup")}
            cssClasses={["systray-item"]}
        >
            <image gicon={bind(item, "gicon")} />
            {popover}
        </menubutton>
    );
}

export default function Systray({
    isSystrayOpen,
}: {
    isSystrayOpen: Variable<Boolean>;
}) {
    const tray = Tray.get_default();
    // TODO: Filter out unnecassary items use flowbox

    return (
        <popover cssClasses={["systray"]} hasArrow={false}>
            <box cssClasses={["wrapper"]} spacing={8}>
                {bind(tray, "items").as((items) => {
                    const seenItems = new Set();
                    return items
                        .filter((item) => {
                            if (seenItems.has(item)) {
                                return false;
                            }
                            seenItems.add(items);
                            return true;
                        })
                        .map((item) => {
                            return <SystrayItem item={item} />;
                        });
                })}
            </box>
        </popover>
    );
}
