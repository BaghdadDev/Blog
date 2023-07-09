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
            },
            fontFamily: {
                "BacasimeAntique": ['BacasimeAntique-Regular', 'sans-serif'],
                "FiraSans": ['FiraSans-Regular', 'sans-serif'],
            },
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
    ],
}
