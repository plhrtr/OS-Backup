import { bind, Variable } from "astal";
import QSPageButton from "./QSPageButton";
import Bluetooth from "gi://AstalBluetooth";
type BluetoothButtonProps = {
  visibleWindow: Variable<string>;
};

export default function BluetoothButton({
  visibleWindow,
}: BluetoothButtonProps) {
  const bluetooth = Bluetooth.get_default();

  return (
    <QSPageButton
      visibleWindow={visibleWindow}
      newPage="Bluetooth"
      headline={"Bluetooth"}
      description={bind(bluetooth, "isPowered").as((isPowered) =>
        isPowered ? "On" : "Off",
      )}
      icon={bind(bluetooth, "isPowered").as((isPowered) => {
        if (isPowered) {
          return "bluetooth-active-symbolic";
        }
        return "bluetooth-disabled-symbolic";
      })}
      state={bind(bluetooth, "isPowered")}
    />
  );
}
