import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import {
  BINARY_FILE_EXTENSIONS,
  LANGUAGE_MAP,
  MAX_CHARACTERS,
  SYSTEM_GENERATED_FILES,
} from "./constants";

export async function generateFiles(
  selectedItems: string[],
  progress: vscode.Progress<{ message?: string; increment?: number }>
): Promise<string[]> {
  const outputFolder = getOutputFolder();
  const timestamp = new Date().toISOString().replace(/[:]/g, "-").split(".")[0];
  let fileIndex = 0;
  let currentFileContent = "";
  let currentCharCount = 0;
  const generatedFiles: string[] = [];

  const writeFile = () => {
    if (currentFileContent) {
      const fileName = path.join(
        outputFolder,
        `code-analysis-${timestamp}-${fileIndex}.md`
      );
      fs.writeFileSync(fileName, currentFileContent);
      generatedFiles.push(fileName);
      fileIndex++;
      currentFileContent = "";
      currentCharCount = 0;
    }
  };

  currentFileContent = getInitialContent();

  const totalItems = selectedItems.length;
  let processedItems = 0;

  for (const item of selectedItems) {
    if (fs.statSync(item).isDirectory()) {
      await processDirectory(item);
    } else {
      await processFile(item);
    }
    processedItems++;
    progress.report({ increment: (processedItems / totalItems) * 100 });
  }

  writeFile(); // Write the last file if there's any content left

  return generatedFiles;

  async function processDirectory(dirPath: string): Promise<void> {
    const files = await fs.promises.readdir(dirPath);
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      if (
        SYSTEM_GENERATED_FILES.includes(file) ||
        SYSTEM_GENERATED_FILES.includes(path.basename(dirPath))
      ) {
        continue; // Skip system-generated files and directories
      }
      if (fs.statSync(fullPath).isDirectory()) {
        await processDirectory(fullPath);
      } else {
        await processFile(fullPath);
      }
    }
  }

  async function processFile(filePath: string): Promise<void> {
    const relativePath = path.relative(
      vscode.workspace.workspaceFolders![0].uri.fsPath,
      filePath
    );
    const fileExtension = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath);

    if (SYSTEM_GENERATED_FILES.includes(fileName)) {
      return; // Skip system-generated files
    }

    let content = `\n## File: ${relativePath}\n\n`;

    if (BINARY_FILE_EXTENSIONS.includes(fileExtension)) {
      content += `Binary file: ${fileName} (${fileExtension.slice(1)} file)\n`;
    } else {
      try {
        const fileContent = await fs.promises.readFile(filePath, "utf8");
        const language = getLanguageFromExtension(fileExtension);
        content += `Here is the existing code for ${relativePath}:\n\n\`\`\`${language}\n${fileContent}\n\`\`\`\n`;
      } catch (error) {
        content += `Unable to read file content: ${fileName}\n`;
      }
    }

    if (currentCharCount + content.length > MAX_CHARACTERS) {
      writeFile();
      currentFileContent += `\n\n(Continued from previous file)\n\n`;
    }

    currentFileContent += content;
    currentCharCount += content.length;
  }
}

export async function copyFirstFileToClipboard(
  generatedFiles: string[]
): Promise<void> {
  if (generatedFiles.length > 0) {
    const content = await fs.promises.readFile(generatedFiles[0], "utf8");
    await vscode.env.clipboard.writeText(content);
  }
}

function getOutputFolder(): string {
  const outputFolder = path.join(
    vscode.workspace.workspaceFolders![0].uri.fsPath,
    "CodeGatherer"
  );
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }
  return outputFolder;
}

function getInitialContent(): string {
  return `# Code from our project for analysis and improvement

Please review and study this existing code and provide production-ready code with file names and file paths. Make sure to provide a separate artifact for each file.

`;
}

function getLanguageFromExtension(extension: string): string {
  return LANGUAGE_MAP[extension.toLowerCase()] || "plaintext";
}
