import { getIconCollections, iconsPlugin } from "@egoist/tailwindcss-icons"

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./src/*.tsx"],
  plugins: [
    iconsPlugin({
      collections: getIconCollections(["material-symbols"])
    })
  ]
}
