#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from "chalk";
import fs from 'fs';
import pegaArquivo from "./index.js";
import listaValidada from "./httpValida.js";

// cli arguments config
const argv = yargs(hideBin(process.argv))
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
            describe: 'provide a path to file',
            demandOption: true,
            nargs: 1,
            type: 'string'
        },
        'validate': {
            describe: 'list URLs validated',
            type: 'boolean'
        }
    })
    .example([
        ['$0 --path ./files/text.md', 'List URLs in the given file'],
        ['$0 --path ./files/text.md --validate', 'List URLs validated']
    ])
    .showHelpOnFail(false, 'Specify --help for available options')
    .help()
    .alias('h', 'help')
    .epilog('copyright 2023')
    .argv;

const argumentos = argv;

async function imprimeLista(valida, resultado, identificador = '') {
    if (valida) {
        console.log(
            chalk.yellow('lista validada'),
            chalk.black.bgGreen(identificador),
            await listaValidada(resultado)
        );
    } else {
        console.log(
            chalk.yellow('lista de links'),
            chalk.black.bgGreen(identificador),
            resultado
        );
    }

}

async function processaTexto(argumentos) {
    const caminho = argumentos.path;
    const valida = argumentos.validate;

    try {
        fs.lstatSync(caminho);
    } catch (erro) {
        if (erro.code === 'ENOENT') {
            console.log('arquivo ou diretório não existe.');
            return;
        }

        if (erro.code === 'ERR_INVALID_ARG_TYPE') {
            console.log('nenhum caminho foi passado como argumento.');
            return;
        }
    }

    if (fs.lstatSync(caminho).isFile()) {
        const resultado = await pegaArquivo(caminho);
        imprimeLista(valida, resultado);
    } else if (fs.lstatSync(caminho).isDirectory()) {
        const arquivos = await fs.promises.readdir(caminho);
        arquivos.forEach(async (nomeDeArquivo) => {
            const lista = await pegaArquivo(`${caminho}/${nomeDeArquivo}`);
            imprimeLista(valida, lista, nomeDeArquivo);
        });
    }
}

processaTexto(argumentos);
