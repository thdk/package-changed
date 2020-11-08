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
            return true;
        },
    );
});

program
    .command('install', { isDefault: true })
    .option('--ci', "Run 'npm ci' instead of 'npm i'. Even when package is not changed.")
    .action(async (cmdObj) => {
        const cwd = program.cwd || process.cwd();

        await isPackageChanged(
            {
                cwd,
                hashFilename: program.hashFilename,
            },
            ({ isChanged }) => {
                if (isChanged || cmdObj.ci) {
                    execSync(cmdObj.ci ? 'npm ci' : 'npm i', {
                        stdio: 'inherit',
                        cwd,
                    });
                }
                return true;
            },
        );
    });

program.parse(process.argv);
