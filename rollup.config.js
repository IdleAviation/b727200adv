import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-import-css';

export default [
  {
    input: 'b732-avionics/instruments/Flight/Altimeter/b732-altimeter.tsx',
    output: {
      file: 'PackageSources/html_ui/Pages/VCockpit/Instruments/Flight/Altimeter/b732-flight-altimeter.js',
      format: 'es'
    },
    plugins: [css({ output: 'PackageSources/html_ui/Pages/VCockpit/Instruments/Flight/Altimeter/b732-flight-altimeter.css' }), resolve(), typescript()]
  },
  {
    input: 'b732-avionics/instruments/Flight/Airspeed/b732-airspeed.tsx',
    output: {
      file: 'PackageSources/html_ui/Pages/VCockpit/Instruments/Flight/Airspeed/b732-flight-airspeed.js',
      format: 'es'
    },
    plugins: [css({ output: 'PackageSources/html_ui/Pages/VCockpit/Instruments/Flight/Airspeed/b732-flight-airspeed.css' }), resolve(), typescript()]
  }
]