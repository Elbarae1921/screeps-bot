'use strict';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

export default {
    input: 'src/main.ts',
    output: {
        file: '/home/elbarae/.config/Screeps/scripts/46_101_251_59___21025/default/main.js',
        format: 'cjs',
        sourcemap: true
    },

    plugins: [
        resolve({ rootDir: 'src' }),
        commonjs(),
        typescript({ tsconfig: './tsconfig.json' })
    ]
};
