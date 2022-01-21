#!/usr/bin/env node

const recursive = require('recursive-readdir');
const path = require('path');
const { promises: fs} = require('fs');
const chalk = require('chalk');
const boxen = require('boxen');
const yargs = require('yargs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { rollup } = require('rollup');
const typescript = require('@rollup/plugin-typescript');
const css = require('rollup-plugin-import-css');
const { default: resolve } = require('@rollup/plugin-node-resolve');


const options = yargs
    .usage('Usage: $0 [options]')
    .option('a', {
        alias: 'avionics',
        describe: 'Build the avionics package',
        type: 'boolean',
    })
    .option('p', {
        alias: 'package',
        describe: 'Build the MSFS package',
        type: 'boolean',
    })
    .epilog('Running with no options will do all steps, building with options will only do the options selected.')
    .argv;

const { a: avionicsBuildRequested, p: packageBuildRequested } = options;
const instrumentInputRoot = `${__dirname}/b732-avionics/instruments`;
const instrumentOutputRoot = `${__dirname}/PackageSources/html_ui/Pages/VCockpit/Instruments`;
const greeting = chalk.white.bold('Idle Aviation - Boeing 737-200 - Building...');

const boxenOptions = {
 padding: 0,
 margin: 0,
 borderStyle: 'round',
 borderColor: 'green',
 backgroundColor: 'black',
};

const boxenError = { ...boxenOptions };
boxenError.borderColor = 'red';

const log = (message) => {
    process.stdout.write(message);
}

const createTemplates = async () => {
    const templates = [];
    const files = await recursive(instrumentOutputRoot, ['tsconfig.tsbuildinfo', '*.css']);
    files.forEach((file) => {
        const fileInfo = file.split(path.sep);
        const templateId = fileInfo.pop().replace('.js', '') || false;

        if (templateId) {
            const template = `<script type="text/html" id="${templateId}"><div id="InstrumentContent"></div></script><link rel="stylesheet" href="${templateId}.css" /><script type="text/html" import-script="${templateId}.js"></script>`;
            templates.push({
                template,
                templateId,
                filePath: fileInfo.join(path.sep),
            });
        } else {
            log(chalk.red(`no templateId found for ${file}`));
        }
    });

    const writePromises = templates.map(({ template, templateId, filePath}) => {
        const fileName = `${filePath}/template.html`;
        return fs.writeFile(fileName, template);
    });

    return Promise.all(writePromises);
}

const buildAvionics = async () => {
    let success = true;
    console.log(chalk.green.bold('Building Avionics...'));
    try {
        const instrumentFiles = await recursive(instrumentInputRoot, ['*.component.tsx', '*.css']);
        const instrumentsToBuild = instrumentFiles.map((file) => {
            const fileInfo = file.split(path.sep);
            const fileName = fileInfo.pop().replace('.tsx', '');
            const inputFilePath = fileInfo.join('/');
            const outputFilePath = inputFilePath.replace(instrumentInputRoot.replace(/\\/g, "/"), instrumentOutputRoot.replace(/\\/g, "/"));

            return {
                inputOptions: {
                    input: `${inputFilePath}/${fileName}.tsx`,
                    plugins: [css({ output: `${fileName}.css` }), resolve(), typescript({
                        outputToFilesystem: true,
                    })],
                },
                outputOptions: {
                    file: `${outputFilePath}/${fileName}.js`,
                    format: 'es',
                    name: fileName,
                },
            };
        });
        console.log(instrumentsToBuild);
        log(chalk.green.bold(`Bundling ${instrumentFiles.length} Instruments...`));
        const bundles = instrumentsToBuild.map((build) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const bundle = await rollup(build.inputOptions);
                    resolve({
                        bundle,
                        outputOptions: build.outputOptions,
                    });
                } catch (e) {
                    reject(`Bundling failed for ${build.inputOptions.input}\n${e}`);
                }
            });
        });
        const bundleResults = await Promise.all(bundles);
        console.log(chalk.green.bold('Done!'));
        log(chalk.green.bold('Building Instruments...'));
        const outputs = bundleResults.map(({ bundle, outputOptions }) => bundle.generate(outputOptions));
        await Promise.all(outputs);
        console.log(chalk.green.bold('Done!'));
    } catch (e) {
        success = false;
        console.log(boxen(`${chalk.red.bold('Error Building Avionics!')}\n${e}\n`, boxenError))
    }

    try {
        log(chalk.green.bold('Creating Instrument Templates...'));
        await createTemplates();
        console.log(chalk.green.bold('Done!'));
    } catch (e) {
        success = false;
        console.log(boxen(`${chalk.red.bold('Error creating templates!')}\n${e}\n`, boxenError));
    }

    success && console.log(boxen(chalk.white.bold('Avionics Built Successfully!'), boxenOptions));
}

const buildPackage = async () => {
    log(chalk.green.bold('Building MSFS Package...'));
    // TODO: Figure out how this works on the CLI.
    console.log(chalk.green.bold('Done!'))
}

(async function () {

    console.log(boxen( greeting, boxenOptions ));
    const shouldBuildAvionics = avionicsBuildRequested || !packageBuildRequested;
    const shouldBuildPackage = packageBuildRequested || !avionicsBuildRequested;
    shouldBuildAvionics && await buildAvionics();
    shouldBuildPackage && await buildPackage();
    console.log(boxen(chalk.white.bold('Build Complete - Good luck, we\'re all counting on you!'), boxenOptions));
})();

