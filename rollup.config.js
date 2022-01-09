import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-import-css';

export default {
  input: 'X:\\727\\b727200adv\\b732-avionics\\instruments\\EFB\\b732-efb.tsx',
  output: {
    file: 'X:\\727\\b727200adv\\PackageSources\\html_ui\\Pages\\VCockpit\\Instruments\\EFB\\b732-efb.js',
    format: 'es',
    name: 'b732-efb'
  },
  plugins: [css({ output: 'b732-efb.css' }), resolve(), typescript({
    outputToFilesystem: true,
  })]
}