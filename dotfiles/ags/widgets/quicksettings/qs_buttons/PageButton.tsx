import { Variable } from "astal";
import { Gtk } from "astal/gtk4";

type PageButtonProps = {
  child?: JSX.Element;
  visibleWindow: Variable<string>;
  newPage: string;
};

export default function PageButton({
  child,
  visibleWindow,
  newPage,
  ...props
}: PageButtonProps & Partial<Gtk.Button.ConstructorProps>) {
  return (
    <button
      onClicked={() => {
        visibleWindow?.set(newPage || "");
      }}
      {...props}
    >
      {child}
    </button>
  );
}
