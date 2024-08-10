import * as vscode from "vscode";
import {
  CodeGathererTreeDataProvider,
  CodeGathererTreeItem,
} from "./TreeDataProvider";
import { copyFirstFileToClipboard, generateFiles } from "./fileGenerator";
import { generateProjectStructure } from "./projectStructureGenerator";

export function activate(context: vscode.ExtensionContext) {
  console.log("Code Gatherer extension is now active!");

  const workspaceRoot = getWorkspaceRoot();
  if (!workspaceRoot) {
    vscode.window.showErrorMessage(
      "Code Gatherer requires a workspace folder to be opened."
    );
    return;
  }

  const treeDataProvider = new CodeGathererTreeDataProvider(workspaceRoot);
  const treeView = vscode.window.createTreeView("codeGathererTree", {
    treeDataProvider: treeDataProvider,
    canSelectMany: false,
  });

  registerCommands(context, treeDataProvider, workspaceRoot);

  treeView.onDidChangeSelection((event) => {
    if (event.selection.length > 0) {
      treeDataProvider.toggleSelection(event.selection[0]);
    }
  });

  context.subscriptions.push(treeView);
}

function getWorkspaceRoot(): string | undefined {
  return vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : undefined;
}

function registerCommands(
  context: vscode.ExtensionContext,
  treeDataProvider: CodeGathererTreeDataProvider,
  workspaceRoot: string
) {
  const commands = [
    {
      command: "codeGatherer.togglePanel",
      callback: () => {
        vscode.commands.executeCommand(
          "workbench.view.extension.code-gatherer-explorer"
        );
      },
    },
    {
      command: "codeGatherer.generateFiles",
      callback: () => generateFilesCommand(treeDataProvider),
    },
    {
      command: "codeGatherer.toggleSelection",
      callback: (item: CodeGathererTreeItem) => {
        treeDataProvider.toggleSelection(item);
      },
    },
    {
      command: "codeGatherer.generateProjectStructure",
      callback: () => generateProjectStructureCommand(workspaceRoot),
    },
  ];

  commands.forEach((cmd) => {
    const disposable = vscode.commands.registerCommand(
      cmd.command,
      cmd.callback
    );
    context.subscriptions.push(disposable);
  });
}

async function generateFilesCommand(
  treeDataProvider: CodeGathererTreeDataProvider
) {
  const selectedItems = treeDataProvider.getSelectedItems();
  if (selectedItems.length === 0) {
    vscode.window.showWarningMessage(
      "No items selected. Please select files or folders to generate AI analysis files."
    );
    return;
  }

  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Generating files for AI analysis...",
      cancellable: false,
    },
    async (progress) => {
      try {
        const files = await generateFiles(selectedItems, progress);
        await copyFirstFileToClipboard(files);

        vscode.window.showInformationMessage(
          `Generated ${files.length} file(s) for AI analysis.`
        );

        if (files.length > 0) {
          const document = await vscode.workspace.openTextDocument(files[0]);
          await vscode.window.showTextDocument(document);
        }
      } catch (error) {
        handleError(error);
      }
    }
  );
}

async function generateProjectStructureCommand(workspaceRoot: string) {
  try {
    const filePath = await generateProjectStructure(workspaceRoot);
    const document = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(document);
    vscode.window.showInformationMessage(
      `Project structure saved to ${filePath}`
    );
  } catch (error) {
    handleError(error);
  }
}

function handleError(error: unknown) {
  if (error instanceof Error) {
    vscode.window.showErrorMessage(`Error: ${error.message}`);
  } else {
    vscode.window.showErrorMessage("An unknown error occurred.");
  }
}

export function deactivate() {}
