import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

export class CodeGathererTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly isFolder: boolean,
    public readonly fullPath: string,
    public isSelected: boolean = false,
    public parent: CodeGathererTreeItem | undefined = undefined
  ) {
    super(label, collapsibleState);
    this.contextValue = isFolder ? "folder" : "file";
    this.resourceUri = vscode.Uri.file(fullPath);
    this.updateDescription();
  }

  updateDescription() {
    if (this.isSelected) {
      this.description = "Selected";
      this.iconPath = new vscode.ThemeIcon(
        "check",
        new vscode.ThemeColor("charts.green")
      );
    } else {
      this.description = "";
      this.iconPath = this.isFolder
        ? vscode.ThemeIcon.Folder
        : vscode.ThemeIcon.File;
    }
  }
}

export class CodeGathererTreeDataProvider
  implements vscode.TreeDataProvider<CodeGathererTreeItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    CodeGathererTreeItem | undefined | null | void
  > = new vscode.EventEmitter<CodeGathererTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    CodeGathererTreeItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  private items: Map<string, CodeGathererTreeItem> = new Map();

  constructor(private workspaceRoot: string) {}

  getTreeItem(element: CodeGathererTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: CodeGathererTreeItem): Promise<CodeGathererTreeItem[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage("No workspace folder open");
      return Promise.resolve([]);
    }

    if (element) {
      return this.getFileItems(element.fullPath, element);
    } else {
      return this.getFileItems(this.workspaceRoot);
    }
  }

  private async getFileItems(
    folderPath: string,
    parent?: CodeGathererTreeItem
  ): Promise<CodeGathererTreeItem[]> {
    const items = await fs.promises.readdir(folderPath);
    return items
      .filter((item) => item !== "ai" && item !== "CodeGatherer") // Filter out "ai" and "CodeGatherer" directories
      .map((item) => {
        const fullPath = path.join(folderPath, item);
        const stat = fs.statSync(fullPath);
        const treeItem = new CodeGathererTreeItem(
          item,
          stat.isDirectory()
            ? vscode.TreeItemCollapsibleState.Collapsed
            : vscode.TreeItemCollapsibleState.None,
          stat.isDirectory(),
          fullPath,
          false,
          parent
        );
        this.items.set(fullPath, treeItem);
        return treeItem;
      });
  }

  getParent(
    element: CodeGathererTreeItem
  ): vscode.ProviderResult<CodeGathererTreeItem> {
    return element.parent;
  }

  toggleSelection(item: CodeGathererTreeItem): void {
    item.isSelected = !item.isSelected;
    item.updateDescription();
    this._onDidChangeTreeData.fire(item);
  }

  getSelectedItems(): string[] {
    return Array.from(this.items.values())
      .filter((item) => item.isSelected)
      .map((item) => item.fullPath);
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}
