import { bind, Variable } from "astal";
import QuicksettingsPage from "./QuicksettingsPage";
import AstalWp from "gi://AstalWp?version=0.1";
import { Gtk } from "astal/gtk4";
import { DropDown } from "../../common_widgets/DropDown";

type AudioPageProps = {
    visibleWindow: Variable<string>;
    previousWindow: string;
};

export default function AudioPage({
    visibleWindow,
    previousWindow,
}: AudioPageProps) {
    const audio = AstalWp.get_default()!.audio;
    let dropwdown: Gtk.DropDown;

    visibleWindow.subscribe((window) => {
        if (window == "Audio") {
            let index = 0;
            for (let i = 0; i < audio.speakers.length; i++) {
                if (audio.speakers[i].isDefault) {
                    index = i;
                    break;
                }
            }
            print(index);
            dropwdown.set_selected(index);
        }
    });

    return (
        <QuicksettingsPage
            visibleWindow={visibleWindow}
            previousWindow={previousWindow}
            pageName="Audio"
        >
            <box cssClasses={["audio-page"]} hexpand>
                <box vertical spacing={7} cssClasses={["wrapper"]} hexpand>
                    <label
                        label={"Default speaker:"}
                        halign={Gtk.Align.START}
                    />
                    {bind(audio, "speakers").as((speakers) => {
                        return (
                            <DropDown
                                setup={(self) => {
                                    dropwdown = self;
                                    const speakerList = speakers.map(
                                        (speaker) =>
                                            speaker.description.length < 30
                                                ? speaker.description
                                                : speaker.description.slice(
                                                      0,
                                                      30
                                                  ) + "..."
                                    );
                                    self.model =
                                        Gtk.StringList.new(speakerList);
                                    self.connect(
                                        "notify::selected-item",
                                        () => {
                                            const selectedIndex = self.selected;
                                            const selectedSpeaker =
                                                speakers[selectedIndex];
                                            if (selectedSpeaker) {
                                                selectedSpeaker.set_is_default(
                                                    true
                                                );
                                            }
                                        }
                                    );
                                }}
                            />
                        );
                    })}
                </box>
            </box>
        </QuicksettingsPage>
    );
}
