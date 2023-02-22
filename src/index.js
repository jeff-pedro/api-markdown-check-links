import fs from 'fs';
import chalk from 'chalk';

async function pegaArquivo(caminhoDoArquivo) {
    const encoding = 'utf-8';
    try {
        const texto = await fs.promises.readFile(caminhoDoArquivo, encoding);
        return extraiLinks(texto);
    } catch (erro) {
        trataErro(erro);
    }
}

function extraiLinks(texto) {
    const regex = /\[([^[\]]*?)\]\((https?\:\/\/[^\s?#.].[^\s]*)\)/gm;
    try {
        const captura = [...texto.matchAll(regex)];
        const resultado = captura.map(captura => ({ [captura[1]] : captura[2] }));
        return resultado.length !== 0 ? resultado : 'não há links no arquivo';
    } catch (erro) {
        trataErro(erro);
    }
}

function trataErro(erro) {
    throw new Error(chalk.red(erro.code, 'não há arquivo no diretório'));
}

export default pegaArquivo;