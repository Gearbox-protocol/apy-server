import esbuildPluginTsc from "esbuild-plugin-tsc";

export function createBuildSettings(options) {
  return {
    platform: "node",
    entryPoints: ["main.ts"],
    outfile: "build/main.js",
    bundle: true,
    plugins: [
      esbuildPluginTsc({
        force: true,
      }),
    ],
    ...options,
  };
}
