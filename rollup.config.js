'use strict';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import http from 'http';
import 'dotenv/config';

const uploadCode = code => {
    const data = {
        branch: 'default',
        modules: {
            main: code
        }
    };
    const req = http.request({
        hostname: process.env.API_HOSTNAME,
        port: process.env.API_PORT,
        path: '/api/user/code',
        method: 'POST',
        auth: process.env.API_USER_EMAIL + ':' + process.env.API_USER_PASSWORD,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    });
    req.write(JSON.stringify(data));
    req.end();
};

export default {
    input: 'src/main.ts',
    output: {
        // file: '/home/elbarae/.config/Screeps/scripts/46_101_251_59___21025/default/main.js',
        file: 'dist/main.js',
        format: 'cjs',
        sourcemap: true
    },

    plugins: [
        resolve({ rootDir: 'src' }),
        commonjs(),
        typescript({ tsconfig: './tsconfig.json' }),
        {
            name: 'upload-code',
            generateBundle(_outputOptions, bundle) {
                const entry = Object.values(bundle).find(chunk => chunk.isEntry);
                uploadCode(entry.code);
            }
        }
    ]
};
