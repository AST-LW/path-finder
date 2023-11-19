import path from "path";

import { getListOfDIRAndFiles, isDIR } from "./shell";

interface TrackPathStatus {
    code: number;
    paths: string[] | null;
    message?: string;
}

/**
 * Helper function for tracking a path.
 * Recursively searches through directories to find the specified file or directory.
 *
 * @param {string} toFind - The name of the file or directory to find.
 * @param {string} rootPath - The root path from where to start the search.
 * @param {string[]} excludeSearchIn - Array of directories to exclude from the search.
 * @param {string[]} paths - Accumulator for storing found paths.
 * @returns {TrackPathStatus} Status of the search.
 */
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

/**
 * Gets the root path of the current working directory.
 *
 * @returns {string} The current working directory.
 *
 * @example
 * // Returns the root path of the current Node.js process
 * const rootPath = trackRootPath();
 */
export const trackRootPath = (): string => {
    return process.cwd();
};

/**
 * Tracks a relative path from the root directory.
 * It searches for paths that include the specified relative path segment.
 * The function is useful when you know part of the path and need to find full absolute paths that include this segment.
 * It returns a status code indicating the result of the search:
 * - code 1: One or more matching paths are found.
 * - code 0: No matching paths are found.
 *
 * @param {string} relativePathSegment - The relative path segment to find.
 * @param {string} [rootPath=process.cwd()] - The root path from where to start the search.
 * @param {string[]} [excludeSearchIn=["node_modules"]] - Directories to exclude from search.
 * @param {string[]} [paths=[]] - Initial accumulator for paths.
 * @returns {TrackPathStatus} Status of the search, including found paths if any.
 *
 * @example
 * // Example 1: Finds paths that include the segment '/index.js'
 * const relativeSearchResult1 = trackRelativePath('/index.js');
 * // relativeSearchResult1 might return an object like:
 * // {
 * //   code: 1,
 * //   paths: [
 * //     '/path/to/project/dist/index.js',
 * //     '/path/to/project/playground/src/component-1/index.js'
 * //     '/path/to/project/playground/src/component-2/index.js'
 * //   ]
 * // }
 *
 * @example
 * // Example 2: Search for a segment that does not exist
 * const relativeSearchResult2 = trackRelativePath('/non-existent-path');
 * // relativeSearchResult2 would return:
 * // {
 * //   code: 0,
 * //   paths: null
 * // }
 */
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
        trackedPaths.paths = trackedPaths.paths
            ?.map((path) => {
                // Matching path and relative path segment
                if (path.includes(relativePathSegment)) {
                    return path;
                }
            })
            .filter((path) => path !== undefined) as string[];

        // paths are found, but after performing the filter operation we do get [] empty array as there is no match for the relative path segment, hence if not match is found handle make it null
        if (trackedPaths.paths.length === 0) trackedPaths.paths = null;
        return trackedPaths;
    }
};
