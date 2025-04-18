import { Gtk, astalify, type ConstructProps } from "astal/gtk4";

export type DrowDownProps = ConstructProps<
    Gtk.DropDown,
    Gtk.DropDown.ConstructorProps
>;

export const DropDown = astalify<Gtk.DropDown, Gtk.DropDown.ConstructorProps>(
    Gtk.DropDown,
    {}
);
