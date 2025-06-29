import { bind, GLib, Variable } from "astal";
import Systray from "./Systray";
import Battery from "gi://AstalBattery";
import Network from "gi://AstalNetwork";
import Quicksettings from "../../quicksettings/Quicksettings";
import InfoPanel from "../../info_panel/InfoPanel";

function Time({ format = "%H:%M" }) {
  const time = Variable<string>("").poll(
    1000,
    () => GLib.DateTime.new_now_local().format(format)!,
  );

  return <label onDestroy={() => time.drop()} label={time()} />;
}

function NetworkIcon() {
  const network = Network.get_default();
  const wifi = bind(network, "wifi");
  const wired = bind(network, "wired");

  return (
    <box spacing={7}>
      <box visible={wifi.as(Boolean)}>
        {wifi.as(
          (wifi) =>
            wifi && (
              <image
                tooltipText={bind(wifi, "ssid").as(String)}
                iconName={bind(wifi, "iconName")}
              />
            ),
        )}
      </box>
      <box visible={wired.as(Boolean)}>
        {wired.as(
          (wired) => wired && <image iconName={bind(wired, "iconName")} />,
        )}
      </box>
    </box>
  );
}

function BatteryLevel() {
  const bat = Battery.get_default();

  return (
    <box
      spacing={3}
      visible={bind(bat, "isPresent")}
      tooltipText={bind(bat, "percentage").as(() => {
        if (bat.charging) {
          const hours = Math.floor(bat.timeToFull / 3600);
          const minutes = Math.floor((bat.timeToFull % 3600) / 60);
          return `${hours}h ${minutes}m until full`;
        } else {
          if (bat.timeToEmpty == 0) {
            return "Plugged in";
          }
          const hours = Math.floor(bat.timeToEmpty / 3600);
          const minutes = Math.floor((bat.timeToEmpty % 3600) / 60);
          return `${hours}h ${minutes}m until empty`;
        }
      })}
    >
      <image iconName={bind(bat, "batteryIconName")} />
      <label
        label={bind(bat, "percentage").as((p) => `${Math.floor(p * 100)} %`)}
      />
    </box>
  );
}

export default function BarMenu() {
  const isSystrayOpen = Variable(false);

  return (
    <box cssClasses={["toggle-menu"]} spacing={4}>
      <menubutton iconName={"go-down-symbolic"} cssClasses={["systray-button"]}>
        <Systray isSystrayOpen={isSystrayOpen} />
      </menubutton>
      <menubutton cssClasses={["notification-toggle"]}>
        <Time format="%d %b" />
        <InfoPanel />
      </menubutton>
      <menubutton cssClasses={["quicksettings-toggle"]}>
        <box spacing={7}>
          <Time />
          <NetworkIcon />
          <BatteryLevel />
        </box>
        <Quicksettings />
      </menubutton>
    </box>
  );
}
