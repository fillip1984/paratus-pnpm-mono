import type { Config } from "tailwindcss";

export default {
  content: ["src/**/*.{ts,tsx}"],
  theme: {
    colors: {
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",

      black: "hsl(var(--black))",
      white: "hsl(55, 34%, 87%)",
      gray: "hsl(210, 17%, 35%)",

      primary: "hsl(var(--primary))",
      secondary: "hsl(var(--secondary))",

      danger: "hsl(var(--danger))",
      warning: "hsl(var(--warning))",
      success: "hsl(var(--success))",
      info: "hsl(var(--info))",
    },
  },
} satisfies Config;
