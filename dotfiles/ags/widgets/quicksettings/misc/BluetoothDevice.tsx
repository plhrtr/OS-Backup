import { bind, Variable } from "astal";
import { Gtk } from "astal/gtk4";
import Bluetooth from "gi://AstalBluetooth";

export default function BluetoothDevice({
  device,
  getDevices,
}: {
  device: Bluetooth.Device;
  getDevices: Function;
}) {
  const loading = Variable(false);

  return (
    <button
      cssClasses={["bluetooth-device"]}
      onClicked={() => {
        if (device.connected) {
          loading.set(true);
          device.disconnect_device(() => {
            loading.set(false);
            getDevices();
          });
        } else {
          loading.set(true);
          try {
            device.connect_device(() => {
              loading.set(false);
              getDevices();
            });
          } catch (error) {
            loading.set(false);
          }
        }
      }}
    >
      <box spacing={5}>
        <image
          iconName={
            device.icon ? device.icon : "applications-electronics-symbolic"
          }
        />
        <label
          label={
            device.name.length < 30
              ? device.name
              : device.name.slice(0, 27) + "..."
          }
          hexpand
          halign={Gtk.Align.START}
        />
        <image
          iconName={"content-loading-symbolic"}
          halign={Gtk.Align.END}
          cssClasses={["loader"]}
          visible={bind(loading)}
        />
      </box>
    </button>
  );
}
