module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["DM Sans", "sans-serif"],
      serif: ["rotunda-variable", "serif"],
    },
    screens: {
      xs: "384px",
      "3xl": "2024px",
    },
    extend: {
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "24px",
        6: "32px",
        7: "48px",
      },
      width: {
        128: "445px",
      },
      colors: {
        // primaries
        "primary-blue-900": "#264A79",
        "primary-blue-800": "#336699",
        "primary-blue-700": "#3b76ab",
        "primary-blue-600": "#4687bc",
        "primary-blue-500": "#4f95c9",
        "primary-blue-400": "#62a3d0",
        "primary-blue-300": "#79b3d7",
        "primary-blue-200": "#9ac8e3",
        "primary-blue-100": "#bfddee",
        "primary-blue-50": "#e5f1f7",

        // secondaries
        "cherry-red-500": "#de0041",
        "cherry-red-400": "#e6305b",
        "cherry-red-300": "#ee5576",
        "cherry-red-200": "#f6869c",
        "cherry-red-100": "#fcb5c3",
        "cherry-red-50": "#fee2e7",

        "white-900": "#3c3c3c",
        "white-800": "#606060",
        "white-700": "#818181",
        "white-600": "#979797",
        "white-500": "#c2c2c2",
        "white-400": "#dedede",
        "white-300": "#f0f0f0",
        "white-200": "#f5f5f5",
        "white-100": "#fafafa",
        "white-50": "#ffffff",

        "system-blue-200": "#c6d2fd",
      },
      breakpoints: {
        xs: "384px",
      },

      gridTemplateColumns: {
        "60/40": "6fr 4fr",
        header: "minmax(0, 1fr) auto minmax(0, 1fr)",
      },

      // When adding a font size, add classes for *all* breakpoints (i.e. -mobile, -xl) to reduce
      // cognitive load when using in app
      fontSize: {
        "special-heading-1": ["90px"],
        "special-heading-2": ["72px", "80px"],
        "special-heading-3": ["44px", "50px"],
        "special-heading-4": ["28px", "38px"],

        "heading-1": ["56px", "66px"],
        "heading-2": ["36px", "46px"],
        "heading-3": ["24px", "34px"],
        "heading-4": ["22px", "28px"],
        "heading-5": ["18px", "24px"],
        "heading-6": ["16px", "22px"],

        "body-large": ["22px", "36px"],
        "body-medium": ["18px", "30px"],
        "body-small": ["16px", "28px"],
        "body-tiny": ["12px", "24px"],

        "text-single-400": ["22px"],
        "text-single-300": ["20px"],
        "text-single-200": ["18px"],
        "text-single-100": ["16px"],

        "text-single-upper-400": ["24px", "26px"],
        "text-single-upper-300": ["20px", "22px"],
        "text-single-upper-200": ["18px", "20px"],
        "text-single-upper-100": ["16px", "18px"],

        "text-bold": ["18px", "30px"],
        "text-link": ["18px", "30px"],
        "text-bullet": ["18px", "30px"],
        "text-numbered": ["18px", "30px"],
      },
    },
  },
  variants: {
    extend: {},
  },
  experimental: {
    darkModeVariant: true,
    applyComplexClasses: true,
  },
  dark: "class",
  darkMode: "class",
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwind-children"),
    require("nightwind"),
  ],
};
