/** @type {import('tailwindcss').Config} */
module.exports = {
    // In Tailwind v4, content detection is automatic, but you can keep this for safety
    content: [
        './pages/**/*.{js,jsx}',
        './components/**/*.{js,jsx}',
        './app/**/*.{js,jsx}',
        './src/**/*.{js,jsx}',
    ],
    // "class" strategy is handled by the @custom-variant in CSS now, 
    // but keeping this ensures legacy compatibility if needed.
    darkMode: ["class"],

    // THEME SECTION REMOVED (Handled in global.css)
    theme: {
        extend: {},
    },
    plugins: [],
}