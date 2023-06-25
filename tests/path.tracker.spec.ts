import { trackPath } from "../src/path.tracker";
import { createDIR, createFile, deleteDIR } from "../src/shell";
import { TrackPathStatus } from "../src/templates";

describe("Path Tracer Suite", () => {
    it("Path existence for file - path.tracker.ts", () => {
        const tracedPath: TrackPathStatus = trackPath("path.tracker.ts");
        expect(tracedPath.code).toBe(1);
        expect(tracedPath.paths?.[0]).toBe(`${process.cwd()}/src/path.tracker.ts`);
    });

    it("Path non-existence for file - index.html", () => {
        const tracedPath: TrackPathStatus = trackPath("index.html");
        expect(tracedPath.code).toBe(0);
        expect(tracedPath.paths).toBe(null);
    });

    it("Multiple path existence for file -  ", () => {
        // setup
        const rootPath = process.cwd();
        createDIR(`${rootPath}/testFolder`);
        createDIR(`${rootPath}/testFolder/testFolder`);
        createFile(`${rootPath}/testFolder/testFile.txt`);
        createDIR(`${rootPath}/testFolder/testFolder/testFile.txt`);

        const tracedPath: TrackPathStatus = trackPath("testFile.txt");
        expect(tracedPath.code).toBe(1);
        expect(tracedPath.paths?.[0]).toBe(`${rootPath}/testFolder/testFile.txt`);
        expect(tracedPath.paths?.[1]).toBe(`${rootPath}/testFolder/testFolder/testFile.txt`);

        // tear down
        deleteDIR(`${rootPath}/testFolder`);
    });
});
