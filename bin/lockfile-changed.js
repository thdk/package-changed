#!/usr/bin/env node

const { execSync } = require('child_process');
const { program } = require('commander');

const { isPackageChanged } = require('../lib/index');

program
    .option('--cwd [cwd]', 'Current working directory.')
    .option('--hash-filename [filename]', 'Filename where hash of dependencies will be written to');

program.command('run [command]', { isDefault: false }).action(async (command) => {
    const cwd = program.cwd || process.cwd();
    await isPackageChanged(
        {
            cwd,
            hashFilename: program.hashFilename,
        },
        ({ isChanged }) => {
            if (isChanged && command) {
                execSync(command, {
                    stdio: 'inherit',
                    cwd,
                });
            }
        },
    );
});

program
    .command('install', { isDefault: true })
    .option(
        '--ci',
        "Run 'npm ci' instead of 'npm i'. Even when package is not changed. Default when env.CI=true",
    )
    .option('-r, --registry <registry>', 'npm registry url to use')
    .action(async (cmdObj) => {
        const cwd = program.cwd || process.cwd();
        const {
            ci = process.env.CI === 'true',
            // registry
        } = cmdObj;
        await isPackageChanged(
            {
                cwd,
                hashFilename: program.hashFilename,
            },
            ({ isChanged }) => {
                if (isChanged) {
                    console.log(
                        `Package changed. Running 'yarn ${ci ? 'install' : 'install'}' ...`,
                    );
                    execSync(
                        `yarn ${ci ? 'install' : 'install'}`, //${registry ? ` --registry='${registry}'` : ''}`,
                        {
                            stdio: 'inherit',
                            cwd,
                            env: process.env,
                        },
                    );
                }
            },
        );
    });

program.parse(process.argv);
