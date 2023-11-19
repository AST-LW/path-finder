<div style="text-align:center;">
    <img src="https://raw.githubusercontent.com/AST-LW/path-tracker/blob/main/images/path-tracker-cover-image.png" alt="path-tracker-cover-image" width="500" height="400">
</div>

# Path Tracker

Path Tracker is a Node.js library designed for efficiently tracking and locating files and directories within complex project structures. It addresses the limitations of traditional file path management, such as hardcoding paths or manual directory traversal, providing a more dynamic and reliable way to handle file paths in evolving projects.

## Features

-   **trackRootPath**: Retrieve the root path of your current working directory.
-   **trackRelativePath**: Search for paths that include a specified relative path segment, ideal for locating both files and directories.

## Installation

```bash
npm install path-tracker
```

## Module Support

Path Tracker supports both ES6 and CommonJS modules.

### ES6 Import

```javascript
import { trackRootPath, trackRelativePath } from "path-tracker";
```

### CommonJS Require

```javascript
const { trackRootPath, trackRelativePath } = require("path-tracker");
```

## Usage

### Getting the Root Path

```javascript
const rootPath = trackRootPath();
console.log(rootPath); // Outputs the current working directory path
```

### Tracking a Relative Path

```javascript
const searchResult = trackRelativePath("/index.js");
console.log(searchResult);
// Outputs paths that include '/index.js' or indicates no paths found with null value
```

## API Reference

### `trackRootPath()`

Returns the root path of the current working directory.

### `trackRelativePath(relativePathSegment, rootPath, [excludeSearchIn])`

The `trackRelativePath` function is designed to search for paths that include a specified relative path segment. By default, it searches from the root path of the project, but you can set a specific root path to restrict the search area. Additionally, the `excludeSearchIn` parameter is used to exclude directories from the search, with `node_modules` being excluded by default to optimize performance.

-   **Parameters**:

    -   `relativePathSegment` (string): The relative path segment to find.
    -   `rootPath` (string, optional): The root path from where to start the search, defaults to the current working directory.
    -   `excludeSearchIn` (string[], optional): Directories to exclude from the search. Defaults to `["node_modules"]`.

-   **Returns**: An object with:
    -   `code` (number): 1 for success, 0 for no paths found.
    -   `paths` (string[] | null): Array of found paths or null if none found.

## Sample Directory Structure

To illustrate the capabilities of Path Tracker, the following directory structure is used in our examples. Please note that these examples assume 'playground' as the root directory of the project for demonstration purposes:

```
+-- playground
    +-- dir
        +-- dir1
            |-- file1.txt
        +-- dir2
            |-- file1.txt
    +-- existingDir
    +-- complexDir
        +-- subDir1
            |-- fileA.js
        +-- subDir2
            +-- dir
            |-- fileA.js
    +-- config
        |-- settings.json
```

## Example Scenarios

1. **Single File Found**:

    ```javascript
    // Assuming 'playground' is the root directory
    const singleFileResult = trackRelativePath("/settings.json");
    // Output: { code: 1, paths: ['/playground/config/settings.json'] }
    ```

2. **Multiple Files Found**:

    ```javascript
    // Assuming 'playground' is the root directory
    const multipleFilesResult = trackRelativePath("/fileA.js");
    // Output: { code: 1, paths: ['/playground/complexDir/subDir1/fileA.js', '/playground/complexDir/subDir2/fileA.js'] }
    ```

3. **Single Directory Found**:

    ```javascript
    // Assuming 'playground' is the root directory
    const singleDirResult = trackRelativePath("/existingDir");
    // Output: { code: 1, paths: ['/playground/existingDir'] }
    ```

4. **Multiple Directories Found**:

    ```javascript
    // Assuming 'playground' is the root directory
    const multipleDirsResult = trackRelativePath("/dir");
    // Output: { code: 1, paths: ['/playground/dir', '/playground/complexDir/subDir2/dir'] }
    ```

5. **No File or Directory Found (code 0)**:

    ```javascript
    // Assuming 'playground' is the root directory
    const noResult = trackRelativePath("/nonexistent.txt");
    // Output: { code: 0, paths: null }
    ```

6. **Directory Exists but File Not Found (code 0)**:

    ```javascript
    // Assuming 'playground' is the root directory
    const noFileInDirResult = trackRelativePath("/existingDir/nonexistent.txt");
    // Output: { code: 0, paths: null }
    ```

7. **Restricted Search Area with Root Path**:

    ```javascript
    // Assuming 'playground' is the root directory
    const restrictedSearchResult = trackRelativePath("/file1.txt", "/playground/dir/dir1");
    // Output: { code: 1, paths: ['/playground/dir/dir1/file1.txt'] }
    ```

8. **Using `excludeSearchIn` to Exclude Directories**:
    ```javascript
    // Assuming 'playground' is the root directory
    const excludeSearchResult = trackRelativePath("/fileA.js", "/playground", ["complexDir/subDir2"]);
    // Output: { code: 1, paths: ['/playground/complexDir/subDir1/fileA.js'] }
    ```

These examples are designed to provide a clear understanding of how Path Tracker functions in different scenarios. Remember to adjust the paths according to your project's directory structure.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or create issues for bugs, suggestions, or new features.
