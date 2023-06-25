import shelljs from "shelljs";

export const createDIR = (destinationPath: string): boolean => {
    return shelljs.mkdir(destinationPath).code === 0 ? true : false;
};
export const deleteDIR = (dirPath: string): boolean => {
    return shelljs.rm("-rf", dirPath).code === 0 ? true : false;
};

export const createFile = (filePath: string) => {
    return shelljs.touch(filePath).code === 0 ? true : false;
};

/**
 * Passing multiple = true, we authorize the method to perform multiple file delete action
 * @param {string} filePath
 * @param {boolean} multiple
 * @returns boolean indicating success or failure of shell operation
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

export const getListOfDIRAndFiles = (path: string): string[] => {
    return shelljs.ls(path).map((item) => item.toString());
};

export const isDIR = (dirPath: string): boolean => {
    shelljs.config.silent = true;
    return shelljs.test("-d", dirPath);
};
