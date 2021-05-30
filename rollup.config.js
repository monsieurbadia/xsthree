import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import rust from "@wasm-tool/rollup-plugin-rust";
import { terser } from 'rollup-plugin-terser';
import glslify from 'rollup-plugin-glslify';
import { uglify } from 'rollup-plugin-uglify';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: {
		xsthree: './graphics/xsthree/src/runtime/lib.js',
	},
	output: [{
		name: "xsthree",
		dir: './public',
		format: 'iife',
		sourcemap: production ? false : true,
	}, {
		name: "xsthree",
		dir: './examples',
		format: 'iife',
		sourcemap: production ? false : true,
	}],
	plugins: [
		resolve(),
		commonjs(),
		production && terser(),
		production && uglify(),
		glslify(),
		rust({
			serverPath: "./src/wasm",
		}),
	]
};
