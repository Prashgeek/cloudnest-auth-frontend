/** @type {import('tailwindcss').Config} */
export default {
darkMode: ["class"],
content: ["./index.html", "./src/**/*.{js,jsx}"],
theme: {
extend: {
container: { center: true, padding: "1rem" },
colors: {
brand: { DEFAULT: "#1976D2", 50: "#E3F2FD", 100: "#BBDEFB" },
},
boxShadow: { soft: "0 10px 25px -10px rgba(0,0,0,.35)" },
backdropBlur: { xs: '2px' },
},
},
plugins: [],
}