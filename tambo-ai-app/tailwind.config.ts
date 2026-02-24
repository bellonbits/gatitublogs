/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'zyricon-deep': '#09080b',
                'zyricon-purple': '#1a0b2e',
                'zyricon-glow': '#a855f7',
                'zyricon-text': '#d1d5db',
                'zyricon-card': 'rgba(23, 20, 28, 0.7)',
            },
            backgroundImage: {
                'zyricon-radial': 'radial-gradient(circle at center, var(--tw-gradient-from) 0%, transparent 70%)',
            },
            boxShadow: {
                'zyricon-glow': '0 0 20px rgba(168, 85, 247, 0.3)',
            },
            fontFamily: {
                'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
            }
        },
    },
    plugins: [],
}
