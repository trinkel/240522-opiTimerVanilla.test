import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const iconsPath = 'node_modules/@shoelace-style/shoelace/dist/assets/icons';

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		open: true,
	},
	resolve: {
		alias: [
			{
				find: /\/assets\/icons\/(.+)/,
				replacement: `${iconsPath}/$1`,
			},
		],
	},
	build: {
		rollupOptions: {
			// external: /^lit/,
			external: ['./src/playground/'],
			plugins: [],
		},
	},
	plugins: [
		viteStaticCopy({
			targets: [
				{
					src: iconsPath,
					dest: 'assets',
				},
			],
		}),
	],
});
