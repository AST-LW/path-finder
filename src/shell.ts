import shelljs from "shelljs";

/**
 * Creates a directory at the specified path.
 * 
 * @param {string} destinationPath - The path where the directory is to be created.
 * @returns {boolean} - True if the directory is successfully created, false otherwise.
 */
export const createDIR = (destinationPath: string): boolean => {
    return shelljs.mkdir(destinationPath).code === 0 ? true : false;
};

/**
 * Deletes a directory at the specified path. This deletion is recursive and forceful.
 * 
 * @param {string} dirPath - The path of the directory to be deleted.
 * @returns {boolean} - True if the directory is successfully deleted, false otherwise.
 */
export const deleteDIR = (dirPath: string): boolean => {
    return shelljs.rm("-rf", dirPath).code === 0 ? true : false;
};

/**
 * Creates a file at the specified path.
 * 
 * @param {string} filePath - The path where the file is to be created.
 * @returns {boolean} - True if the file is successfully created, false otherwise.
 */
export const createFile = (filePath: string) => {
    return shelljs.touch(filePath).code === 0 ? true : false;
};

/**
 * Deletes a file or multiple files. If the `multiple` flag is true, it can delete multiple files.
 * 
 * @param {string|string[]} filePath - The path or an array of paths of the file(s) to be deleted.
 * @param {boolean} [multiple=false] - Flag to indicate if multiple files are to be deleted.
 * @returns {boolean} - True if the file(s) are successfully deleted, false otherwise.
 */
const deleteFile = (filePath: string | string[], multiple: boolean = false) => {
    if (multiple) {
        if (typeof filePath === "string") {
            return shelljs.rm(filePath).code === 0 ? true : false;
        } else {
            return shelljs.rm(...filePath).code === 0 ? true : false;
        }
    }
};

/**
 * Retrieves a list of directories and files at the specified path.
 * 
 * @param {string} path - The path from which to list directories and files.
 * @returns {string[]} - An array of names of directories and files in the specified path.
 */
export const getListOfDIRAndFiles = (path: string): string[] => {
    return shelljs.ls(path).map((item) => item.toString());
};

/**
 * Checks if the specified path is a directory.
 * 
 * @param {string} dirPath - The path to check.
 * @returns {boolean} - True if the path is a directory, false otherwise.
 */
export const isDIR = (dirPath: string): boolean => {
    shelljs.config.silent = true;
    return shelljs.test("-d", dirPath);
};
