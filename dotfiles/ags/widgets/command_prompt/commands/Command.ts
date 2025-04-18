import { CommandPromptItemProps } from "../CommandPromptItem";

export enum commandPriority {
    LOW,
    MEDIUM,
    HIGH,
}

export default interface Command {
    getPriority(): commandPriority;
    parseInput(input: string): CommandPromptItemProps[];
}
