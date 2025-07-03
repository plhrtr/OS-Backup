import { Variable } from "astal";
import QuicksettingsPage from "./QuicksettingsPage";

type SettingsPageProps = {
  visibleWindow: Variable<string>;
  previousWindow: string;
};

export default function SettingsPage({
  visibleWindow,
  previousWindow,
}: SettingsPageProps) {
  return (
    <QuicksettingsPage
      visibleWindow={visibleWindow}
      previousWindow={previousWindow}
      pageName="Settings"
    >
      <box>
        <label label={"Nothing here yet"} />
      </box>
    </QuicksettingsPage>
  );
}
