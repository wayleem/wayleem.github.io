import type { Config } from "tailwindcss";
import { colors } from "./app/static/colors";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				title: ["var(--font-poppins)"],
				body: ["var(--font-inter)"],
				nav: ["var(--font-work-sans)"],
			},
			colors: {
				green: {
					primary: "#BAFFC9",
					secondary: "#d1ffd9",
					background: "#E8FFEC",
				},
				blue: {
					primary: "#BAE1FF",
					secondary: "#D1EAFF",
					background: "#E8F4FF",
				},
				yellow: {
					primary: "#FFFFBA",
					secondary: "#FFFFD1",
					background: "#FFFFE8",
				},
				orange: {
					primary: "#FFDFBA",
					secondary: "#ffd4a6",
					background: "#FFF4E8",
				},
				pink: {
					primary: "#FFB3BA",
					secondary: "#ff99a6",
					background: "#FFE8EC",
				},
				purple: {
					primary: "#E1BAFF",
					secondary: "#EACFFF",
					background: "#F4E8FF",
				},
			},
			screens: {
				"3xl": "1600px", // Very large desktops
				"4xl": "1920px", // Ultra-wide screens
				"5xl": "2560px", // Beyond ultra-wide screens
			},
		},
	},
	plugins: [require("daisyui")],
};

export default config;
