import { execAsync } from "astal";
import { CommandPromptItemProps } from "../CommandPromptItem";
import SearchHandler from "../utils/SearchHandler";
import Command, { commandPriority } from "./Command";

interface EmojiMap {
  [name: string]: string;
}

const emojiMap: EmojiMap = {
  smile: "😄",
  heart: "❤️",
  "thumbs up": "👍",
  fire: "🔥",
  star: "⭐",
  check: "✔️",
  wave: "👋",
  clap: "👏",
  sunglasses: "😎",
  rocket: "🚀",
  grin: "😁",
  wink: "😉",
  cry: "😢",
  angry: "😠",
  laugh: "😂",
  blush: "😊",
  thinking: "🤔",
  sleeping: "😴",
  party: "🥳",
  cool: "😎",
  hug: "🤗",
  "face with tears of joy": "😂",
  "red heart": "❤️",
  "rolling on the floor laughing": "🤣",
  "loudly crying face": "😭",
  "folded hands": "🙏",
  "face throwing a kiss": "😘",
  "smiling face with heart-eyes": "😍",
  "grinning face": "😀",
  "beaming face with smiling eyes": "😁",
  "smiling face with open mouth": "😃",
  "slightly smiling face": "🙂",
  "winking face": "😉",
  "face with tongue": "👅",
  "unamused face": "😒",
  "face with rolling eyes": "🙄",
  "smirking face": "😏",
  "zipper-mouth face": "🤐",
  "face with raised eyebrow": "🤨",
  "neutral face": "😐",
  "expressionless face": "😑",
  "pensive face": "😔",
  "confused face": "😕",
  "slightly frowning face": "🙁",
  "frowning face": " frown",
  "anguished face": "😫",
  "fearful face": "😨",
  "weary face": "😩",
  "exploding head": "🤯",
  "flushed face": "😳",
  "dizzy face": "😵",
  "astonished face": "😲",
  "yawning face": "🥱",
  "nauseated face": "🤢",
  "face vomiting": "🤮",
  "sneezing face": "🤧",
  "hot face": "🥵",
  "cold face": "🥶",
  "woozy face": "🥴",
  "face with crossed-out eyes": "😵‍💫",
  "face with head-bandage": "🤕",
  "face with medical mask": "😷",
  "face with thermometer": "🤒",
  "nerd face": "🤓",
  "face with monocle": "🧐",
  "smiling face with halo": "😇",
  "smiling face with horns": "😈",
  "smiling face with smiling eyes and three hearts": "🥰",
  "face with pleading eyes": "🥺",
  "face with open hands": "🤗",
  "clapping hands": "👏",
  "thumbs down": "👎",
  "ok hand": "👌",
  "raised fist": "✊",
  "left-facing fist": "🤛",
  "right-facing fist": "🤜",
  "crossed fingers": "🤞",
  "victory hand": "✌️",
  "love-you gesture": "🤟",
  "raising hands": "🙌",
  "open hands": "👐",
  "writing hand": "✍️",
  "nail polish": "💅",
  selfie: "🤳",
  "flexed biceps": "💪",
  ear: "👂",
  nose: "👃",
  eye: "👁️",
  eyes: "👀",
  brain: "🧠",
  tongue: "👅",
  mouth: "👄",
  tooth: "🦷",
  bone: "🦴",
  "heart eyes": "😍",
  sparkles: "✨",
  "party popper": "🎉",
  balloon: "🎈",
  "confetti ball": "🎊",
  "sparkling heart": "💖",
  "growing heart": "💗",
  "beating heart": "💓",
  "revolving hearts": "💞",
  "two hearts": "💕",
  "heart decoration": "❣",
  "broken heart": "💔",
  "exclamation mark": "❗",
  "question mark": "❓",
  "white question mark ornament": "❔",
  "white exclamation mark ornament": "❕",
  "double exclamation mark": "‼",
  "question mark and exclamation mark": "⁉️",
  "hundred points symbol": "💯",
  "anger symbol": "💢",
  "collision symbol": "💥",
  "dizzy symbol": "💫",
  "sweat droplets": "💦",
  "dashing away": "💨",
  "pile of poo": "💩",
  "grinning face with star eyes": "🤩",
  "face with hand over mouth": "🤭",
  "face with open eyes and hand over mouth": "🫣",
  "saluting face": "🫡",
  "dotted line face": "😶‍🌫️",
  "shaking face": " shaking face",
  "face holding back tears": "🥺",
  "melting face": "🫠",
  "face with bags under eyes": "🥹",
  "upside-down face": "🙃",
};

export default class EmojiPickerCommand implements Command {
  searchHandler = new SearchHandler(Object.keys(emojiMap));

  getPriority(): commandPriority {
    return commandPriority.LOW;
  }

  parseInput(input: string): CommandPromptItemProps[] {
    if (!input.startsWith(":")) {
      return [];
    }

    const emojiStrings = this.searchHandler.search(input.slice(1));

    const emojis = emojiStrings.map((emoji) => {
      return {
        execute: () => {
          execAsync(["bash", "-c", `echo -n "${emojiMap[emoji]}" | wl-copy`]);
        },
        iconName: emojiMap[emoji],
        iconIsText: true,
        value: emoji.slice(0, 1).toLocaleUpperCase() + emoji.slice(1),
      } as CommandPromptItemProps;
    });

    return emojis;
  }
}
