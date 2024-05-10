import type { Config } from "tailwindcss";

function getColorScale(name: string) {
	const scale = {};
	for (let i = 1; i <= 12; i++) {
		scale[i] = `var(--${name}-${i})`;
		// next line only needed if using alpha values
		scale[`a${i}`] = `var(--${name}-a${i})`;
	}

	return scale;
}

export default {
	content: ["./app/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				grade: getColorScale("slate"),
				accent: getColorScale("mauve"),
				primary: getColorScale("iris"),
				secondary: getColorScale("lime"),
				amber: getColorScale("amber"),
				jade: getColorScale("jade"),
				destructive: getColorScale("red"),
			},
		},
	},
	plugins: [
		require("tailwindcss-react-aria-components"),
		require("tailwindcss-animate"),
		require("@tailwindcss/typography"),
	],
} satisfies Config;
