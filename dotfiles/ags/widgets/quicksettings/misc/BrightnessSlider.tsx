import { bind, execAsync, Variable } from "astal";
import PageButton from "../qs_buttons/PageButton";
import Brightness from "../../../utils/brightness";
import { Gtk } from "astal/gtk4";

type BrightnessSliderProps = {
  visibleWindow: Variable<string>;
};

export default function BrightnessSlider({
  visibleWindow,
}: BrightnessSliderProps) {
  const brightness = Brightness.get_default();

  function setBrightness(percent: number) {
    execAsync(`brightnessctl set ${Math.floor(percent * 100)}% -q`);
  }

  return (
    <box cssClasses={["slider"]}>
      <overlay>
        <box hexpand cssClasses={["slider-background"]} />

        <slider
          type="overlay"
          widthRequest={100}
          min={0}
          max={1}
          step={0.05}
          hexpand
          value={bind(brightness, "screen").as((screen) => {
            return 0.13 + screen * 0.88;
          })}
          onChangeValue={(self) => {
            // little bit hacky but will work for now
            if (self.value < 0.12) {
              brightness.screen = 0;
            } else {
              brightness.screen = (self.value - 0.12) / 0.88;
            }
          }}
        />
        <image
          iconName={"display-brightness-symbolic"}
          type="overlay"
          halign={Gtk.Align.START}
          valign={Gtk.Align.CENTER}
        />
      </overlay>
      <PageButton
        visibleWindow={visibleWindow}
        newPage="Screen"
        iconName="go-next-symbolic"
      />
    </box>
  );
}
