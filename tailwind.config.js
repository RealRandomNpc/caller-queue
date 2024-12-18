/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0a7ea4",
        },
        'primary-text': {
          DEFAULT: "#fff",
        },

        // secondary: {
        //   DEFAULT: "var(--color-secondary-default)",
        // },
        // accent: {
        //   DEFAULT: "var(--color-accent-default)",
        // },
        "c-bg": {
          DEFAULT: "#fff",
          darker: '#ccc'
        },
        "c-text": {
          DEFAULT: "#11181C",
        },
        "c-tab-icon-selected": {
          DEFAULT: "#0a7ea4",
        },
        "c-tab-icon-regular": {
          DEFAULT: "#687076",
        },
        "c-icon": {
          DEFAULT: "#687076",
        }
      },
    },
  },
  plugins: [],
};
