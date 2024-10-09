import type { Config } from "tailwindcss";

export default {
  content: ["src/**/*.{ts,tsx}"],
  theme: {
    colors: {
      primary: "hsl(10, 74%, 60%)", //imperial red
      secondary: "hsl(6, 77%, 62%)", // bittersweet
      background: "hsl(0, 0%, 24%)", //onyx
      // primary: "#6E7E85",
      // secondary: "#E2E2E2",
      // accent: "#B7CECE",
      // accent2: "#BBBAC6",
      black: "hsl(0, 0%, 0%)", // Black
      white: "hsl(55, 34%, 87%)", //eggshell
      gray: "hsl(210, 17%, 35%)", //Payne's gray
      danger: "hsl(358, 100%, 56%)", //Red (CMYK)
      warning: "hsl(54, 63%, 71%", // Flax
      success: "hsl(133, 31%, 69%)", // Celadon
      info: "hsl(208, 52%, 83%)", // Columbia blue
    },
  },
} satisfies Config;
