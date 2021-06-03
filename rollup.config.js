import typescript from "@rollup/plugin-typescript";

export default {
    input: "scoreboard.ts",
    output: {
        dir: "output",
        format: "umd",
        name: "scoreboard"
    },
    plugins: [typescript()],
};
