module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "hsl(245 58% 51%)",
      },
      spacing: {
        8: "8px",
        16: "16px",
        24: "24px",
        40: "40px",
        64: "64px",
      },
      borderRadius: {
        base: "8px",
      },
      transitionDuration: {
        DEFAULT: "180",
      },
    },
  },
  plugins: [],
};

