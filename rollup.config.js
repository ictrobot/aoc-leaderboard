import typescript from '@rollup/plugin-typescript';
import {terser} from "rollup-plugin-terser";

export default {
    input: 'src/cli.ts',
    output: {
        file: 'dist/aoc-leaderboard',
        format: 'cjs',
        banner: '#!/usr/bin/env -S node --enable-source-maps\n',
        sourcemap: 'inline'
    },
    plugins: [
        typescript({
            tsconfig: './tsconfig.rollup.json'
        }),
        terser({
            ecma: 2020,
        })
    ],
    external: [
        'https'
    ]
};
