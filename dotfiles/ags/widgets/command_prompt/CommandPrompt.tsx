import { App, Astal, Gdk, Gtk } from "astal/gtk4";
import { bind, Variable } from "astal";
import AppLauncher from "./commands/AppLauncher";
import CommandPromptItem, { CommandPromptItemProps } from "./CommandPromptItem";
import CalculatorCommand from "./commands/CalculatorCommand";
import Command from "./commands/Command";
import SystemManagementCommand from "./commands/SystemManagementCommand";
import EmojiPickerCommand from "./commands/EmojiPickerCommand";

export const MAX_ITEMS = 5;

function hide() {
  App.get_window("launcher")!.hide();
}

export default function CommandPrompt() {
  const commands: Command[] = [
    new AppLauncher(),
    new SystemManagementCommand(),
    new CalculatorCommand(),
    new EmojiPickerCommand(),
  ];

  commands.sort(
    (command1, command2) => command2.getPriority() - command1.getPriority(),
  );
  const items = Variable<CommandPromptItemProps[]>(commands[0].parseInput(""));

  const text = Variable("");
  text.subscribe((text) => {
    items.set(
      commands
        .flatMap((command) => command.parseInput(text))
        .splice(0, MAX_ITEMS),
    );
  });
  const onEnter = () => {
    items.get()[0].execute();
    hide();
  };

  return (
    <window
      name="launcher"
      cssClasses={["launcher"]}
      exclusivity={Astal.Exclusivity.IGNORE}
      keymode={Astal.Keymode.ON_DEMAND}
      anchor={
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.BOTTOM |
        Astal.WindowAnchor.LEFT |
        Astal.WindowAnchor.RIGHT
      }
      application={App}
      onKeyPressed={(_, keyval) => {
        if (keyval === Gdk.KEY_Escape) {
          hide();
        }
      }}
      setup={(self) => {
        self.connect("map", () => text.set(""));
      }}
    >
      <box vexpand hexpand valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER}>
        <box vertical heightRequest={500} widthRequest={500}>
          <box cssClasses={["search-field"]} spacing={10}>
            <image iconName={"search-symbolic"} />
            <entry
              setup={(self) => {
                self.connect("map", () => {
                  self.text = "";
                  self.grab_focus();
                });
              }}
              hexpand
              placeholderText="Search"
              onChanged={(self) => text.set(self.text)}
              onActivate={onEnter}
            />
          </box>
          <box cssClasses={["result-field"]} vertical spacing={5}>
            <box cssClasses={["separator"]} heightRequest={1} />
            <box spacing={8} vertical>
              {bind(items).as((items) =>
                items.map((item) => (
                  <CommandPromptItem
                    execute={item.execute}
                    iconName={item.iconName}
                    iconIsText={item.iconIsText}
                    value={item.value}
                  />
                )),
              )}
            </box>
            <box
              halign={Gtk.Align.CENTER}
              cssClasses={["no-results"]}
              hexpand
              vertical
              visible={bind(items).as((items) => items.length === 0)}
            >
              <label label="No match found" />
            </box>
          </box>
        </box>
      </box>
    </window>
  );
}
