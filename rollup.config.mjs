import typescript from '@rollup/plugin-typescript';

// rollup.config.js
/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: './src/index.ts',
  output: {
    file: './dist/index.js',
    format: 'iife'
  },
  plugins: [typescript({ compilerOptions: { lib: ['es5', 'es6', 'dom'], target: 'es5' } })]
};
export default config;
