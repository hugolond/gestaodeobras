/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",   
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements-react/dist/js/**/*.js",
  ],
  theme: {
  	extend: {
  		colors: {
  			'grey-10': 'var(--grey-10)',
  			'sucess': 'var(--green-2010)',
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			card: {
  				DEFAULT: 'var(--card)',
  				foreground: 'var(--card-foreground)'
  			},
  			popover: {
  				DEFAULT: 'var(--popover)',
  				foreground: 'var(--popover-foreground)'
  			},
  			primary: {
  				DEFAULT: 'var(--primary)',
  				foreground: 'var(--primary-foreground)'
  			},
  			secondary: {
  				DEFAULT: 'var(--secondary))',
  				foreground: 'var(--secondary-foreground)'
  			},
  			muted: {
  				DEFAULT: 'var(--muted)',
  				foreground: 'var(--muted-foreground)'
  			},
  			accent: {
  				DEFAULT: 'var(--accent)',
  				foreground: 'var(--accent-foreground)'
  			},
  			destructive: {
  				DEFAULT: 'var(--destructive)',
  				foreground: 'var(--destructive-foreground)'
  			},
  			border: 'var(--border)',
  			input: 'var(--input)',
  			ring: 'var(--ring)',
  			chart: {
  				'1': 'var(--chart-1)',
  				'2': 'var(--chart-2)',
  				'3': 'var(--chart-3)',
  				'4': 'var(--chart-4)',
  				'5': 'var(--chart-5)'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Open Sans',
  				'sans-serif',
  				'Manrope'
  			],
  			'h4-14-20': 'var(--h4-14-20-font-family)',
  			'h5r-12-18': 'var(--h5r-12-18-font-family)',
  			manrope: [
  				'Manrope',
  				'sans-serif'
  			]
  		},
  		minHeight: {
  			'128': '32rem'
  		},
  		spacing: {
  			'128': '32rem'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		animation: {
			"accordion-down": "accordion-down 0.2s ease-out",
			"accordion-up": "accordion-up 0.2s ease-out",
		},
		keyframes: {
			"accordion-down": {
			from: { height: "0" },
			to: { height: "var(--radix-accordion-content-height)" },
			},
			"accordion-up": {
			from: { height: "var(--radix-accordion-content-height)" },
			to: { height: "0" },
			},
		},
  	}
  },
  plugins: [require("tw-elements-react/dist/plugin.cjs",'@tailwindcss/line-clamp'), require("tailwindcss-animate")],
  darkMode: ["class", "class"]
};
