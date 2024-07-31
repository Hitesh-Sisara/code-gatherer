"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const codeGathererTreeDataProvider_1 = require("./codeGathererTreeDataProvider");
const fileGenerator_1 = require("./fileGenerator");
function activate(context) {
    console.log("Code Gatherer extension is now active!");
    const workspaceRoot = vscode.workspace.workspaceFolders &&
        vscode.workspace.workspaceFolders.length > 0
        ? vscode.workspace.workspaceFolders[0].uri.fsPath
        : undefined;
    if (!workspaceRoot) {
        vscode.window.showErrorMessage("Code Gatherer requires a workspace folder to be opened.");
        return;
    }
    const treeDataProvider = new codeGathererTreeDataProvider_1.CodeGathererTreeDataProvider(workspaceRoot);
    const treeView = vscode.window.createTreeView("codeGathererTree", {
        treeDataProvider: treeDataProvider,
        canSelectMany: false,
    });
    let disposable = vscode.commands.registerCommand("codeGatherer.togglePanel", () => {
        vscode.commands.executeCommand("workbench.view.extension.code-gatherer-explorer");
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand("codeGatherer.generateFiles", async () => {
        const selectedItems = treeDataProvider.getSelectedItems();
        if (selectedItems.length === 0) {
            vscode.window.showWarningMessage("No items selected. Please select files or folders to generate AI analysis files.");
            return;
        }
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Generating files for AI analysis...",
            cancellable: false,
        }, async (progress) => {
            try {
                const files = await (0, fileGenerator_1.generateFiles)(selectedItems, progress);
                await (0, fileGenerator_1.copyFirstFileToClipboard)(files);
                vscode.window.showInformationMessage(`Generated ${files.length} file(s) for AI analysis.`);
                if (files.length > 0) {
                    const document = await vscode.workspace.openTextDocument(files[0]);
                    await vscode.window.showTextDocument(document);
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    vscode.window.showErrorMessage(`Error generating files: ${error.message}`);
                }
                else {
                    vscode.window.showErrorMessage("An unknown error occurred while generating files.");
                }
            }
        });
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand("codeGatherer.toggleSelection", (item) => {
        treeDataProvider.toggleSelection(item);
    });
    context.subscriptions.push(disposable);
    treeView.onDidChangeSelection((event) => {
        if (event.selection.length > 0) {
            treeDataProvider.toggleSelection(event.selection[0]);
        }
    });
    context.subscriptions.push(treeView);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map