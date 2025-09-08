const config = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	plugins: [],
	future: {
		hoverOnlyWhenSupported: true,
		respectDefaultRingColorOpacity: true,
		disableColorOpacityUtilitiesByDefault: true,
		removeDeprecatedGapUtilities: true,
	},
	safelist: [],
	theme: {
		screens: {
			sm: "640px",
			md: "768px",
			lg: "1024px",
			xl: "1280px",
			"2xl": "1536px",
		},
		extend: {
			maxWidth: {
				"8xl": "90rem",
				"9xl": "100rem",
			},
			gridTemplateColumns: {
				13: "repeat(13, minmax(0, 1fr))",
				14: "repeat(14, minmax(0, 1fr))",
				15: "repeat(15, minmax(0, 1fr))",
			},
			animation: {
				"pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
				"bounce-slow": "bounce 3s infinite",
			},
		},
	},
};

export default config;