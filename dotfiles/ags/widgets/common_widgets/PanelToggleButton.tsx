/**
 * Based on, or directly copied from, this repository:
 * https://github.com/ezerinz/epik-shell
 * @author @ezerinz
 */

import { ButtonProps } from "astal/gtk4/widget";
import { App, hook, Gtk } from "astal/gtk4";

type PanelButtonProps = ButtonProps & {
    child?: unknown;
    /**
     * The window this button toggles
     * Changes it's color depending on the window's state
     */
    window?: string;
    setup?: (self: Gtk.Button) => void;
};

export default function PanelToggelButton({
    child,
    window,
    setup,
    ...props
}: PanelButtonProps) {
    return (
        <button
            cssClasses={["panel-button"]}
            setup={(self) => {
                if (window) {
                    let open = false;

                    self.add_css_class(window);

                    hook(self, App, "window-toggled", (_, win) => {
                        const winName = win.name;
                        const visible = win.visible;

                        if (winName !== window) return;

                        if (open && !visible) {
                            open = false;
                            self.remove_css_class("active");
                        }

                        if (visible) {
                            open = true;
                            self.add_css_class("active");
                        }
                    });
                }

                if (setup) setup(self);
            }}
            {...props}
        >
            {child}
        </button>
    );
}
