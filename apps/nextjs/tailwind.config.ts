import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

// This doesn't seem to work and I don't know why
// import baseConfig from "@acme/tailwind-config/web";
import webConfig from "../../tooling/tailwind/web";

export default {
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  content: [...webConfig.content, "../../packages/ui/src/*.{ts,tsx}"],
  presets: [webConfig],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...fontFamily.mono],
      },
    },
  },
} satisfies Config;
