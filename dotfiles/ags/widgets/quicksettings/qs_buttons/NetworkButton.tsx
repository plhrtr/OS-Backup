import { bind, Binding, Variable } from "astal";
import QSPageButton from "./QSPageButton";
import Network from "gi://AstalNetwork";

type NetworkButtonProps = {
    visibleWindow: Variable<string>;
};

export default function NetworkButton({ visibleWindow }: NetworkButtonProps) {
    const network = Network.get_default();
    const wifi = bind(network, "wifi");

    return (
        <QSPageButton
            visibleWindow={visibleWindow}
            newPage="Network"
            headline={bind(network.wifi, "activeConnection").as(
                (connection) => {
                    if (!connection) {
                        return "Network";
                    }
                    const name =
                        connection.get_id().length < 10
                            ? connection.get_id()
                            : connection.get_id().slice(0, 8) + "...";
                    return name;
                }
            )}
            description={bind(wifi.get(), "strength").as((strength) => {
                if (strength <= 0) {
                    return "Off";
                }
                if (strength < 30) {
                    return "Low";
                } else if (strength < 70) {
                    return "Medium";
                } else {
                    return "High";
                }
            })}
            icon={bind(wifi.get(), "iconName")}
            state={bind(wifi.get(), "enabled")}
        />
    );
}
