/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

export default {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        spoqa: ["Spoqa Han Sans Neo", "sans-serif"],
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateY(-20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        slideOut: {
          "0%": { transform: "translateY(0)", opacity: 1 },
          "100%": { transform: "translateY(-20px)", opacity: 0 },
        },
        animation: {
          slideIn: 'slideIn 0.3s ease-out',
          slideOut: 'slideOut 0.3s ease-out',
        },
      },
    },
  },
  plugins: [
    plugin(({ theme, addUtilities }) => {
      const neonUtilities = {};
      const colors = theme("colors");
      for (const color in colors) {
        if (typeof colors[color] === "object") {
          const color1 = colors[color]["500"];
          const color2 = colors[color]["700"];
          neonUtilities[`.neon-${color}`] = {
            boxShadow: `0 0 10px ${color1}, 0 0 20px ${color2}`,
          };
        }
      }
      addUtilities(neonUtilities);
    }),
  ],
};
