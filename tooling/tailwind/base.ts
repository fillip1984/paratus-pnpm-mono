import type { Config } from "tailwindcss";

export default {
  content: ["src/**/*.{ts,tsx}"],
  theme: {
    colors: {
      primary: "#6E7E85",
      secondary: "#E2E2E2",
      accent: "#B7CECE",
      accent2: "#BBBAC6",
      black: "#1a1f16",
      white: "#fff",
      danger: "#EB4C7C",
      calm: "hsl(262, 73%, 41%)",
      warning: "#F0E3B2",
      // see: https://coolors.co/1a1f16-1e3f20-345830-4a7856-94ecbe
    },

    // extend: {
    //   colors: {
    //     border: "hsl(var(--border))",
    //     input: "hsl(var(--input))",
    //     ring: "hsl(var(--ring))",
    //     background: "hsl(var(--background))",
    //     foreground: "hsl(var(--foreground))",
    //     primary: {
    //       DEFAULT: "hsl(var(--primary))",
    //       foreground: "hsl(var(--primary-foreground))",
    //     },
    //     secondary: {
    //       DEFAULT: "hsl(var(--secondary))",
    //       foreground: "hsl(var(--secondary-foreground))",
    //     },
    //     destructive: {
    //       DEFAULT: "hsl(var(--destructive))",
    //       foreground: "hsl(var(--destructive-foreground))",
    //     },
    //     muted: {
    //       DEFAULT: "hsl(var(--muted))",
    //       foreground: "hsl(var(--muted-foreground))",
    //     },
    //     accent: {
    //       DEFAULT: "hsl(var(--accent))",
    //       foreground: "hsl(var(--accent-foreground))",
    //     },
    //     popover: {
    //       DEFAULT: "hsl(var(--popover))",
    //       foreground: "hsl(var(--popover-foreground))",
    //     },
    //     card: {
    //       DEFAULT: "hsl(var(--card))",
    //       foreground: "hsl(var(--card-foreground))",
    //     },
    //   },
    //   borderColor: {
    //     DEFAULT: "hsl(var(--border))",
    //   },
    // },
  },
} satisfies Config;
