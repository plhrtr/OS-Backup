import { bind, Binding, Variable } from "astal";
import PageButton from "./PageButton";
import { Gtk } from "astal/gtk4";

type QSPageButtonProps = {
    visibleWindow: Variable<string>;
    newPage: string;
    icon: string | Binding<string>;
    /**
     * Determines if the toggle is turned on or off
     */
    state: Binding<boolean>;
    /**
     * The headline of the button
     */
    headline: string | Binding<string>;
    /**
     * A short text displayed below the button
     */
    description: string | Binding<string>;
};

export default function QSPageButton({
    visibleWindow,
    newPage,
    icon,
    state,
    headline,
    description,
}: QSPageButtonProps) {
    const cssClasses = bind(state).as((isActive) => {
        if (isActive) {
            return ["qs-button", "active"];
        }
        return ["qs-button"];
    });

    return (
        <PageButton
            visibleWindow={visibleWindow}
            newPage={newPage}
            cssClasses={cssClasses}
            hexpand
        >
            <box spacing={10}>
                <image iconName={icon} />
                <box orientation={Gtk.Orientation.VERTICAL} hexpand>
                    <box cssClasses={["headline"]}>{headline}</box>
                    <box cssClasses={["description"]}>{description}</box>
                </box>
                <image iconName={"go-next-symbolic"} />
            </box>
        </PageButton>
    );
}
