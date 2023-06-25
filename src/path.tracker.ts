import { getListOfDIRAndFiles, isDIR } from "./shell";
import { TrackPathStatus } from "./templates";

export const trackPath = (
    toFind: string,
    rootPath: string = process.cwd(),
    excludeSearchIn = ["node_modules"],
    paths: string[] = []
): TrackPathStatus => {
    const listOfDIRAndFiles: string[] = getListOfDIRAndFiles(rootPath);

    for (let currentDIROrFile of listOfDIRAndFiles) {
        if (excludeSearchIn.includes(currentDIROrFile)) continue;

        const currentPath = rootPath + "/" + currentDIROrFile;

        if (isDIR(currentDIROrFile)) {
            trackPath(toFind, currentPath, excludeSearchIn, paths);
        }

        if (currentDIROrFile === toFind) paths.push(currentPath);
    }

    const trackStatus =
        paths.length !== 0
            ? {
                  code: 1,
                  paths: [...paths],
              }
            : {
                  code: 0,
                  paths: null,
              };

    return trackStatus;
};
