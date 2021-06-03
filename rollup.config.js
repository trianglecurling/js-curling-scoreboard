import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

export default function makeConfig(commandOptions) {
    console.log(commandOptions);
    const plugins = [typescript()];
    let filename = "dist/scoreboard.js";
    if (commandOptions["config-prod"]) {
        plugins.push(terser());
        filename = "dist/scoreboard.min.js";
    }
    return {
        input: "scoreboard.ts",
        output: [
            {
                file: filename,
                format: "umd",
                name: "scoreboard",
            },
        ],
        plugins,
    };
}
