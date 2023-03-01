import chalk from 'chalk';

export function fileNotFound(err) {
    throw new Error(chalk.red(err.code, 'file not found in directory'));
}

export function fileOrDirectoryNotFound(err) {
    return 'file or directory does not exist';
}

export function argumentError(err) {
    throw new Error(chalk.red(err.code, 'no path was given as an argument'));
}