import { App } from "astal/gtk4";
import style from "./style.scss";
import Bar from "./widgets/bar/Bar";
import OSD from "./widgets/osd/Osd";
import CommandPrompt from "./widgets/command_prompt/CommandPrompt";
import NotificationPopups from "./widgets/notifications/NotificationPopUps";
import LogoutManager from "./widgets/logout_mananger/LogoutManager";
import ClipBoardHistory from "./widgets/clipboard_history/ClipBoardHistory";

App.start({
    css: style,
    main() {
        App.get_monitors().map(Bar);
        App.get_monitors().map(OSD);
        App.get_monitors().map(CommandPrompt);
        App.get_monitors().map(NotificationPopups);
        App.get_monitors().map(LogoutManager);
        App.get_monitors().map(ClipBoardHistory);
    },
});
