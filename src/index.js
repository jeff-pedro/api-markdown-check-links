import fs from 'fs';
import { fileNotFound } from './error.js';

async function getFile(filePath) {
    const encoding = 'utf-8';
    try {
        const text = await fs.promises.readFile(filePath, encoding);
        return extractLink(text);
    } catch (err) {
        fileNotFound(err);
    }
}

function extractLink(text) {
    const regex = /\[([^[\]]*?)\]\((https?\:\/\/[^\s?#.].[^\s]*)\)/gm;
    try {
        const catchLinks = [...text.matchAll(regex)];
        const result = catchLinks.map(linkCaught => ({ [linkCaught[1]]: linkCaught[2] }));
        return result.length !== 0 ? result : 'no links in the file';
    } catch (err) {
        fileNotFound(err);
    }
}

export default getFile;