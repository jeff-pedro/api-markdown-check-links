#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from "chalk";
import fs from 'fs';
import getFile from "./index.js";
import validatedList from "./httpValidate.js";
import { fileOrDirectoryNotFound, argumentError } from './error.js';

// cli arguments config
const args = yargs(hideBin(process.argv))
    .usage('Usage: $0 <command> [options]')
    .command([
        {
            command: '--path <file_path>',
            describe: 'List URLs founded in a markdown file'
        }, {
            command: '--path <file_path> --validate',
            describe: 'Validade URLs in a markdown file'
        }
    ])
    .options({
        'path': {
            alias: 'p',
            describe: 'Provide a path to file',
            demandOption: true,
            nargs: 1,
            type: 'string'
        },
        'validate': {
            describe: 'List validated URLs',
            type: 'boolean'
        }
    })
    .example([
        ['$0 --path ./files/text.md', 'List URLs in the given file'],
        ['$0 --path ./files/text.md --validate', 'List validated URLs']
    ])
    .showHelpOnFail(false, 'Specify --help for available options')
    .help()
    .alias('h', 'help')
    .epilog('copyright 2023')
    .argv;

async function printList(validate, result, identifier = '') {
    if (validate) {
        console.log(
            chalk.yellow('list validated'),
            chalk.black.bgGreen(identifier),
            await validatedList(result)
        );
    } else {
        console.log(
            chalk.yellow('links list'),
            chalk.black.bgGreen(identifier),
            result
        );
    }

}

async function processText(args) {
    const path = args.path;
    const validate = args.validate;

    try {
        fs.lstatSync(path);
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log(fileOrDirectoryNotFound(err));
            return;
        }

        if (err.code === 'ERR_INVALID_ARG_TYPE') {
            argumentError(err);
            return;
        }
    }

    if (fs.lstatSync(path).isFile()) {
        const listLinks = await getFile(path);
        printList(validate, listLinks);
    } else if (fs.lstatSync(path).isDirectory()) {
        const files = await fs.promises.readdir(path);
        files.forEach(async (fileName) => {
            const listLinks = await getFile(`${path}/${fileName}`);
            printList(validate, listLinks, fileName);
        });
    }
}

processText(args);
