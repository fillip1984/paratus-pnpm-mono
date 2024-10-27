import type { Config } from "tailwindcss";
import formsPlugin from "@tailwindcss/forms";
import animate from "tailwindcss-animate";

import base from "./base";

export default {
  content: base.content,
  presets: [base],
  plugins: [animate, formsPlugin],
} satisfies Config;
