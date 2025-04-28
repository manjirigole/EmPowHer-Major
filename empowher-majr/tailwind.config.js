/**@type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      lineHeight: {
        "22px": "22px",
        "36px": "36px",
      },
      colors: {
        primary: "#EFDFFF",
        primary_pink800: "#830047",
        secondary: {
          DEFAULT: "#FF9C01",
          100: "#FF9001",
          200: "#FF8E01",
          500: "#FBD1DF",
          600: "#DC3C68",
          700: "#A7044F",
          900: "#84063A",
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          100: "#CDCDE0",
        },
        pink: {
          300: "#F18CAB",
          400: "#E2105B",
        },
        primary_text: {
          brown: "#300000",
        },
        secondary_text: {
          brownLight: "#977F7E",
        },
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],

        cblack: ["CrimsonPro-Black", "sans-serif"],
        cbold: ["CrimsonPro-Bold", "sans-serif"],
        cextrabold: ["CrimsonPro-ExtraBold", "sans-serif"],
        cextralight: ["CrimsonPro-ExtraLight", "sans-serif"],
        clight: ["CrimsonPro-Light", "sans-serif"],
        cmedium: ["CrimsonPro-Medium", "sans-serif"],
        cregular: ["CrimsonPro-Regular", "sans-serif"],
        csemibold: ["CrimsonPro-SemiBold", "sans-serif"],

        iblack18: ["Inter_18pt-Black", "sans-serif"],
        iextrabold18: ["Inter_18pt-ExtraBold", "sans-serif"],
        ibold18: ["Inter_18pt-Bold", "sans-serif"],
        imedium18: ["Inter_18pt-Medium", "sans-serif"],
        iregular18: ["Inter_18pt-Regular", "sans-serif"],

        iblack24: ["Inter_24pt-Black", "sans-serif"],
        iextrabold24: ["Inter_24pt-ExtraBold", "sans-serif"],
        ibold24: ["Inter_24pt-Bold", "sans-serif"],
        imedium24: ["Inter_24pt-Medium", "sans-serif"],
        iregular24: ["Inter_24pt-Regular", "sans-serif"],

        iblack28: ["Inter_28pt-Black", "sans-serif"],
        iextrabold28: ["Inter_28pt-ExtraBold", "sans-serif"],
        ibold28: ["Inter_28pt-Bold", "sans-serif"],
        imedium28: ["Inter_28pt-Medium", "sans-serif"],
        iregular28: ["Inter_28pt-Regular", "sans-serif"],
      },
    },
  },
  plugins: [],
};
