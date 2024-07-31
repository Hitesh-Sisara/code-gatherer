// src/extension.ts
import * as vscode3 from "vscode";

// src/codeGathererTreeDataProvider.ts
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

class CodeGathererTreeItem extends vscode.TreeItem {
  label;
  collapsibleState;
  isFolder;
  fullPath;
  isSelected;
  parent;
  constructor(label, collapsibleState, isFolder, fullPath, isSelected = false, parent = undefined) {
    super(label, collapsibleState);
    this.label = label;
    this.collapsibleState = collapsibleState;
    this.isFolder = isFolder;
    this.fullPath = fullPath;
    this.isSelected = isSelected;
    this.parent = parent;
    this.contextValue = isFolder ? "folder" : "file";
    this.resourceUri = vscode.Uri.file(fullPath);
    this.updateDescription();
  }
  updateDescription() {
    if (this.isSelected) {
      this.description = "Selected";
      this.iconPath = new vscode.ThemeIcon("check", new vscode.ThemeColor("charts.green"));
    } else {
      this.description = "";
      this.iconPath = this.isFolder ? vscode.ThemeIcon.Folder : vscode.ThemeIcon.File;
    }
  }
}

class CodeGathererTreeDataProvider {
  workspaceRoot;
  _onDidChangeTreeData = new vscode.EventEmitter;
  onDidChangeTreeData = this._onDidChangeTreeData.event;
  items = new Map;
  constructor(workspaceRoot) {
    this.workspaceRoot = workspaceRoot;
  }
  getTreeItem(element) {
    return element;
  }
  getChildren(element) {
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
  async getFileItems(folderPath, parent) {
    const items = await fs.promises.readdir(folderPath);
    return items.filter((item) => item !== "ai" && item !== "CodeGatherer").map((item) => {
      const fullPath = path.join(folderPath, item);
      const stat = fs.statSync(fullPath);
      const treeItem = new CodeGathererTreeItem(item, stat.isDirectory() ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None, stat.isDirectory(), fullPath, false, parent);
      this.items.set(fullPath, treeItem);
      return treeItem;
    });
  }
  getParent(element) {
    return element.parent;
  }
  toggleSelection(item) {
    item.isSelected = !item.isSelected;
    item.updateDescription();
    this._onDidChangeTreeData.fire(item);
  }
  getSelectedItems() {
    return Array.from(this.items.values()).filter((item) => item.isSelected).map((item) => item.fullPath);
  }
  refresh() {
    this._onDidChangeTreeData.fire();
  }
}

// src/fileGenerator.ts
import * as fs2 from "fs";
import * as path2 from "path";
import * as vscode2 from "vscode";
async function generateFiles(selectedItems, progress) {
  const outputFolder = path2.join(vscode2.workspace.workspaceFolders[0].uri.fsPath, "CodeGatherer");
  if (!fs2.existsSync(outputFolder)) {
    fs2.mkdirSync(outputFolder);
  }
  const timestamp = new Date().toISOString().replace(/[:]/g, "-").split(".")[0];
  let fileIndex = 0;
  let currentFileContent = "";
  let currentCharCount = 0;
  const generatedFiles = [];
  const writeFile = () => {
    if (currentFileContent) {
      const fileName = path2.join(outputFolder, `code-analysis-${timestamp}-${fileIndex}.md`);
      fs2.writeFileSync(fileName, currentFileContent);
      generatedFiles.push(fileName);
      fileIndex++;
      currentFileContent = "";
      currentCharCount = 0;
    }
  };
  currentFileContent += `# Code Analysis for AI Assistant

This document contains code from the project for analysis and improvement. Please review and study this existing code and provide production-ready code with file names and file paths. Make sure to provide a separate artifact for each file.

`;
  const totalItems = selectedItems.length;
  let processedItems = 0;
  for (const item of selectedItems) {
    if (fs2.statSync(item).isDirectory()) {
      await processDirectory(item);
    } else {
      await processFile(item);
    }
    processedItems++;
    progress.report({ increment: processedItems / totalItems * 100 });
  }
  writeFile();
  return generatedFiles;
  async function processDirectory(dirPath) {
    const files = await fs2.promises.readdir(dirPath);
    for (const file of files) {
      const fullPath = path2.join(dirPath, file);
      if (fs2.statSync(fullPath).isDirectory()) {
        await processDirectory(fullPath);
      } else {
        await processFile(fullPath);
      }
    }
  }
  async function processFile(filePath) {
    const relativePath = path2.relative(vscode2.workspace.workspaceFolders[0].uri.fsPath, filePath);
    const fileContent = await fs2.promises.readFile(filePath, "utf8");
    const fileExtension = path2.extname(filePath).toLowerCase();
    const language = getLanguageFromExtension(fileExtension);
    const content = `\n## File: ${relativePath}\n\nHere is the existing code for ${relativePath}:\n\n\`\`\`${language}\n${fileContent}\n\`\`\`\n`;
    if (currentCharCount + content.length > MAX_CHARACTERS) {
      writeFile();
      currentFileContent += `\n\n(Continued from previous file)\n\n`;
    }
    currentFileContent += content;
    currentCharCount += content.length;
  }
}
var getLanguageFromExtension = function(extension) {
  const languageMap = {
    ".html": "html",
    ".htm": "html",
    ".css": "css",
    ".scss": "scss",
    ".sass": "sass",
    ".less": "less",
    ".js": "javascript",
    ".jsx": "jsx",
    ".ts": "typescript",
    ".tsx": "tsx",
    ".json": "json",
    ".xml": "xml",
    ".svg": "svg",
    ".php": "php",
    ".py": "python",
    ".rb": "ruby",
    ".java": "java",
    ".class": "java",
    ".cs": "csharp",
    ".go": "go",
    ".rs": "rust",
    ".scala": "scala",
    ".kt": "kotlin",
    ".kts": "kotlin",
    ".groovy": "groovy",
    ".gradle": "gradle",
    ".sh": "bash",
    ".bash": "bash",
    ".zsh": "zsh",
    ".fish": "fish",
    ".ps1": "powershell",
    ".bat": "batch",
    ".cmd": "batch",
    ".vbs": "vbscript",
    ".vb": "vb",
    ".pl": "perl",
    ".pm": "perl",
    ".t": "perl",
    ".lua": "lua",
    ".md": "markdown",
    ".markdown": "markdown",
    ".yaml": "yaml",
    ".yml": "yaml",
    ".toml": "toml",
    ".ini": "ini",
    ".cfg": "ini",
    ".conf": "conf",
    ".properties": "properties",
    ".c": "c",
    ".h": "c",
    ".cpp": "cpp",
    ".hpp": "cpp",
    ".cc": "cpp",
    ".cxx": "cpp",
    ".m": "objectivec",
    ".mm": "objectivec",
    ".sql": "sql",
    ".mysql": "sql",
    ".pgsql": "sql",
    ".plsql": "plsql",
    ".hs": "haskell",
    ".lhs": "haskell",
    ".elm": "elm",
    ".clj": "clojure",
    ".cljs": "clojure",
    ".cljc": "clojure",
    ".erl": "erlang",
    ".ex": "elixir",
    ".exs": "elixir",
    ".eex": "elixir",
    ".r": "r",
    ".rmd": "rmd",
    ".jl": "julia",
    ".dart": "dart",
    ".f": "fortran",
    ".f90": "fortran",
    ".fs": "fsharp",
    ".fsx": "fsharp",
    ".pas": "pascal",
    ".d": "d",
    ".v": "v",
    ".nim": "nim",
    ".cr": "crystal",
    ".wat": "wat",
    ".wasm": "wasm",
    ".gd": "gdscript",
    ".as": "actionscript",
    ".tf": "terraform",
    ".tfvars": "terraform",
    ".hcl": "hcl",
    ".dockerfile": "dockerfile",
    ".dockerignore": "dockerignore",
    ".vagrantfile": "ruby",
    ".jenkinsfile": "groovy",
    ".proto": "protobuf",
    ".thrift": "thrift",
    ".ejs": "ejs",
    ".pug": "pug",
    ".hbs": "handlebars",
    ".mustache": "mustache",
    ".twig": "twig",
    ".liquid": "liquid",
    ".graphql": "graphql",
    ".dot": "dot",
    ".tex": "latex",
    ".rst": "restructuredtext",
    ".asciidoc": "asciidoc",
    ".adoc": "asciidoc",
    ".swift": "swift"
  };
  return languageMap[extension.toLowerCase()] || "plaintext";
};
var MAX_CHARACTERS = 800000;

// src/extension.ts
function activate(context) {
  console.log("Code Gatherer extension is now active!");
  const workspaceRoot = vscode3.workspace.workspaceFolders && vscode3.workspace.workspaceFolders.length > 0 ? vscode3.workspace.workspaceFolders[0].uri.fsPath : undefined;
  if (!workspaceRoot) {
    vscode3.window.showErrorMessage("Code Gatherer requires a workspace folder to be opened.");
    return;
  }
  const treeDataProvider = new CodeGathererTreeDataProvider(workspaceRoot);
  const treeView = vscode3.window.createTreeView("codeGathererTree", {
    treeDataProvider,
    canSelectMany: false
  });
  let disposable = vscode3.commands.registerCommand("codeGatherer.togglePanel", () => {
    vscode3.commands.executeCommand("workbench.view.extension.code-gatherer-explorer");
  });
  context.subscriptions.push(disposable);
  disposable = vscode3.commands.registerCommand("codeGatherer.generateFiles", async () => {
    const selectedItems = treeDataProvider.getSelectedItems();
    if (selectedItems.length === 0) {
      vscode3.window.showWarningMessage("No items selected. Please select files or folders to generate AI analysis files.");
      return;
    }
    vscode3.window.withProgress({
      location: vscode3.ProgressLocation.Notification,
      title: "Generating files for AI analysis...",
      cancellable: false
    }, async (progress) => {
      try {
        const files = await generateFiles(selectedItems, progress);
        vscode3.window.showInformationMessage(`Generated ${files.length} file(s) for AI analysis.`);
        if (files.length > 0) {
          const document = await vscode3.workspace.openTextDocument(files[0]);
          await vscode3.window.showTextDocument(document);
        }
      } catch (error) {
        if (error instanceof Error) {
          vscode3.window.showErrorMessage(`Error generating files: ${error.message}`);
        } else {
          vscode3.window.showErrorMessage("An unknown error occurred while generating files.");
        }
      }
    });
  });
  context.subscriptions.push(disposable);
  disposable = vscode3.commands.registerCommand("codeGatherer.toggleSelection", (item) => {
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
function deactivate() {
}
export {
  deactivate,
  activate
};
