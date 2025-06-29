import { bind, Variable } from "astal";
import Wp from "gi://AstalWp";
import PageButton from "../qs_buttons/PageButton";
import { Gtk } from "astal/gtk4";

type AudioSliderProps = {
  visibleWindow: Variable<string>;
};

export default function AudioSlider({ visibleWindow }: AudioSliderProps) {
  const speaker = Wp.get_default()?.get_default_speaker();

  return (
    <box cssClasses={["slider"]}>
      <overlay>
        <box hexpand cssClasses={["slider-background"]} />
        <slider
          type="overlay"
          widthRequest={100}
          value={
            speaker
              ? bind(speaker, "volume").as((volume) => {
                  return 0.12 + volume * 0.88;
                })
              : 0
          }
          min={0}
          max={1}
          step={0.05}
          hexpand
          onChangeValue={(self) => {
            // little bit hacky but will work for now
            if (self.value < 0.12) {
              speaker?.set_volume(0);
            } else {
              speaker?.set_volume((self.value - 0.12) / 0.88);
            }
          }}
        />
        <image
          iconName={"audio-speakers-symbolic"}
          type="overlay"
          halign={Gtk.Align.START}
        />
      </overlay>
      <PageButton
        visibleWindow={visibleWindow}
        newPage="Audio"
        iconName="go-next-symbolic"
      />
    </box>
  );
}
