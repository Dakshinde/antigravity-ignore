import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export interface GitignoreTargetResult {
    /** 
     * The recommended .gitignore to use. 
     * Prioritizes root, unless logic dictates otherwise. 
     */
    targetUri: vscode.Uri;
    /** The root .gitignore URI, if applicable. */
    rootUri?: vscode.Uri;
    /** The local/nested .gitignore URI, if applicable. */
    localUri?: vscode.Uri;
    /** 
     * Set to true if a nested .gitignore is found concurrently with a root .gitignore.
     * This signals the front-end to prompt for a 'hoisting' interaction. 
     */
    potentialHoist: boolean;
}

export class IgnoreManager {
    /**
     * Identifies the most appropriate .gitignore file based on user's selection path.
     * Resolves workspace location and detects nested gitignore configurations.
     * 
     * @param currentUri The URI of the file/folder selected by the user
     * @returns GitignoreTargetResult
     */
    public findTargetGitignore(currentUri: vscode.Uri): GitignoreTargetResult {
        const fsPath = currentUri.fsPath;
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(currentUri);
        
        let localDir: string;
        try {
            const stat = fs.statSync(fsPath);
            localDir = stat.isDirectory() ? fsPath : path.dirname(fsPath);
        } catch {
            localDir = path.dirname(fsPath);
        }

        if (!workspaceFolder) {
            const fallbackIgnoreFsPath = path.join(localDir, '.gitignore');
            const fallbackUri = vscode.Uri.file(fallbackIgnoreFsPath);
            return {
                targetUri: fallbackUri,
                localUri: fallbackUri,
                potentialHoist: false
            };
        }

        const rootDir = workspaceFolder.uri.fsPath;
        const rootIgnoreFsPath = path.join(rootDir, '.gitignore');
        const localIgnoreFsPath = path.join(localDir, '.gitignore');
        
        const isSameDirectory = path.normalize(rootDir) === path.normalize(localDir);

        const rootExists = fs.existsSync(rootIgnoreFsPath);
        const localExists = !isSameDirectory && fs.existsSync(localIgnoreFsPath);

        const rootUri = vscode.Uri.file(rootIgnoreFsPath);
        const localUri = !isSameDirectory ? vscode.Uri.file(localIgnoreFsPath) : undefined;
        
        const potentialHoist = rootExists && localExists;
        
        let targetUri: vscode.Uri;
        if (rootExists) {
            targetUri = rootUri;
        } else if (localExists) {
            targetUri = localUri!;
        } else {
            targetUri = rootUri;
        }

        return {
            targetUri,
            rootUri,
            localUri: localExists ? localUri : undefined,
            potentialHoist
        };
    }

    /**
     * Checks if a .gitignore exists at the target path; if not, creates an empty file.
     * @param uri The URI of the .gitignore file.
     */
    public ensureGitignoreExists(uri: vscode.Uri): void {
        const fsPath = uri.fsPath;
        if (!fs.existsSync(fsPath)) {
            fs.writeFileSync(fsPath, '', 'utf8');
        }
    }

    /**
     * Appends a given path to a target .gitignore safely. Prevent duplicates and fix forward slashes.
     * @param targetIgnoreUri The .gitignore file
     * @param targetFileUri The file being ignored
     * @returns boolean true if appended, false if it already existed
     */
    public appendToGitignore(targetIgnoreUri: vscode.Uri, targetFileUri: vscode.Uri): boolean {
        this.ensureGitignoreExists(targetIgnoreUri);
        
        const ignoreDir = path.dirname(targetIgnoreUri.fsPath);
        const fileDir = targetFileUri.fsPath;
        
        // Calculate relative path
        let relativePath = path.relative(ignoreDir, fileDir);
        
        // Use path.posix for forward slashes regardless of OS (Windows fixes)
        relativePath = relativePath.split(path.sep).join(path.posix.sep);

        // If the target is a directory, ensure trailing slash
        let isDir = false;
        try {
            isDir = fs.statSync(fileDir).isDirectory();
        } catch(e) {}
        if (isDir && !relativePath.endsWith('/')) {
            relativePath += '/';
        }

        const content = fs.readFileSync(targetIgnoreUri.fsPath, 'utf8');
        const lines = content.split(/\r?\n/).map(l => l.trim());

        // Prevent Duplicate Rules
        if (lines.includes(relativePath) || lines.includes(`/${relativePath}`)) {
            return false;
        }

        const appendText = content.endsWith('\n') || content === '' ? relativePath : `\n${relativePath}`;
        fs.appendFileSync(targetIgnoreUri.fsPath, appendText + '\n', 'utf8');
        return true;
    }
}
