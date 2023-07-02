/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: 'jit',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            transitionProperty: {
                'width': 'width'
            },
            brightness: {
                25: '.25',
            }
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
    ],
}
