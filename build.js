#!/usr/bin/env node

const recursive = require('recursive-readdir');
const path = require('path');
const { promises: fs} = require('fs');
const chalk = require('chalk');
const boxen = require('boxen');
const yargs = require('yargs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

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
    .epilog('Running with no options will do all 3 steps, building with options will only do the options selected.')
    .argv;

const { a: avionicsBuildRequested, p: packageBuildRequested } = options;
const instrumentRoot = `${__dirname}/PackageSources/html_ui/Pages/VCockpit/Instruments`;
const greeting = chalk.white.bold('Idle Aviation - Boeing 737-200 - Building...');

const boxenOptions = {
 padding: 0,
 margin: 0,
 borderStyle: 'round',
 borderColor: 'green',
 backgroundColor: '#555555',
};

const log = (message) => {
    process.stdout.write(message);
}

const createTemplates = async () => {
    const templates = [];
    const files = await recursive(instrumentRoot, ['tsconfig.tsbuildinfo', '*.css']);
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
    log(chalk.green.bold('Building Avionics...'));
    try {
        await exec('node ./node_modules/fancy-rollup/dist/fancy-rollup.js -r silent');
        log(chalk.green('avionics built...'));
    } catch (e) {
        success = false;
        log(`${chalk.red.bold('Error Building Avionics!')}\n${e}\n`)
    }

    try {
        log(chalk.green('creating templates...'));
        await createTemplates();
    } catch (e) {
        success = false;
        log(`${chalk.red.bold('Error creating templates!')}\n${e}\n`);
    }

    success && console.log(chalk.green.bold('Done!'));
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
    console.log(chalk.green.bold('Build Complete!'))
})();

