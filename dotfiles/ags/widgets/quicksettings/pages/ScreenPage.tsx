import { Variable } from "astal";
import QuicksettingsPage from "./QuicksettingsPage";

type ScreenPageProps = {
    visibleWindow: Variable<string>;
    previousWindow: string;
};

export default function ScreenPage({
    visibleWindow,
    previousWindow,
}: ScreenPageProps) {
    return (
        <QuicksettingsPage
            visibleWindow={visibleWindow}
            previousWindow={previousWindow}
            pageName="Screen"
        >
            <box>Nothing here yet</box>
        </QuicksettingsPage>
    );
}
