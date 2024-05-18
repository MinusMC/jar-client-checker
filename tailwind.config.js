/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
		],

	darkmode: "class",

	theme: {
		extend: {
			width: {
		        "160": "40rem"
		    }
		},
		fontFamily: {
	      	lexend: "Lexend",
	    }
	},

	plugins: [require('flowbite/plugin'), require('@tailwindcss/typography')]
};
