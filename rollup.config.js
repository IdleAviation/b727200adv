import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-import-css';

const outputPathRoot = `${__dirname}/PackageSources/html_ui/Pages/VCockpit/Instruments`;
export default [
  {
    input: 'b732-avionics/instruments/EFB/b732-efb.tsx',
    output: {
      file: `${outputPathRoot}/EFB/b732-efb.js`,
      format: 'es',
      name: 'b732-efb'
    },
    plugins: [css({ output: 'b732-efb.css' }), resolve(), typescript()]
  },
  {
    input: 'b732-avionics/instruments/Flight/Altimeter/b732-altimeter.tsx',
    output: {
      file: `${outputPathRoot}/Flight/Altimeter/b732-flight-altimeter.js`,
      format: 'es',
      name: 'b732-flight-altimeter'
    },
    plugins: [css({ output: 'b732-flight-altimeter.css' }), resolve(), typescript()]
  },
  {
    input: 'b732-avionics/instruments/Flight/Airspeed/b732-airspeed.tsx',
    output: {
      file: `${outputPathRoot}/Flight/Airspeed/b732-flight-airspeed.js`,
      format: 'es',
      name: 'b732-flight-airspeed'
    },
    plugins: [css({ output: 'b732-flight-airspeed.css' }), resolve(), typescript()]
  }
];
