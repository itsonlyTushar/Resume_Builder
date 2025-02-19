const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode:'class',
  theme: {
    extend: {
      animation :{
        aurora:"aurora 60s linear infinite"
      },
      keyframes:{
        aurora:{
          from:{
            backgroundPosition:"50% 50%, 50% 50%",
          },
          to:{
            backgroundPosition: "350% 50%, 350% 50%"
          }
        }
      }
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      
    }
  },
  plugins: [
    require('@tailwindcss/forms'), // or other plugins with backdrop filters
  ],
  plugins: [addVariablesForColors, require('tailwind-scrollbar')],
}

function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
 
  addBase({
    ":root": newVars,
  });
}