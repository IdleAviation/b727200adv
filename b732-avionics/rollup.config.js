import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-import-css';

export default {
  input: 'b732_pfd.tsx',
  output: {
    dir: 'build',
    format: 'es'
  },
  plugins: [css({ output: 'b732_pfd.css' }), resolve(), typescript()]
}