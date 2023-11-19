import { trackRootPath, trackRelativePath } from "../src/path.tracker";
import { createDIR, createFile, deleteDIR } from "../src/shell";

describe("Path Tracer Suite", () => {
    const rootPath = trackRootPath();
    const playgroundPath = `${rootPath}/playground`;

    beforeEach(() => {
        // Ensure the playground directory is clean before each test
        deleteDIR(playgroundPath);
        createDIR(playgroundPath);

        // Setup a complex directory structure
        createDIR(`${playgroundPath}/dir`);
        createDIR(`${playgroundPath}/dir/dir1`);
        createDIR(`${playgroundPath}/dir/dir2`);
        createFile(`${playgroundPath}/dir/dir1/file1.txt`);
        createFile(`${playgroundPath}/dir/dir2/file1.txt`);

        createDIR(`${playgroundPath}/existingDir`);

        createDIR(`${playgroundPath}/complexDir`);
        createDIR(`${playgroundPath}/complexDir/subDir1`);
        createDIR(`${playgroundPath}/complexDir/subDir2`);
        createDIR(`${playgroundPath}/complexDir/subDir2/dir`);
        createFile(`${playgroundPath}/complexDir/subDir1/fileA.js`);
        createFile(`${playgroundPath}/complexDir/subDir2/fileA.js`);

        createDIR(`${playgroundPath}/config`);
        createFile(`${playgroundPath}/config/settings.json`);
    });

    afterEach(() => {
        // Clean up after each test
        deleteDIR(playgroundPath);
    });

    it("Single file found", () => {
        const tracedPath = trackRelativePath("/settings.json");
        expect(tracedPath.code).toBe(1);
        expect(tracedPath.paths).toContain(`${playgroundPath}/config/settings.json`);
    });

    it("Multiple files found", () => {
        const tracedPath = trackRelativePath("/fileA.js");
        expect(tracedPath.code).toBe(1);
        expect(tracedPath.paths).toEqual(expect.arrayContaining([
            `${playgroundPath}/complexDir/subDir1/fileA.js`,
            `${playgroundPath}/complexDir/subDir2/fileA.js`
        ]));
    });

    it("Single directory found", () => {
        const tracedPath = trackRelativePath("/existingDir");
        expect(tracedPath.code).toBe(1);
        expect(tracedPath.paths).toContain(`${playgroundPath}/existingDir`);
    });

    it("Multiple directories found", () => {
        const tracedPath = trackRelativePath("/dir");
        expect(tracedPath.code).toBe(1);
        expect(tracedPath.paths).toEqual(expect.arrayContaining([
            `${playgroundPath}/dir`,
            `${playgroundPath}/complexDir/subDir2/dir`
        ]));
    });

    it("No file or directory found (code 0)", () => {
        const tracedPath = trackRelativePath("/nonexistent.txt");
        expect(tracedPath.code).toBe(0);
        expect(tracedPath.paths).toBeNull();
    });

    it("Directory exists but file not found (code 0)", () => {
        const tracedPath = trackRelativePath("/existingDir/nonexistent.txt");
        expect(tracedPath.code).toBe(0);
        expect(tracedPath.paths).toBeNull();
    });

    it("Restricted search area with root path", () => {
        const restrictedSearchResult = trackRelativePath("/file1.txt", `${playgroundPath}/dir/dir1`);
        expect(restrictedSearchResult.code).toBe(1);
        expect(restrictedSearchResult.paths).toContain(`${playgroundPath}/dir/dir1/file1.txt`);
    });

    it("Using excludeSearchIn to exclude directories", () => {
        const excludeSearchResult = trackRelativePath("/fileA.js", rootPath, ['complexDir/subDir2']);
        expect(excludeSearchResult.code).toBe(1);
        expect(excludeSearchResult.paths).toContain(`${playgroundPath}/complexDir/subDir1/fileA.js`);
    });
});
