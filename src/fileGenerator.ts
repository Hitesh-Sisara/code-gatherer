import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

const MAX_CHARACTERS = 800000; // Approximately 800,000 characters

export async function generateFiles(
  selectedItems: string[],
  progress: vscode.Progress<{ message?: string; increment?: number }>
): Promise<string[]> {
  const outputFolder = path.join(
    vscode.workspace.workspaceFolders![0].uri.fsPath,
    "CodeGatherer"
  );
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }

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

  currentFileContent += `# Here is code from the our project for analysis and improvement. Please review and study this existing code and provide production-ready code with file names and file paths. Make sure to provide a separate artifact for each file.

`;

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
    const fileContent = await fs.promises.readFile(filePath, "utf8");
    const fileExtension = path.extname(filePath).toLowerCase();
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

export async function copyFirstFileToClipboard(
  generatedFiles: string[]
): Promise<void> {
  if (generatedFiles.length > 0) {
    const content = await fs.promises.readFile(generatedFiles[0], "utf8");
    await vscode.env.clipboard.writeText(content);
  }
}

function getLanguageFromExtension(extension: string): string {
  const languageMap: { [key: string]: string } = {
    // Web development
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

    // Server-side languages
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

    // Shell and scripting
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

    // Markup and config
    ".md": "markdown",
    ".markdown": "markdown",
    ".yaml": "yaml",
    ".yml": "yaml",
    ".toml": "toml",
    ".ini": "ini",
    ".cfg": "ini",
    ".conf": "conf",
    ".properties": "properties",

    // C-family languages
    ".c": "c",
    ".h": "c",
    ".cpp": "cpp",
    ".hpp": "cpp",
    ".cc": "cpp",
    ".cxx": "cpp",
    ".m": "objectivec",
    ".mm": "objectivec",

    // Database
    ".sql": "sql",
    ".mysql": "sql",
    ".pgsql": "sql",
    ".plsql": "plsql",

    // Other programming languages
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

    // Web assembly
    ".wat": "wat",
    ".wasm": "wasm",

    // Game development
    ".gd": "gdscript",
    ".as": "actionscript",

    // DevOps and infrastructure
    ".tf": "terraform",
    ".tfvars": "terraform",
    ".hcl": "hcl",
    ".dockerfile": "dockerfile",
    ".dockerignore": "dockerignore",
    ".vagrantfile": "ruby",
    ".jenkinsfile": "groovy",

    // Data serialization
    ".proto": "protobuf",
    ".thrift": "thrift",

    // Template engines
    ".ejs": "ejs",
    ".pug": "pug",
    ".hbs": "handlebars",
    ".mustache": "mustache",
    ".twig": "twig",
    ".liquid": "liquid",

    // Others
    ".graphql": "graphql",
    ".dot": "dot",
    ".tex": "latex",
    ".rst": "restructuredtext",
    ".asciidoc": "asciidoc",
    ".adoc": "asciidoc",

    // Mobile development (without duplicates)
    ".swift": "swift",
  };

  return languageMap[extension.toLowerCase()] || "plaintext";
}
