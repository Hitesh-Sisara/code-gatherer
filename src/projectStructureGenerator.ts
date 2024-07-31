import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

const DEFAULT_IGNORE_PATTERNS = [
  "node_modules",
  ".git",
  ".next",
  "build",
  "dist",
  "out",
  "target",
  "vendor",
  "__pycache__",
  ".vscode",
  ".idea",
  "*.pyc",
  "*.pyo",
  "*.pyd",
  "*.class",
  "*.log",
  "*.sqlite",
  "*.swp",
  ".DS_Store",
  "Thumbs.db",
];

export async function generateProjectStructure(
  rootPath: string
): Promise<string> {
  const ignorePatterns = await getIgnorePatterns(rootPath);
  const structure = await generateStructure(rootPath, "", ignorePatterns);
  const savedFilePath = await saveStructureToFile(rootPath, structure);
  return savedFilePath;
}

async function getIgnorePatterns(rootPath: string): Promise<string[]> {
  const gitignorePath = path.join(rootPath, ".gitignore");
  let gitignorePatterns: string[] = [];

  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = await fs.promises.readFile(gitignorePath, "utf-8");
    gitignorePatterns = gitignoreContent
      .split("\n")
      .filter((line) => line.trim() !== "" && !line.startsWith("#"))
      .map((line) => line.trim());
  }

  return [...DEFAULT_IGNORE_PATTERNS, ...gitignorePatterns];
}

async function generateStructure(
  currentPath: string,
  indent: string,
  ignorePatterns: string[]
): Promise<string> {
  const items = await fs.promises.readdir(currentPath);
  let structure = "";

  for (const item of items) {
    const fullPath = path.join(currentPath, item);
    const relativePath = path.relative(
      vscode.workspace.rootPath || "",
      fullPath
    );

    if (shouldIgnore(relativePath, ignorePatterns)) {
      continue;
    }

    const stats = await fs.promises.stat(fullPath);

    if (stats.isDirectory()) {
      structure += `${indent}├── ${item}/\n`;
      structure += await generateStructure(
        fullPath,
        indent + "│   ",
        ignorePatterns
      );
    } else {
      structure += `${indent}├── ${item}\n`;
    }
  }

  return structure;
}

function shouldIgnore(itemPath: string, ignorePatterns: string[]): boolean {
  return ignorePatterns.some((pattern) => {
    const regex = new RegExp(`^${pattern.replace(/\*/g, ".*")}$`);
    return regex.test(itemPath) || itemPath.includes(`/${pattern}`);
  });
}

async function saveStructureToFile(
  rootPath: string,
  structure: string
): Promise<string> {
  const outputFolder = path.join(rootPath, "CodeGatherer");
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }

  const timestamp = new Date().toISOString().replace(/[:]/g, "-").split(".")[0];
  const fileName = `project-structure-${timestamp}.txt`;
  const filePath = path.join(outputFolder, fileName);

  await fs.promises.writeFile(filePath, structure, "utf-8");
  return filePath;
}
