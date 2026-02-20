/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./layouts/**/*.html",
        "./content/**/*.md",
        "./content/**/*.html",
        "./assets/**/*.js",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#06b6d4', // cyan-500
                    dark: '#0891b2', // cyan-600
                },
                background: {
                    light: '#f8fafc', // slate-50
                    dark: '#0f172a', // slate-900
                },
                surface: {
                    light: '#ffffff', // white
                    dark: '#1e293b', // slate-800
                }
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'soft-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
