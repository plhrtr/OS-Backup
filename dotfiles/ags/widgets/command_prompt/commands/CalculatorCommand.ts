import { bind, execAsync, Variable } from "astal";
import { CommandPromptItemProps } from "../CommandPromptItem";
import Command, { commandPriority } from "./Command";

export default class CalculatorCommand implements Command {
    getPriority(): commandPriority {
        return commandPriority.MEDIUM;
    }

    parseInput(input: string): CommandPromptItemProps[] {
        if (!input.startsWith("=")) {
            return [];
        }

        input = input.slice(1);

        try {
            const result = Variable("loading...");
            const copyValue = Variable("");

            const resultBinding = bind(result);
            const copyValueBinding = bind(copyValue);

            execAsync(["bash", "-c", `qalc "${input}"`])
                .then((res) => {
                    result.set(res);
                    copyValue.set(res.split("=").pop()?.trim() || "");
                })
                .catch(() => result.set("Invalid expression"));

            return [
                {
                    execute: () => {
                        execAsync([
                            "bash",
                            "-c",
                            `echo "${copyValueBinding.get()}" | wl-copy`,
                        ]);
                    },
                    iconName: "calculator-app-symbolic",
                    value: resultBinding,
                } as CommandPromptItemProps,
            ];
        } catch (error) {
            return [];
        }
    }
}
