/** @type {import('tailwindcss').Config} */
module.exports = {
    // In Tailwind v4, 
    content: [
        './pages/**/*.{js,jsx}',
        './components/**/*.{js,jsx}',
        './app/**/*.{js,jsx}',
        './src/**/*.{js,jsx}',
    ],
    darkMode: ["class"],

    // THEME SECTION REMOVED (Handled in global.css)
    theme: {
        extend: {},
    },
    plugins: [],
}