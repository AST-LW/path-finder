import path from "path";

import { getListOfDIRAndFiles, isDIR } from "./shell";
import { TrackPathStatus } from "./templates";

const __trackPathHelper = (
    toFind: string,
    rootPath: string,
    excludeSearchIn: string[],
    paths: string[]
): TrackPathStatus => {
    const listOfDIRAndFiles: string[] = getListOfDIRAndFiles(rootPath);

    for (let currentDIROrFile of listOfDIRAndFiles) {
        if (excludeSearchIn.includes(currentDIROrFile)) continue;

        const currentPath = rootPath + "/" + currentDIROrFile;

        if (isDIR(currentPath)) {
            __trackPathHelper(toFind, currentPath, excludeSearchIn, paths);
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

export const trackPath = (
    toFind: string,
    rootPath: string = process.cwd(),
    excludeSearchIn = ["node_modules"],
    paths: string[] = []
): TrackPathStatus => {
    return __trackPathHelper(toFind, rootPath, excludeSearchIn, paths);
};

export const trackRelativePath = (
    relativePathSegment: string,
    rootPath: string = process.cwd(),
    excludeSearchIn = ["node_modules"],
    paths: string[] = []
): TrackPathStatus => {
    const pathContents = path.normalize(relativePathSegment).split(path.sep);
    const toFind = pathContents[pathContents.length - 1];
    const trackedPaths: TrackPathStatus = __trackPathHelper(toFind, rootPath, excludeSearchIn, paths);
    
    if (trackedPaths.code === 0) {
        return trackedPaths;
    } else {
        trackedPaths.paths = trackedPaths.paths?.map(path => {
            // Matching path and relative path segment
            if(path.includes(relativePathSegment)) {
                return path
            }
        }).filter(path => path !== undefined) as string[];

        // paths are found, but after performing the filter operation we do get [] empty array as there is no match for the relative path segment, hence if not match is found handle make it null
        if(trackedPaths.paths.length === 0) trackedPaths.paths = null;
        else if(trackedPaths.paths.length > 1) {
            trackedPaths.message = `multiple paths found, provide parent folder of "${pathContents[0]}" to get unique path`
        }

        return trackedPaths;
    }
};
