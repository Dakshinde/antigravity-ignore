import * as vscode from 'vscode';
import * as path from 'path';
import { IgnoreManager } from './ignoreEngine';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('antigravity.addToIgnore', async (uri: vscode.Uri) => {
        if (!uri) {
            vscode.window.showErrorMessage('No file selected to ignore.');
            return;
        }

        const manager = new IgnoreManager();
        const result = manager.findTargetGitignore(uri);

        let finalTarget = result.targetUri;

        // THE "ANTIGRAVITY" HOISTING ALERT
        if (result.potentialHoist) {
            const choice = await vscode.window.showQuickPick(
                [
                    { label: 'Hoist to Root (Best Practice)', description: 'Add rule to the root .gitignore' },
                    { label: 'Keep in Local Folder', description: 'Add rule to the nested .gitignore' }
                ],
                { placeHolder: "Antigravity Detected: Nested .gitignore found. Where should I add this?" }
            );

            if (choice?.label === 'Hoist to Root (Best Practice)') {
                finalTarget = result.rootUri!;
            } else if (choice?.label === 'Keep in Local Folder') {
                finalTarget = result.localUri!;
            } else {
                return; // User cancelled
            }
        }

        // WRITING THE FILE
        if (finalTarget) {
            const appended = manager.appendToGitignore(finalTarget, uri);
            
            if (appended) {
                const action = await vscode.window.showInformationMessage(
                    `✅ Successfully added to ${path.basename(path.dirname(finalTarget.fsPath))} .gitignore!`,
                    'Open File'
                );
                
                if (action === 'Open File') {
                    const doc = await vscode.workspace.openTextDocument(finalTarget);
                    vscode.window.showTextDocument(doc);
                }
            } else {
                vscode.window.showInformationMessage('ℹ️ Path is already in .gitignore.');
            }
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
